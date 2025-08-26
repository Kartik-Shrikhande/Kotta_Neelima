// controllers/nationalPoliticsController.js
const mongoose = require('mongoose');
const NationalPolitics = require('../models/nationalPoliticsModel');
const {uploadToS3 }= require('../utility/awsS3'); // Adjust the path as necessary

// ✅ Create
exports.createNationalPolitics = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const imageUrl = await uploadToS3(req.file);

    const record = new NationalPolitics({ title, image: imageUrl });
    await record.save();

    res.status(201).json({ success: true, message: "Created successfully", data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get All
exports.getAllNationalPolitics = async (req, res) => {
  try {
    const records = await NationalPolitics.find();
    res.status(200).json({total:records.length, success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get by ID
exports.getNationalPoliticsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const record = await NationalPolitics.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Update
exports.updateNationalPolitics = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid National Politics ID' });
    }

    const { title } = req.body;
    let updateData = {};

    if (title) updateData.title = title;

    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      updateData.image = imageUrl;
    }

    const record = await NationalPolitics.findByIdAndUpdate(id, updateData, { new: true });

    if (!record) {
      return res.status(404).json({ success: false, message: "National Politics record not found" });
    }

    res.status(200).json({ success: true, message: "Updated successfully", data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Delete
exports.deleteNationalPolitics = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const record = await NationalPolitics.findByIdAndDelete(id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
