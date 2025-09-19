const mongoose = require('mongoose');

const ruralDistressArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String }, // 🔸 Added new field
     date: { type: String, required: true } 
  },
  { timestamps: true }
);

module.exports = mongoose.model('RuralDistressArticle', ruralDistressArticleSchema);
