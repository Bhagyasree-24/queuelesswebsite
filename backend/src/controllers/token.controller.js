const mongoose = require('mongoose');

const Token = require('../models/Token');
const Office = require('../models/Office');
const Service = require('../models/Service');
const Counter = require("../models/Counter");
const ExpressError = require('../utils/ExpressError');

const ACTIVE_STATUSES = ['WAITING', 'CALLED', 'SERVING'];

// 1. GET /api/offices/:officeId/services/:serviceId/queue
const getQueue = async (req, res) => {
  const { officeId, serviceId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(officeId)) {
    throw new ExpressError(400, 'Invalid office ID format');
  }
  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    throw new ExpressError(400, 'Invalid service ID format');
  }

  const office = await Office.findById(officeId);
  if (!office) {
    throw new ExpressError(404, 'Office not found');
  }

  const service = await Service.findById(serviceId);
  if (!service || service.officeId.toString() !== officeId) {
    throw new ExpressError(404, 'Service not found for this office');
  }

  const activeTokens = await Token.find({
    officeId,
    serviceId,
    status: { $in: ACTIVE_STATUSES }
  })
    .sort({ createdAt: 1 })
    .select('tokenNumber status createdAt calledAt startedAt');

  const queue = activeTokens.map((token, index) => ({
    _id: token._id,
    tokenNumber: token.tokenNumber,
    status: token.status,
    position: index + 1,
    createdAt: token.createdAt,
    calledAt: token.calledAt,
    startedAt: token.startedAt
  }));

  res.status(200).json({
    success: true,
    queue
  });
};

// 2. POST /api/tokens - Generate token
const createToken = async (req, res) => {
  const { officeId, serviceId } = req.body;

  if (!officeId || !mongoose.Types.ObjectId.isValid(officeId)) {
    throw new ExpressError(400, 'Valid officeId is required');
  }
  if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
    throw new ExpressError(400, 'Valid serviceId is required');
  }

  const office = await Office.findById(officeId);
  if (!office) {
    throw new ExpressError(404, 'Office not found');
  }

  const service = await Service.findById(serviceId);
  if (!service || service.officeId.toString() !== officeId) {
    throw new ExpressError(404, 'Service not found for this office');
  }

  if (!service.isActive) {
    throw new ExpressError(400, 'Selected service is currently inactive');
  }

  // Check if user already has an active token
  const existingActiveToken = await Token.findOne({
    userId: req.user._id,
    status: { $in: ACTIVE_STATUSES }
  });

  if (existingActiveToken) {
    throw new ExpressError(
      409,
      'You already have an active token in the queue'
    );
  }

  // Generate hackathon-friendly token sequence (T001, T002, ...)
  const totalTokens = await Token.countDocuments({});
  const tokenNumber = `T${String(totalTokens + 1).padStart(3, '0')}`;

  const token = new Token({
    tokenNumber,
    userId: req.user._id,
    officeId,
    serviceId,
    status: 'WAITING',
    counterId: null
  });

  await token.save();

  res.status(201).json({
    success: true,
    message: 'Token generated successfully',
    token
  });
};

// 3. GET /api/tokens/my-active - Get user's current active token
const getMyActiveToken = async (req, res) => {
  const activeToken = await Token.findOne({
    userId: req.user._id,
    status: { $in: ACTIVE_STATUSES }
  })
    .populate('officeId', 'name code type')
    .populate('serviceId', 'name averageServiceTime');

  if (!activeToken) {
    return res.status(200).json({
      success: true,
      token: null
    });
  }

  let queuePosition = null;
  let estimatedWaitTimeMinutes = null;

  if (activeToken.status === 'WAITING') {
    const tokensAhead = await Token.countDocuments({
      serviceId: activeToken.serviceId._id,
      status: { $in: ACTIVE_STATUSES },
      createdAt: { $lte: activeToken.createdAt }
    });

    queuePosition = tokensAhead;
    const avgTime = activeToken.serviceId.averageServiceTime || 0;
    estimatedWaitTimeMinutes = Math.max(0, (queuePosition - 1) * avgTime);
  }

  res.status(200).json({
    success: true,
    token: activeToken,
    queuePosition,
    estimatedWaitTimeMinutes
  });
};

// 4. GET /api/tokens/:tokenId - View single token details
const getTokenById = async (req, res) => {
  const { tokenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tokenId)) {
    throw new ExpressError(400, 'Invalid token ID format');
  }

  const token = await Token.findById(tokenId)
    .populate('officeId', 'name code type')
    .populate('serviceId', 'name averageServiceTime')
    .populate('counterId', 'number');

  if (!token) {
    throw new ExpressError(404, 'Token not found');
  }

  // Access control: Citizens can only view their own tokens
  if (
    req.user.role === 'citizen' &&
    token.userId.toString() !== req.user._id.toString()
  ) {
    throw new ExpressError(403, 'Access denied to this token');
  }

  let queuePosition = null;
  let estimatedWaitTimeMinutes = null;

  if (token.status === 'WAITING') {
    const tokensAhead = await Token.countDocuments({
      serviceId: token.serviceId._id,
      status: { $in: ACTIVE_STATUSES },
      createdAt: { $lte: token.createdAt }
    });

    queuePosition = tokensAhead;
    const avgTime = token.serviceId.averageServiceTime || 0;
    estimatedWaitTimeMinutes = Math.max(0, (queuePosition - 1) * avgTime);
  }

  res.status(200).json({
    success: true,
    token,
    queuePosition,
    estimatedWaitTimeMinutes
  });
};

// 5. PATCH /api/tokens/:tokenId/cancel - Cancel active token
const cancelToken = async (req, res) => {
  const { tokenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tokenId)) {
    throw new ExpressError(400, 'Invalid token ID format');
  }

  const token = await Token.findById(tokenId);

  if (!token) {
    throw new ExpressError(404, 'Token not found');
  }

  // Citizens can only cancel their own token
  if (
    req.user.role === 'citizen' &&
    token.userId.toString() !== req.user._id.toString()
  ) {
    throw new ExpressError(403, 'Access denied to cancel this token');
  }

  if (!ACTIVE_STATUSES.includes(token.status)) {
    throw new ExpressError(
      400,
      `Cannot cancel token with status '${token.status}'`
    );
  }

  token.status = 'CANCELLED';
  await token.save();

  res.status(200).json({
    success: true,
    message: 'Token cancelled successfully',
    token
  });
};

module.exports = {
  getQueue,
  createToken,
  getMyActiveToken,
  getTokenById,
  cancelToken
};