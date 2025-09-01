const mongoose = require('mongoose');

const nationalPoliticsGallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    hindiTitle: { type: String },
    teluguTitle: { type: String },
    image: { type: String, required: true }, // S3 URL
    date: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NationalPoliticsCategory',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NationalPoliticsGallery', nationalPoliticsGallerySchema);
