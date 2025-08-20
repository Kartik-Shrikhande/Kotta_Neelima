const HomepageGallery = require("../models/homepageGalleryModel");
const Gallery = require("../models/galleryModel");
const mongoose = require("mongoose");

// Create / Update Homepage Gallery (only one document to hold 6 items)
exports.setHomepageGallery = async (req, res) => {
  try {
    const { galleryItems } = req.body; // Array of Gallery IDs

    if (!Array.isArray(galleryItems) || galleryItems.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "You must select exactly 6 gallery items",
      });
    }

    // Validate all IDs
    for (const id of galleryItems) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: `Invalid ID: ${id}` });
      }
    }

    // Check if all IDs exist in Gallery collection
    const validItems = await Gallery.find({ _id: { $in: galleryItems } });
    if (validItems.length !== 6) {
      return res.status(404).json({
        success: false,
        message: "One or more gallery items not found",
      });
    }

    // Either update existing homepage gallery or create one
    let homepageGallery = await HomepageGallery.findOne();
    if (homepageGallery) {
      homepageGallery.galleryItems = galleryItems;
    } else {
      homepageGallery = new HomepageGallery({ galleryItems });
    }

    await homepageGallery.save();

    res.status(200).json({
      success: true,
      message: "Homepage gallery updated successfully",
      data: homepageGallery,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Homepage Gallery
exports.getHomepageGallery = async (req, res) => {
  try {
    const homepageGallery = await HomepageGallery.findOne().populate("galleryItems");
    if (!homepageGallery) {
      return res.status(404).json({ success: false, message: "No homepage gallery set" });
    }

    res.status(200).json({ success: true, data: homepageGallery });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
