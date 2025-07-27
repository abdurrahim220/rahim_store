import { Router } from "express";
import { authController } from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/login", authController.loginUser);
router.post("/logout", verifyToken, authController.logout);
export const authRoute = router;
