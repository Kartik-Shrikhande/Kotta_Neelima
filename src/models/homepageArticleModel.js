const mongoose = require("mongoose");

const homepageArticleSchema = new mongoose.Schema(
  {
    articleItems: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomepageArticle", homepageArticleSchema);
