const mongoose = require("mongoose");

const homepageGallerySchema = new mongoose.Schema(
  {
    galleryItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gallery", // Reference to Gallery collection
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomepageGallery", homepageGallerySchema);
