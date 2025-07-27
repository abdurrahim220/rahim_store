import moment from "moment";
import User from "../models/User.js";
import status from "http-status";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

export const registerUser = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image || Array.isArray(req.files.image)) {
      return res.status(status.BAD_REQUEST).json({
        error: "Single image file is required",
      });
    }
    const uploadProductImage = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "users",
      }
    );
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      image: uploadProductImage.secure_url,
      gender: req.body.gender,
      cloudinary_id: uploadProductImage.public_id,
    });
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
    res.status(status.CREATED).json({
      status: status.CREATED,
      message: "User registered successfully",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(status.OK).json(users);
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: "User not found" });
    }
    res.status(status.OK).json({ user });
  } catch (error) {
    console.error(error);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
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
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(status.OK).json(users);
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    // console.log(req.user.role);
    // Check if requester is admin
    if (req.user.role !== "admin") {
      return res
        .status(status.FORBIDDEN)
        .json({ error: "Only admins can delete users" });
    }

    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      return res.status(status.NOT_FOUND).json({ error: "User not found" });
    }
    if (deleteUser.cloudinary_id) {
      await cloudinary.uploader.destroy(deleteUser.cloudinary_id);
    }
    res.status(status.OK).json({
      status: status.OK,
      message: "User deleted successfully",
    });
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    // console.log(req.user.role)
    // Check if requester is admin
    if (req.user.role !== "admin") {
      return res
        .status(status.FORBIDDEN)
        .json({ error: "Only admins can update user roles" });
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateUser) {
      return res.status(status.NOT_FOUND).json({ error: "User not found" });
    }
    res.status(status.OK).json(updateUser);
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(status.NOT_FOUND).json({ error: "User not found" });
    }
    res.status(status.OK).json(user);
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};


export const userController = {
  registerUser,
  getAllUser,
  getUserProfile,
  countUser,
  deleteUser,
  updateUserRole,
  getSingleUser,
};
