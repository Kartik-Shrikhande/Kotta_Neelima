const HomepageArticle = require("../models/homepageArticleModel");
const Article = require("../models/articleModel");
const mongoose = require("mongoose");

// Create / Update Homepage Article (only one document to hold 2 items)
exports.setHomepageArticle = async (req, res) => {
  try {
    const { articleItems } = req.body; // Array of Article IDs

    if (!Array.isArray(articleItems) || articleItems.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "You must select exactly 2 articles",
      });
    }

    // Validate all IDs
    for (const id of articleItems) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: `Invalid ID: ${id}` });
      }
    }

    // Check if all IDs exist in Article collection
    const validItems = await Article.find({ _id: { $in: articleItems } });
    if (validItems.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "One or more articles not found",
      });
    }

    // Either update existing homepageArticle or create one
    let homepageArticle = await HomepageArticle.findOne();
    if (homepageArticle) {
      homepageArticle.articleItems = articleItems;
    } else {
      homepageArticle = new HomepageArticle({ articleItems });
    }

    await homepageArticle.save();

    res.status(200).json({
      success: true,
      message: "Homepage articles updated successfully",
      data: homepageArticle,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Homepage Article
exports.getHomepageArticle = async (req, res) => {
  try {
    const homepageArticle = await HomepageArticle.findOne().populate("articleItems");
    if (!homepageArticle) {
      return res
        .status(404)
        .json({ success: false, message: "No homepage article found" });
    }

    res.status(200).json({ success: true, data: homepageArticle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
