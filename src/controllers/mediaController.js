const Media = require('../model/mediaModel');
const axios = require('axios');
const mongoose= require('mongoose');

exports.createMedia = async (req, res) => {
  try {
    const { url, date, time } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'YouTube URL is required' });
    }

    // Set default time if not provided
    
     const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });

    const newMedia = new Media({
      url,
      date:date || currentDate,
      time: time || currentTime,
    });

    await newMedia.save();

    res.status(201).json({ success: true, media: newMedia });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, date, time } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid media ID' });
    }

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    media.url = url || media.url;
    media.date = date || media.date;
    media.time = time || media.time;

    await media.save();
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getAllMedia = async (req, res) => {
  try {
    const mediaList = await Media.find().sort({ createdAt: -1 });

    const enrichedMedia = await Promise.all(
      mediaList.map(async (media) => {
        const ytUrl = media.url;
        try {
          const { data } = await axios.get(`https://www.youtube.com/oembed?url=${ytUrl}&format=json`);
          return {
            _id: media._id,
            url: ytUrl,
            date: media.date,
            time: media.time,
            title: data.title,
            thumbnail: data.thumbnail_url,
          };
        } catch (err) {
          // In case of invalid/missing video
          return {
            _id: media._id,
            url: ytUrl,
            date: media.date,
            time: media.time,
            title: 'Unavailable',
            thumbnail: null,
          };
        }
      })
    );

    res.json({ success: true, media: enrichedMedia });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid media ID' });
    }

    const deleted = await Media.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
