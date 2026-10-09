
const mongoose = require('mongoose');

const Token = require('../models/Token');
const Office = require('../models/Office');
const Counter = require('../models/Counter');
const ExpressError = require('../utils/ExpressError');
const {
  getTodayBounds,
  expirePreviousDayUnservedTokens
} = require('../utils/officeSchedule');

// Socket.IO helper
const emitQueueUpdate = (req, officeId, event, data) => {
  const io = req.app.get('io');

  if (!io) return;

  io.to(`office:${officeId}`).emit(event, data);
};

// 1. GET /api/operator/dashboard
const getDashboard = async (req, res) => {
  if (!req.user.officeId || !req.user.counterId) {
    throw new ExpressError(
      400,
      'Operator is not assigned to an office and counter'
    );
  }

  await expirePreviousDayUnservedTokens();
  const { start, end } = getTodayBounds();

  const office = await Office.findById(req.user.officeId);
  if (!office) {
    throw new ExpressError(404, 'Assigned office not found');
  }

  const counter = await Counter.findById(req.user.counterId)
    .populate('currentTokenId');

  if (!counter) {
    throw new ExpressError(404, 'Assigned counter not found');
  }

  let currentToken = null;

  if (counter.currentTokenId) {
    currentToken = await Token.findById(
      counter.currentTokenId._id || counter.currentTokenId
    )
      .populate('serviceId', 'name averageServiceTime')
      .populate('userId', 'name email');
  }

  const waitingCount = await Token.countDocuments({
    officeId: req.user.officeId,
    status: 'WAITING',
    createdAt: { $gte: start, $lt: end }
  });

  res.status(200).json({
    success: true,
    dashboard: {
      operator: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      },
      office,
      counter,
      currentToken,
      waitingCount
    }
  });
};

// 2. GET /api/operator/queue
const getQueue = async (req, res) => {
  if (!req.user.officeId) {
    throw new ExpressError(400, 'Operator is not assigned to an office');
  }

  await expirePreviousDayUnservedTokens();
  const { start, end } = getTodayBounds();

  const queue = await Token.find({
    officeId: req.user.officeId,
    status: { $in: ['WAITING', 'CALLED', 'SERVING'] },
    createdAt: { $gte: start, $lt: end }
  })
    .sort({ createdAt: 1 })
    .populate('serviceId', 'name code averageServiceTime')
    .populate('counterId', 'name number status')
    .select('tokenNumber status serviceId counterId createdAt calledAt startedAt');

  res.status(200).json({
    success: true,
    queue
  });
};

// 3. POST /api/operator/tokens/next
const callNextToken = async (req, res) => {
  if (!req.user.officeId || !req.user.counterId) {
    throw new ExpressError(
      400,
      'Operator is not assigned to an office and counter'
    );
  }

  await expirePreviousDayUnservedTokens();
  const { start, end } = getTodayBounds();

  const counter = await Counter.findById(req.user.counterId);

  if (!counter) {
    throw new ExpressError(404, 'Assigned counter not found');
  }

  if (counter.status === 'PAUSED' || counter.status === 'OFFLINE') {
    throw new ExpressError(
      400,
      `Cannot call token when counter is ${counter.status}`
    );
  }

  if (counter.currentTokenId) {
    const activeCurrentToken = await Token.findById(
      counter.currentTokenId
    );

    if (
      activeCurrentToken &&
      ['CALLED', 'SERVING'].includes(activeCurrentToken.status)
    ) {
      throw new ExpressError(
        409,
        'Counter already has an active token. Complete or skip it before calling the next token.'
      );
    }
  }

  const nextToken = await Token.findOne({
    officeId: req.user.officeId,
    status: 'WAITING',
    createdAt: { $gte: start, $lt: end }
  }).sort({ createdAt: 1 });

  if (!nextToken) {
    return res.status(200).json({
      success: false,
      message: 'No waiting tokens'
    });
  }

  nextToken.counterId = req.user.counterId;
  nextToken.status = 'CALLED';
  nextToken.calledAt = new Date();

  counter.currentTokenId = nextToken._id;

  await nextToken.save();
  await counter.save();

  const officeId = nextToken.officeId.toString();

  emitQueueUpdate(req, officeId, 'queue:updated', {
    officeId,
    tokenId: nextToken._id.toString(),
    tokenNumber: nextToken.tokenNumber,
    status: nextToken.status
  });

  emitQueueUpdate(req, officeId, 'token:called', {
    tokenNumber: nextToken.tokenNumber,
    counterId: counter._id.toString(),
    status: nextToken.status
  });

  res.status(200).json({
    success: true,
    message: 'Next token called successfully',
    token: nextToken
  });
};

// 4. POST /api/operator/tokens/:tokenId/start
const startToken = async (req, res) => {
  await expirePreviousDayUnservedTokens();

  const { tokenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tokenId)) {
    throw new ExpressError(400, 'Invalid token ID format');
  }

  const token = await Token.findById(tokenId);

  if (!token) {
    throw new ExpressError(404, 'Token not found');
  }

  if (token.officeId.toString() !== req.user.officeId.toString()) {
    throw new ExpressError(403, 'Token does not belong to your office');
  }

  if (
    !token.counterId ||
    token.counterId.toString() !== req.user.counterId.toString()
  ) {
    throw new ExpressError(403, 'Token does not belong to your counter');
  }

  if (token.status !== 'CALLED') {
    throw new ExpressError(
      409,
      `Cannot start token with status '${token.status}'. Token must be CALLED.`
    );
  }

  token.status = 'SERVING';
  token.startedAt = new Date();

  await token.save();

  const officeId = token.officeId.toString();

  emitQueueUpdate(req, officeId, 'queue:updated', {
    officeId,
    tokenId: token._id.toString(),
    tokenNumber: token.tokenNumber,
    status: token.status
  });

  emitQueueUpdate(req, officeId, 'token:started', {
    tokenNumber: token.tokenNumber,
    counterId: token.counterId.toString(),
    status: token.status
  });

  res.status(200).json({
    success: true,
    message: 'Token service started',
    token
  });
};

// 5. POST /api/operator/tokens/:tokenId/complete
const completeToken = async (req, res) => {
  const { tokenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tokenId)) {
    throw new ExpressError(400, 'Invalid token ID format');
  }

  const token = await Token.findById(tokenId);

  if (!token) {
    throw new ExpressError(404, 'Token not found');
  }

  if (token.officeId.toString() !== req.user.officeId.toString()) {
    throw new ExpressError(403, 'Token does not belong to your office');
  }

  if (
    !token.counterId ||
    token.counterId.toString() !== req.user.counterId.toString()
  ) {
    throw new ExpressError(403, 'Token does not belong to your counter');
  }

  if (token.status !== 'SERVING') {
    throw new ExpressError(
      409,
      `Cannot complete token with status '${token.status}'. Token must be SERVING.`
    );
  }

  token.status = 'COMPLETED';
  token.completedAt = new Date();

  await token.save();

  const counter = await Counter.findById(req.user.counterId);

  if (counter) {
    counter.currentTokenId = null;
    await counter.save();
  }

  const officeId = token.officeId.toString();

  emitQueueUpdate(req, officeId, 'queue:updated', {
    officeId,
    tokenId: token._id.toString(),
    tokenNumber: token.tokenNumber,
    status: token.status
  });

  emitQueueUpdate(req, officeId, 'token:completed', {
    tokenNumber: token.tokenNumber,
    counterId: token.counterId.toString(),
    status: token.status
  });

  res.status(200).json({
    success: true,
    message: 'Token completed successfully',
    token
  });
};

// 6. POST /api/operator/tokens/:tokenId/skip
const skipToken = async (req, res) => {
  await expirePreviousDayUnservedTokens();

  const { tokenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tokenId)) {
    throw new ExpressError(400, 'Invalid token ID format');
  }

  const token = await Token.findById(tokenId);

  if (!token) {
    throw new ExpressError(404, 'Token not found');
  }

  if (token.officeId.toString() !== req.user.officeId.toString()) {
    throw new ExpressError(403, 'Token does not belong to your office');
  }

  if (
    !token.counterId ||
    token.counterId.toString() !== req.user.counterId.toString()
  ) {
    throw new ExpressError(403, 'Token does not belong to your counter');
  }

  if (token.status !== 'CALLED') {
    throw new ExpressError(
      409,
      `Cannot skip token with status '${token.status}'. Token must be CALLED.`
    );
  }

  token.status = 'SKIPPED';

  await token.save();

  const counter = await Counter.findById(req.user.counterId);

  if (counter) {
    counter.currentTokenId = null;
    await counter.save();
  }

  const officeId = token.officeId.toString();

  emitQueueUpdate(req, officeId, 'queue:updated', {
    officeId,
    tokenId: token._id.toString(),
    tokenNumber: token.tokenNumber,
    status: token.status
  });

  emitQueueUpdate(req, officeId, 'token:skipped', {
    tokenNumber: token.tokenNumber,
    counterId: token.counterId.toString(),
    status: token.status
  });

  res.status(200).json({
    success: true,
    message: 'Token skipped successfully',
    token
  });
};

// 7. POST /api/operator/tokens/:tokenId/recall
const recallToken = async (req, res) => {
  await expirePreviousDayUnservedTokens();

  const { tokenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tokenId)) {
    throw new ExpressError(400, 'Invalid token ID format');
  }

  const token = await Token.findById(tokenId);

  if (!token) {
    throw new ExpressError(404, 'Token not found');
  }

  if (token.officeId.toString() !== req.user.officeId.toString()) {
    throw new ExpressError(403, 'Token does not belong to your office');
  }

  if (
    !token.counterId ||
    token.counterId.toString() !== req.user.counterId.toString()
  ) {
    throw new ExpressError(403, 'Token does not belong to your counter');
  }

  if (!['CALLED', 'SERVING'].includes(token.status)) {
    throw new ExpressError(
      409,
      `Cannot recall token with status '${token.status}'. Token must be CALLED or SERVING.`
    );
  }

  token.status = 'CALLED';
  token.calledAt = new Date();

  await token.save();

  const officeId = token.officeId.toString();

  emitQueueUpdate(req, officeId, 'queue:updated', {
    officeId,
    tokenId: token._id.toString(),
    tokenNumber: token.tokenNumber,
    status: token.status
  });

  emitQueueUpdate(req, officeId, 'token:recalled', {
    tokenNumber: token.tokenNumber,
    counterId: token.counterId.toString(),
    status: token.status
  });

  res.status(200).json({
    success: true,
    message: 'Token recalled successfully',
    token
  });
};

// 8. PATCH /api/operator/counter/status
const updateCounterStatus = async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = ['AVAILABLE', 'PAUSED', 'OFFLINE'];

  if (!status || !allowedStatuses.includes(status)) {
    throw new ExpressError(
      400,
      `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
    );
  }

  if (!req.user.counterId) {
    throw new ExpressError(400, 'Operator is not assigned to a counter');
  }

  const counter = await Counter.findById(req.user.counterId);

  if (!counter) {
    throw new ExpressError(404, 'Assigned counter not found');
  }

  counter.status = status;

  await counter.save();

  const officeId = req.user.officeId.toString();

  emitQueueUpdate(req, officeId, 'counter:updated', {
    officeId,
    counterId: counter._id.toString(),
    status: counter.status
  });

  res.status(200).json({
    success: true,
    message: 'Counter status updated successfully',
    counter
  });
};

module.exports = {
  getDashboard,
  getQueue,
  callNextToken,
  startToken,
  completeToken,
  skipToken,
  recallToken,
  updateCounterStatus
};
