const mongoose = require('mongoose');

const ruralDistressSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RuralDistress', ruralDistressSchema);
