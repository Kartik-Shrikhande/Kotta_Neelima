const mongoose = require("mongoose");

const citizenGrievanceSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    problem: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: null,
    },

    document: {
      type: String, // S3 URL
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "reviewing", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CitizenGrievance", citizenGrievanceSchema);