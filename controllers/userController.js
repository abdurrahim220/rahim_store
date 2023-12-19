const User = require("../models/User"); // Adjust the path accordingly
const jwt = require("jsonwebtoken");
var moment = require("moment");
const verifyToken = require("../middlewares/verifyToken"); // Your JWT verification middleware

// Controller for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for getting user profile with JWT verification
const getUserProfile = async (req, res) => {
  try {
    // Retrieve all allUsers from the database
    const allUsers = await User.find();

    return res.status(200).json(allUsers);
  } catch (error) {
    // console.error("Error getting allUsers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const countUser = async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm;ss");
  try {
    const users = await User.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project:{
          month:{$month:"$createdAt"}
        }
      },{
        $group:{
          _id:"$month",
          total:{$sum:1}
        }
      }
    ]);
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  countUser,
};
