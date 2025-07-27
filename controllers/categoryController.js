import status from "http-status";
import Category from "../models/Category.js";
import cloudinary from "../utils/cloudinary.js";

const createCategory = async (req, res) => {
  try {
    // Check if an image file is provided
    if (!req.files || !req.files.img) {
      return res.status(status.BAD_REQUEST).json({
        status: "error",
        message: "No image file provided",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.img.tempFilePath, {
      folder: "categories",
    });

    // Create new category with Cloudinary image URL and public ID
    const category = await Category.create({
      name: req.body.name,
      img: result.secure_url,
      cloudinary_id: result.public_id, // Store public_id for deletion
    });

    res.status(status.CREATED).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(status.OK).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(status.NOT_FOUND).json({ error: "Category not found" });
    }

    return res.status(status.OK).json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let updateData = { name };

    // Check if a new image is provided
    if (req.files && req.files.img) {
      // Fetch the existing category to get the cloudinary_id
      const category = await Category.findById(id);
      if (!category) {
        return res.status(status.NOT_FOUND).json({ error: "Category not found" });
      }

      // Delete the old image from Cloudinary
      if (category.cloudinary_id) {
        await cloudinary.uploader.destroy(category.cloudinary_id);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.files.img.tempFilePath, {
        folder: "categories",
      });

      updateData.img = result.secure_url;
      updateData.cloudinary_id = result.public_id;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(status.NOT_FOUND).json({ error: "Category not found" });
    }

    return res.status(status.OK).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(status.NOT_FOUND).json({ error: "Category not found" });
    }

    // Delete image from Cloudinary if it exists
    if (category.cloudinary_id) {
      await cloudinary.uploader.destroy(category.cloudinary_id);
    }

    await Category.findByIdAndDelete(id);

    return res.status(status.OK).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
};