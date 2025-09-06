const Journalism = require('../models/journalismModel');
const mongoose = require('mongoose');

// Create
exports.createJournalism = async (req, res) => {
  try {
    const { title, description, url } = req.body;

    if (!title || !description || !url) {
      return res.status(400).json({ success: false, message: 'Title, description, and URL are required' });
    }

    const newJournalism = new Journalism({ title, description, url });
    await newJournalism.save();

    res.status(201).json({ success: true, message: 'Journalism entry created successfully', data: newJournalism });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All
exports.getAllJournalism = async (req, res) => {
  try {
    const data = await Journalism.find().sort({ createdAt: -1 });
    res.status(200).json({ total:data.length,success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update
exports.updateJournalism = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Journalism ID' });
    }

    const { title, description, url } = req.body;

    if (!title || !description || !url) {
      return res.status(400).json({ success: false, message: 'Title, description, and URL are required' });
    }

    const updated = await Journalism.findByIdAndUpdate(
      id,
      { title, description, url },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Journalism entry not found' });
    }

    res.status(200).json({ success: true, message: 'Updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete
exports.deleteJournalism = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Journalism ID' });
    }

    const deleted = await Journalism.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Journalism entry not found' });
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
