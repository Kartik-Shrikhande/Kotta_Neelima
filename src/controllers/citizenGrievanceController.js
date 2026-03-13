const CitizenGrievance = require("../models/citizenGrievanceModel");
const mongoose = require("mongoose");
const { uploadToS3 } = require("../utility/awsS3");


// Submit Grievance (Public)
exports.createGrievance = async (req, res) => {
  try {
    const { fullName, phoneNumber, location, problem, description } = req.body;

    if (!fullName || !phoneNumber || !location || !problem) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone number, location and problem are required",
      });
    }

    let documentUrl = null;

    if (req.file) {
      documentUrl = await uploadToS3(req.file);
    }

    const grievance = new CitizenGrievance({
      fullName,
      phoneNumber,
      location,
      problem,
      description,
      document: documentUrl,
    });

    await grievance.save();

    res.status(201).json({
      success: true,
      message: "Citizen grievance submitted successfully",
      data: grievance,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Get All Grievances (Admin)
exports.getAllGrievances = async (req, res) => {
  try {

    const grievances = await CitizenGrievance.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: grievances.length,
      success: true,
      data: grievances,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Get Grievance By ID
exports.getGrievanceById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grievance ID",
      });
    }

    const grievance = await CitizenGrievance.findById(id);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    res.status(200).json({
      success: true,
      data: grievance,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Update Grievance (Admin)
exports.updateGrievance = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grievance ID",
      });
    }

    let updateData = { ...req.body };

    if (req.file) {
      const documentUrl = await uploadToS3(req.file);
      updateData.document = documentUrl;
    }

    const updated = await CitizenGrievance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Grievance updated successfully",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Delete Grievance
exports.deleteGrievance = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grievance ID",
      });
    }

    const deleted = await CitizenGrievance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Grievance deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};