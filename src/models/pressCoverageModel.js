const mongoose = require('mongoose');

const pressCoverageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PressCoverage', pressCoverageSchema);
