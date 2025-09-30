const mongoose = require('mongoose');

const profileBioSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    descriptionHindi: { type: String },
    descriptionTelugu: { type: String },
    profileImage: { type: String }, // image URL (can be S3 or manual)
    designation: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProfileBio', profileBioSchema);
