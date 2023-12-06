const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
} = require("../controllers/categoryControllers");

router.post("/categories", createCategory).get("/categories", getAllCategories);
router.put("/categories/:id", updateCategory);
router.get("/categories/:id", getCategoryById);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
