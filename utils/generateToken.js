import jwt from "jsonwebtoken";
import config from "../config/config.js";
import moment from "moment";

const generateToken = (user, expiresIn = "30d") => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
  };

  return jwt.sign(payload, config.accessTokenSecret, { expiresIn });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, config.refreshTokenSecret, {
    expiresIn: "90d",
  });
};

const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh
    ? config.refreshTokenSecret
    : config.accessTokenSecret;
  return jwt.verify(token, secret);
};

export { generateToken};
