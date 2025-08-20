const Hakku = require('../models/hakkuInitiativeModel');
const axios = require('axios');
const mongoose = require('mongoose');

// Create
exports.createHakku = async (req, res) => {
  try {
    const { url, date, time } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'YouTube URL is required' });
    }

    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });

    const newHakku = new Hakku({
      url,
      date: date || currentDate,
      time: time || currentTime,
    });

    await newHakku.save();

    res.status(201).json({ success: true, hakku: newHakku });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update
exports.updateHakku = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, date, time } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Hakku post ID' });
    }

    const hakku = await Hakku.findById(id);
    if (!hakku) {
      return res.status(404).json({ success: false, message: 'Hakku initiative post not found' });
    }

    hakku.url = url || hakku.url;
    hakku.date = date || hakku.date;
    hakku.time = time || hakku.time;

    await hakku.save();
    res.json({ success: true, hakku });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All
exports.getAllHakku = async (req, res) => {
  try {
    const hakkuList = await Hakku.find().sort({ createdAt: -1 });

    const enrichedList = await Promise.all(
      hakkuList.map(async (item) => {
        try {
          const { data } = await axios.get(`https://www.youtube.com/oembed?url=${item.url}&format=json`);
          return {
            _id: item._id,
            url: item.url,
            date: item.date,
            time: item.time,
            title: data.title,
            thumbnail: data.thumbnail_url,
          };
        } catch (err) {
          return {
            _id: item._id,
            url: item.url,
            date: item.date,
            time: item.time,
            title: 'Unavailable',
            thumbnail: null,
          };
        }
      })
    );

    res.json({ success: true, total: enrichedList.length, hakku: enrichedList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete
exports.deleteHakku = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Hakku post ID' });
    }

    const deleted = await Hakku.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Hakku initiative post not found' });
    }

    res.json({ success: true, message: 'Hakku initiative post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
