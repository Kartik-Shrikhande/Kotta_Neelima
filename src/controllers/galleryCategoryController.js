const GalleryCategory = require('../models/galleryCategoryModel');
const mongoose = require('mongoose');

// 🔸 Create Category
exports.createGalleryCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const existing = await GalleryCategory.findOne({ name });
    if (existing) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }

    const category = new GalleryCategory({ name });
    await category.save();

    res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get All Categories
exports.getGalleryCategories = async (req, res) => {
  try {
    const categories = await GalleryCategory.find().sort({ createdAt: -1 });
    res.status(200).json({ total: categories.length, success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Delete Category
exports.deleteGalleryCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Category ID" });
    }

    const deleted = await GalleryCategory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
