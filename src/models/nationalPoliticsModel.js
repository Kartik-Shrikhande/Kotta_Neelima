// models/nationalPoliticsModel.js
const mongoose = require('mongoose');

const nationalPoliticsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // this can be image URL or file path
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('NationalPolitics', nationalPoliticsSchema);
