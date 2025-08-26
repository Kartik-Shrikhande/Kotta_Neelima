// controllers/policyInterventionProposalController.js
const mongoose = require('mongoose');
const PolicyInterventionProposal = require('../models/policyInterventionProposalModel');

// ✅ Create
exports.createProposal = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    const proposal = new PolicyInterventionProposal({ description });
    await proposal.save();

    res.status(201).json({ success: true, message: "Created successfully", data: proposal });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get All
exports.getAllProposals = async (req, res) => {
  try {
    const proposals = await PolicyInterventionProposal.find();
    res.status(200).json({ total:proposals.length,success: true, data: proposals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get By ID
exports.getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const proposal = await PolicyInterventionProposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found" });
    }

    res.status(200).json({ success: true, data: proposal });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Update
exports.updateProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    const proposal = await PolicyInterventionProposal.findByIdAndUpdate(
      id,
      { description },
      { new: true, runValidators: true }
    );

    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found" });
    }

    res.status(200).json({ success: true, message: "Updated successfully", data: proposal });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Delete
exports.deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const proposal = await PolicyInterventionProposal.findByIdAndDelete(id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
