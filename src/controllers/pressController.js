const Press = require('../models/pressModel');
const { uploadToS3 } = require('../utility/awsS3');
const mongoose = require('mongoose');


// Create Press
exports.createPress = async (req, res) => {
  try {
    const { title, teluguTitle, hindiTitle, date, time, url } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = await uploadToS3(req.file);

    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });

    const newPress = new Press({
      title,
      teluguTitle,
      hindiTitle,
      image: imageUrl,
      url, // ✅ new field
      date,
      time: time || currentTime,
    });

    await newPress.save();
    res.status(201).json({ success: true, press: newPress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get All
exports.getAllPress = async (req, res) => {
  try {
    const pressItems = await Press.find().sort({ createdAt: -1 });
    res.json({ total: pressItems.length, success: true, press: pressItems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get by ID
exports.getPressById = async (req, res) => {
  try {
    const press = await Press.findById(req.params.id);

    if (!press) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, press });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update
exports.updatePress = async (req, res) => {
  try {
    const pressId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(pressId)) {
      return res.status(400).json({ success: false, message: 'Invalid Post ID' });
    }

    const { title, teluguTitle, hindiTitle, date, time, url } = req.body;

    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      return res.status(400).json({ success: false, message: 'Request body is empty' });
    }

    const press = await Press.findById(pressId);
    if (!press) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (req.file) {
      const newImageUrl = await uploadToS3(req.file);
      press.image = newImageUrl;
    }

    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });

    press.title = title || press.title;
    press.teluguTitle = teluguTitle || press.teluguTitle;
    press.hindiTitle = hindiTitle || press.hindiTitle;
    press.date = date || press.date;
    press.time = time || currentTime;
    press.url = url || press.url; // ✅ update url

    await press.save();

    res.json({ success: true, press });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete
exports.deletePress = async (req, res) => {
  try {
    const pressId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(pressId)) {
      return res.status(400).json({ success: false, message: 'Invalid Post ID' });
    }

    const press = await Press.findByIdAndDelete(pressId);

    if (!press) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
