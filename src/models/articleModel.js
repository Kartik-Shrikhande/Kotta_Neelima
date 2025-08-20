const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pdf: {
    type: String, // S3 URL or local path
    default: null,
  },
  url: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Article', articleSchema);
