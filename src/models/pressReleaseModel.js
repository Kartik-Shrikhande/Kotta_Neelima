const mongoose = require('mongoose');

const pressReleaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String, // Could be a YouTube link, website link, or PDF link
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('PressRelease', pressReleaseSchema);
