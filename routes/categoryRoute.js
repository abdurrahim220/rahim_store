import { Router } from "express";
import { categoryController } from "../controllers/categoryController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/create", categoryController.createCategory);  
router.get("/getAll", categoryController.getAllCategories);
router.get("/getById/:id", categoryController.getCategoryById);
router.put("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);
export const categoryRouter = router;
