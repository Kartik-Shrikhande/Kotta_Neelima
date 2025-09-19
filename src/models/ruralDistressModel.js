const mongoose = require('mongoose');

const ruralDistressSchema = new mongoose.Schema(
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

module.exports = mongoose.model('RuralDistress', ruralDistressSchema);
