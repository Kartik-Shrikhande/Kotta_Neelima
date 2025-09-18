const mongoose = require('mongoose');

const ruralDistressArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String }, // 🔸 Added new field
  },
  { timestamps: true }
);

module.exports = mongoose.model('RuralDistressArticle', ruralDistressArticleSchema);
