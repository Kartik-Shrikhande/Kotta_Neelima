const Volunteer = require("../models/volunteerModel");
const mongoose = require("mongoose");


// Create Volunteer (Public)
exports.createVolunteer = async (req, res) => {
  try {
    const { name, phoneNumber, address, message } = req.body;

    if (!name || !phoneNumber || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number and address are required",
      });
    }

    const volunteer = new Volunteer({
      name,
      phoneNumber,
      address,
      message,
    });

    await volunteer.save();

    res.status(201).json({
      success: true,
      message: "Volunteer registration submitted successfully",
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get All Volunteers (Admin)
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: volunteers.length,
      success: true,
      data: volunteers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get Volunteer by ID
exports.getVolunteerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Volunteer ID",
      });
    }

    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Update Volunteer (Admin)
exports.updateVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Volunteer ID",
      });
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data: updatedVolunteer,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Delete Volunteer
exports.deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Volunteer ID",
      });
    }

    const deleted = await Volunteer.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};