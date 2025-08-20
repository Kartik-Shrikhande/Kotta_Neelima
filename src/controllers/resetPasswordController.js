const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

exports.sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Create token
    const resetToken = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: '5m' });

    admin.resetToken = resetToken;
    admin.resetTokenExpiry = Date.now() + 5 * 60 * 1000; // 15 minutes
    await admin.save();

    const resetLink = `http://localhost:3000/api/password/reset-password?token=${resetToken}`; // Update to frontend URL

    // Send email (basic example)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: admin.email,
      subject: 'Reset your password',
      html: `<p>Click below to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
    });

    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const admin = await Admin.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Add this to your routes/password.js
exports.verifyResetToken = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).send('Token is missing');

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const admin = await Admin.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) return res.status(400).send('Invalid or expired token');

    // ✅ If you're testing from browser, show success plain message
    res.status(200).send('✅ Token is valid. You can now reset your password.');
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).send('Invalid or expired token');
  }
};
