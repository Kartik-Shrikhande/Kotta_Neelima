const NationalPoliticsCategory = require('../models/nationalPoliticsCategoryModel');
const mongoose = require('mongoose');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name is required" });

    const existing = await NationalPoliticsCategory.findOne({ name });
    if (existing) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }

    const category = new NationalPoliticsCategory({ name });
    await category.save();

    res.status(201).json({ success: true, message: "Category created", data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await NationalPoliticsCategory.find().sort({ createdAt: -1 });
    res.status(200).json({total:categories.length, success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Category ID" });
    }

    const deleted = await NationalPoliticsCategory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
