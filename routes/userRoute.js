import express from "express";
import { userController } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/allUsers",  userController.getAllUser);
router.get("/user-profile/", verifyToken, userController.getUserProfile);
router.get("/single-user/:id", verifyToken, userController.getSingleUser);
router.delete("/deleteUser/:id", verifyToken, userController.deleteUser);
router.get("/stats", verifyToken, userController.countUser);
router.put("/updateUser-role/:id", verifyToken, userController.updateUserRole);

export const userRoute = router;
