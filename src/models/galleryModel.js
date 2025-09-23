const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    teluguTitle: { type: String },
    hindiTitle: { type: String },
    image: { type: String, required: true }, // S3 URL
    date: { type: String }, // e.g., "28-07-2025"
    time: { type: String }, // e.g., "12:00"
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryCategory',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
