const mongoose = require('mongoose');
const NationalPoliticsGallery = require('../models/nationalPoliticsGalleryModel');
const NationalPoliticsCategory = require('../models/nationalPoliticsCategoryModel');
const {uploadToS3} = require('../utility/awsS3');

// Create Gallery Post
exports.createGalleryPost = async (req, res) => {
  try {
    const { title, hindiTitle, teluguTitle, date, categoryId } = req.body;

    if (!title || !date || !categoryId) {
      return res.status(400).json({ success: false, message: "Title, date, and category are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "Invalid Category ID" });
    }

    const category = await NationalPoliticsCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imageUrl = await uploadToS3(req.file);

    const post = new NationalPoliticsGallery({
      title,
      hindiTitle,
      teluguTitle,
      image: imageUrl,
      date,
      category: categoryId,
    });

    await post.save();

    res.status(201).json({ success: true, message: "Gallery post created", data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateGalleryPost = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Ensure req.body exists
    const { title, hindiTitle, teluguTitle, date, categoryId } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Gallery Post ID" });
    }

    // Build update object dynamically
    let updateData = {};
    if (title) updateData.title = title;
    if (hindiTitle) updateData.hindiTitle = hindiTitle;
    if (teluguTitle) updateData.teluguTitle = teluguTitle;
    if (date) updateData.date = date;

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ success: false, message: "Invalid Category ID" });
      }
      updateData.category = categoryId;
    }

    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      updateData.image = imageUrl;
    }

    const updatedPost = await NationalPoliticsGallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: "Gallery post not found" });
    }

    res.status(200).json({
      success: true,
      message: "Gallery post updated successfully",
      data: updatedPost,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All Gallery Posts
exports.getGalleryPosts = async (req, res) => {
  try {
    const posts = await NationalPoliticsGallery.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({total:posts.length, success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Gallery Post
exports.deleteGalleryPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Post ID" });
    }

    const deleted = await NationalPoliticsGallery.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
