const mongoose = require('mongoose');

const profileArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProfileArticle', profileArticleSchema);
