const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  countUser,
  deleteUser,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken"); // Your JWT verification middleware

// Route to register a new user
router.post("/register", registerUser);

// Route to login and get a JWT token
router.post("/login", loginUser);

// Route to get user profile with JWT verification
router.get("/allUsers", getUserProfile);
router.delete("/allUsers/:id", deleteUser);
router.get("/stats", countUser);

module.exports = router;
