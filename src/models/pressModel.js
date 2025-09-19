const mongoose = require('mongoose');

const pressSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  teluguTitle: {
    type: String,
  },
  hindiTitle: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: String, // e.g., "28-07-2025"
  },
   url: {
    type: String, // new field for press URL
  },
  time: {
    type: String, // e.g., "12:00"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Press', pressSchema);
