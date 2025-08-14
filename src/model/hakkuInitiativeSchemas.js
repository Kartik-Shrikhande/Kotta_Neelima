const mongoose = require('mongoose');

const hakkuInitiativeSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  date: {
    type: String, // "29-07-2025"
  },
  time: {
    type: String, // "12:00"
  },
}, { timestamps: true });

module.exports = mongoose.model('hakku', hakkuInitiativeSchema);