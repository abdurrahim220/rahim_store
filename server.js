import express from "express";
import cors from "cors";
import config from "./config/config.js";
import fileUpload from "express-fileupload";
import connectDB from "./db/connectDB.js";
import { userRoute } from "./routes/userRoute.js";
import errorValidator from "./middlewares/errorValidator.js";
import cookieParser from "cookie-parser";
import { authRoute } from "./routes/authRoute.js";
import { categoryRouter } from "./routes/categoryRoute.js";
import notFound from "./middlewares/notFound.js";
import { productRoute } from "./routes/productRoute.js";
import { orderRoute } from "./routes/orderRoute.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
  })
);
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cookieParser());
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

app.use(errorValidator);
app.use(notFound);

// Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
