import status from "http-status";
import AppError from "../error/appError.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// Login user function
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new AppError("Please provide email and password", status.UNAUTHORIZED)
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError("Incorrect email or password", status.UNAUTHORIZED)
      );
    }

    // Generate new token
    const token = generateToken(user);

    // Clear old cookie and set new one
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() +
          (process.env.JWT_COOKIE_EXPIRES || 30) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    user.password = undefined;

    res.status(status.OK).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Logout function
const logout = (req, res) => {
  // Clear the jwt cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  });

  res.status(status.OK).json({
    status: "success",
    message: "Logged out successfully.",
  });
};

export const authController = {
  loginUser,
  logout,
};
