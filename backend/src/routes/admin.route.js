const express = require('express');

const wrapAsync = require('../utils/wrapAsync');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const {
  getOffices,
  getOfficeCounters,
  createCounter,
  updateCounter,
  deleteCounter,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  updateStaffAssignment
} = require('../controllers/admin.controller');

const router = express.Router();

// Enforce authentication & admin authorization on all routes
router.use(requireAuth, requireRole('admin'));

// Office & Counter management
router.get('/offices', wrapAsync(getOffices));
router.get('/offices/:officeId/counters', wrapAsync(getOfficeCounters));
router.post('/offices/:officeId/counters', wrapAsync(createCounter));
router.put('/counters/:counterId', wrapAsync(updateCounter));
router.delete('/counters/:counterId', wrapAsync(deleteCounter));

// Staff management
router.get('/staff', wrapAsync(getStaff));
router.post('/staff', wrapAsync(createStaff));
router.put('/staff/:staffId', wrapAsync(updateStaff));
router.delete('/staff/:staffId', wrapAsync(deleteStaff));
router.patch('/staff/:staffId/assignment', wrapAsync(updateStaffAssignment));

module.exports = router;