const Category = require("../models/Category");

// Controller for creating a new category
const createCategory = async (req, res) => {
  try {
    // Assuming req.body contains the data for the new category
    const { name, img } = req.body;

    // Create a new category
    const newCategory = new Category({ name, img });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// Controller for getting all categories
const getAllCategories = async (req, res) => {
  try {
    // Retrieve all categories from the database
    const categories = await Category.find();

    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Error getting categories:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    // Find the category by ID
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    console.error("Error getting category by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, img } = req.body;

    // Find the category by ID and update its properties
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
    console.error("Error updating category:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID and delete it
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
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
