const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Custom title you give
    url: { type: String, required: true },   // YouTube URL
    date: { type: String, required: true },    // When it’s added
    ytTitle: { type: String },               // Extracted from YouTube
    thumbnail: { type: String },             // Extracted from YouTube
    duration: { type: String },              // Extracted if possible (e.g. 12:32)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Podcast', podcastSchema);
