const mongoose = require("mongoose");

const todayEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    hindiTitle: { type: String },
    teluguTitle: { type: String },
    description: { type: String, required: true },
    hindiDescription: { type: String },
    teluguDescription: { type: String },
    image: { type: String }, // S3 URL
    youtubeUrl: { type: String },
    articleUrl: { type: String },
    date: { type: String, required: true },
    // ✅ New fields
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TodayEvent", todayEventSchema);
