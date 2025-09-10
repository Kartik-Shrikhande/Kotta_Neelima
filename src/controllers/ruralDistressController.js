const mongoose = require('mongoose');
const RuralDistress = require('../models/ruralDistressModel');

// ✅ Create
exports.createRuralDistress = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    const distress = new RuralDistress({ description });
    await distress.save();

    res.status(201).json({ success: true, message: 'Created successfully', data: distress });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get All
exports.getAllRuralDistress = async (req, res) => {
  try {
    const data = await RuralDistress.find().sort({ createdAt: -1 });
    res.status(200).json({ total: data.length, success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get by ID
// exports.getRuralDistressById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid ID format' });
//     }

//     const distress = await RuralDistress.findById(id);
//     if (!distress) {
//       return res.status(404).json({ success: false, message: 'Rural Distress entry not found' });
//     }

//     res.status(200).json({ success: true, data: distress });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// ✅ Update
exports.updateRuralDistress = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    const distress = await RuralDistress.findByIdAndUpdate(
      id,
      { description },
      { new: true, runValidators: true }
    );

    if (!distress) {
      return res.status(404).json({ success: false, message: 'Rural Distress entry not found' });
    }

    res.status(200).json({ success: true, message: 'Updated successfully', data: distress });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Delete
exports.deleteRuralDistress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const distress = await RuralDistress.findByIdAndDelete(id);
    if (!distress) {
      return res.status(404).json({ success: false, message: 'Rural Distress entry not found' });
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
