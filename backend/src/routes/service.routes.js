const express = require('express');

const wrapAsync = require('../utils/wrapAsync');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const {
  createService,
  updateService,
  deleteService
} = require('../controllers/service.controller');

const router = express.Router();

// Admin protection for all service admin routes
router.use(requireAuth, requireRole('admin'));

router.post('/offices/:officeId/services', wrapAsync(createService));
router.put('/services/:serviceId', wrapAsync(updateService));
router.delete('/services/:serviceId', wrapAsync(deleteService));

module.exports = router;