const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile
} = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken'); // Your JWT verification middleware

// Route to register a new user
router.post('/register', registerUser);

// Route to login and get a JWT token
router.post('/login', loginUser);

// Route to get user profile with JWT verification
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
