const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { name, img } = req.body;

    const newCategory = new Category({ name, img });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, img } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, img },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
};
