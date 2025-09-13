// models/ruralBookModel.js
const mongoose = require('mongoose');

const ruralBookSchema = new mongoose.Schema(
  {
    bookImage: { type: String, required: true }, // S3 URL
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    publishedDate: { type: String, required: true },
    author: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RuralBook', ruralBookSchema);
