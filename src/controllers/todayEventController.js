const TodayEvent = require("../models/todayEventModel");
const mongoose = require("mongoose");
const axios = require("axios");
const { uploadToS3 } = require("../utility/awsS3");

// 🔸 Create Event
exports.createTodayEvent = async (req, res) => {
  try {
    const { title, hindiTitle, teluguTitle, description, hindiDescription, teluguDescription, youtubeUrl, articleUrl, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ success: false, message: "Title, description, and date are required" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const event = new TodayEvent({
      title,
      hindiTitle,
      teluguTitle,
      description,
      hindiDescription,
      teluguDescription,
      image: imageUrl,
      youtubeUrl,
      articleUrl,
      date,
    });

    await event.save();

    res.status(201).json({ success: true, message: "Today's Event created", data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get All Events (with YT metadata if exists)
exports.getAllTodayEvents = async (req, res) => {
  try {
    const events = await TodayEvent.find().sort({ createdAt: -1 });

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        let ytData = {};
        if (event.youtubeUrl) {
          try {
            const { data } = await axios.get(`https://www.youtube.com/oembed?url=${event.youtubeUrl}&format=json`);
            ytData.title = data.title;
            ytData.thumbnail = data.thumbnail_url;
          } catch (e) {
            ytData.title = "Unavailable";
            ytData.thumbnail = null;
          }
        }

        return {
          ...event.toObject(),
          youtubeTitle: ytData.title || null,
          youtubeThumbnail: ytData.thumbnail || null,
        };
      })
    );

    res.status(200).json({ success: true, total: enrichedEvents.length, data: enrichedEvents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Update Event
exports.updateTodayEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Event ID" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      updateData.image = imageUrl;
    }

    const updated = await TodayEvent.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Today's Event updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Delete Event
exports.deleteTodayEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Event ID" });
    }

    const deleted = await TodayEvent.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Today's Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
