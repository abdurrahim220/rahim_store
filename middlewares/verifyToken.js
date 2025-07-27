import jwt from "jsonwebtoken";
import config from "../config/config.js";
import status from "http-status";
import AppError from "../error/appError.js";

const verifyToken = (req, res, next) => {
  let token = req.cookies.jwt;
  // console.log(token);
  if (!token) {
    return next(
      new AppError(
        "No valid token provided. Please log in.",
        status.UNAUTHORIZED
      )
    );
  }
  try {
    const decoded = jwt.verify(token, config.accessTokenSecret);
    req.user = decoded;
    // console.log("decoded", decoded);
    next();
  } catch (error) {
    console.error(error);
    return next(
      new AppError("Invalid token. Please log in again.", status.UNAUTHORIZED)
    );
  }
};

export default verifyToken;
