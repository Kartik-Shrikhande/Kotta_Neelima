const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
require('dotenv').config();
// ✅ Admin Login Controller
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(403).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid credentials.' });
    }

    
    const token = admin.generateJWT();
admin.currentToken = token;        
await admin.save();                

res.cookie('refreshtoken', token, {
  httpOnly: true,
  secure: true, // set to false in dev
  sameSite: 'None', // or 'Lax' depending on use case
  maxAge: 604800000 
});

res.status(200).json({
  success: true,
  role: admin.role,
  token:token,
  message: 'Login successful',
  admin: {
    id: admin._id,
    email: admin.email,
  }
});

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Optional Dashboard
exports.getDashboard = (req, res) => {
  res.status(200).json({
    message: 'Welcome to admin dashboard',
    admin: req.admin
  });
};

// ✅ Admin Registration (if needed)
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Admin already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    const token = admin.generateJWT();

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
