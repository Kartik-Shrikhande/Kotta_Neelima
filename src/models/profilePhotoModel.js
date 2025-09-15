const mongoose = require('mongoose');

const profilePhotoSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // image URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProfilePhoto', profilePhotoSchema);
