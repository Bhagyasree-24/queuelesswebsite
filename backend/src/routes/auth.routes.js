const express = require('express');

const {
    register,
    login,
    logout,
    getCurrentUser
} = require('../controllers/auth.controller');

const wrapAsync = require('../utils/wrapAsync');

const router = express.Router();


// Register
router.post('/register', wrapAsync(register));


// Login
router.post('/login', login);


// Logout
router.post('/logout', logout);


// Current user
router.get('/me', getCurrentUser);


module.exports = router;