const PressCoverage = require('../models/pressCoverageModel');
const mongoose = require('mongoose');


// Create
exports.createPressCoverage = async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required' });
    }

    const newPressCoverage = new PressCoverage({ title, url });
    await newPressCoverage.save();

    res.status(201).json({
      success: true,
      message: 'Press Coverage created successfully',
      pressCoverage: newPressCoverage
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All
exports.getAllPressCoverage = async (req, res) => {
  try {
    const pressCoverage = await PressCoverage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true,total:pressCoverage.length, data: pressCoverage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get By ID
exports.getPressCoverageById = async (req, res) => {
  try {
    const pressCoverage = await PressCoverage.findById(req.params.id);
    if (!pressCoverage) {
      return res.status(404).json({ success: false, message: 'Press Coverage not found' });
    }
    res.status(200).json({ success: true, data: pressCoverage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update
// Update
exports.updatePressCoverage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Press Coverage ID' });
    }

    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required' });
    }

    const updatedPressCoverage = await PressCoverage.findByIdAndUpdate(
      id,
      { title, url },
      { new: true, runValidators: true }
    );

    if (!updatedPressCoverage) {
      return res.status(404).json({ success: false, message: 'Press Coverage not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Updated successfully',
      data: updatedPressCoverage
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete
exports.deletePressCoverage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Press Coverage ID' });
    }

    const deletedPressCoverage = await PressCoverage.findByIdAndDelete(id);

    if (!deletedPressCoverage) {
      return res.status(404).json({ success: false, message: 'Press Coverage not found' });
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};