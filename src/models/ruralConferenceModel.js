// models/ruralConferenceModel.js
const mongoose = require('mongoose');

const ruralConferenceSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
     date: { type: String, required: true } 
  },
  { timestamps: true }
);

module.exports = mongoose.model('RuralConference', ruralConferenceSchema);
