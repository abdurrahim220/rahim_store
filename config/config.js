import dotenv from "dotenv";

dotenv.config();

const config = {
  connectionString: process.env.CONNECTION_STRING,
  port: process.env.PORT,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  clientUrl: process.env.CLIENT_URL,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES,
  refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  nodeEnv: process.env.NODE_ENV,
};

export default config;
