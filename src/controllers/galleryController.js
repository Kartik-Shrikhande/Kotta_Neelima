const Gallery = require('../models/galleryModel');
const { uploadToS3 } = require('../utility/awsS3');
const mongoose= require('mongoose');

exports.createGallery = async (req, res) => {
  try {
    const { title, teluguTitle, hindiTitle, date, time } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = await uploadToS3(req.file);

    // If time is not provided, use current time in HH:mm format
    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata', // use your local timezone
    });

    const newGallery = new Gallery({
      title,
      teluguTitle,
      hindiTitle,
      image: imageUrl,
      date,
      time: time || currentTime, // ⬅️ fallback to current time if not provided
    });

    await newGallery.save();
    res.status(201).json({ success: true, gallery: newGallery });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get all
exports.getAllGallery = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.json({ total:galleries.length,success: true, galleries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get by ID
exports.getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'post Not found' });
    }
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update
exports.updateGallery = async (req, res) => {
  try {


    const galleryId = req.params.id;

   if (!mongoose.Types.ObjectId.isValid(galleryId)) {
      return res.status(400).json({ success: false, message: 'Invalid Post ID' });
    }


    const { title, teluguTitle, hindiTitle, date, time } = req.body;

 if (
      (!req.body || Object.keys(req.body).length === 0) &&
      !req.file
    ) {
      return res.status(400).json({ success: false, message: 'Request body is empty' });
    }

    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // If new image uploaded, replace it
    if (req.file) {
      const newImageUrl = await uploadToS3(req.file);
      gallery.image = newImageUrl;
    }

    // Set current time if not provided
    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });

    gallery.title = title || gallery.title;
    gallery.teluguTitle = teluguTitle || gallery.teluguTitle;
    gallery.hindiTitle = hindiTitle || gallery.hindiTitle;
    gallery.date = date || gallery.date;
    gallery.time = time || currentTime;

    await gallery.save();

    res.json({ success: true, gallery });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete
exports.deleteGallery = async (req, res) => {
  
  try {

     const galleryId = req.params.id;

         if (!mongoose.Types.ObjectId.isValid(galleryId)) {
      return res.status(400).json({ success: false, message: 'Invalid Post ID' });
    }
    
    const gallery = await Gallery.findByIdAndDelete(galleryId);


    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Post Not found' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
