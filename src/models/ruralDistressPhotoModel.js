const mongoose = require('mongoose');

const ruralDistressPhotoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String, // Full S3 URL
      required: true
    },
     date: { type: String, required: true } 
  },
  { timestamps: true }
);

module.exports = mongoose.model('RuralDistressPhoto', ruralDistressPhotoSchema);
