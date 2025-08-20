const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
   currentToken: { type: String },
    resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, {
  timestamps: true
});

// ✅ Generate JWT Token
adminSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, email: this.email ,role: this.role },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  );
};

module.exports = mongoose.model('Admin', adminSchema);
