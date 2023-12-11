const User = require('../models/User'); // Adjust the path accordingly
const jwt = require('jsonwebtoken');

const verifyToken = require('../middlewares/verifyToken'); // Your JWT verification middleware

// Controller for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ name, email});
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h' // Token expires in 1 hour
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller for getting user profile with JWT verification
const getUserProfile = async (req, res) => {
  try {
    // The user object is available in the request due to the JWT verification middleware
    const { userId, email, role } = req.user;

    // You can use the user information as needed
    res.status(200).json({ userId, email, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
