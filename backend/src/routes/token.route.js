const express = require('express');

const wrapAsync = require('../utils/wrapAsync');
const requireAuth = require('../middleware/requireAuth');
const {
  getQueue,
  createToken,
  getMyActiveToken,
  getTokenById,
  cancelToken
} = require('../controllers/token.controller');

const router = express.Router();

// Apply authentication to all token routes
router.use(requireAuth);

router.get('/offices/:officeId/services/:serviceId/queue', wrapAsync(getQueue));
router.post('/tokens', wrapAsync(createToken));
router.get('/tokens/my-active', wrapAsync(getMyActiveToken));
router.get('/tokens/:tokenId', wrapAsync(getTokenById));
router.patch('/tokens/:tokenId/cancel', wrapAsync(cancelToken));

module.exports = router;