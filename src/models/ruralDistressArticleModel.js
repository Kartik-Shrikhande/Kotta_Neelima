const mongoose = require('mongoose');

const ruralDistressArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true }, // Will store uploaded file S3 URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('RuralDistressArticle', ruralDistressArticleSchema);
