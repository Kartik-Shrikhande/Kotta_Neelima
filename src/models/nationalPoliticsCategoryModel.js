const mongoose = require('mongoose');

const nationalPoliticsCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NationalPoliticsCategory', nationalPoliticsCategorySchema);
