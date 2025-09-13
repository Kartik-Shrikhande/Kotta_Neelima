const TodayEvent = require('../models/todayEventModel');
const mongoose = require('mongoose');
const axios = require('axios');
const { uploadToS3 } = require('../utility/awsS3');

// ✅ Auto-inactivate events older than 48 hours
const deactivateOldEvents = async () => {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  await TodayEvent.updateMany(
    { createdAt: { $lt: fortyEightHoursAgo }, status: 'active' },
    { $set: { status: 'inactive' } }
  );
};

// 🔸 Create Event
exports.createTodayEvent = async (req, res) => {
  try {
    await deactivateOldEvents();

    const {
      title,
      hindiTitle,
      teluguTitle,
      description,
      hindiDescription,
      teluguDescription,
      youtubeUrl,
      articleUrl,
      date
    } = req.body;

    if (!title || !description || !date) {
      return res
        .status(400)
        .json({ success: false, message: 'Title, description, and date are required' });
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
      status: 'active',
      featured: false
    });

    await event.save();

    res.status(201).json({ success: true, message: "Today's Event created", data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get All Events
exports.getAllTodayEvents = async (req, res) => {
  try {
    await deactivateOldEvents();

    const events = await TodayEvent.find().sort({ createdAt: -1 });

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        let ytData = {};
        if (event.youtubeUrl) {
          try {
            const { data } = await axios.get(
              `https://www.youtube.com/oembed?url=${event.youtubeUrl}&format=json`
            );
            ytData.title = data.title;
            ytData.thumbnail = data.thumbnail_url;
          } catch {
            ytData.title = 'Unavailable';
            ytData.thumbnail = null;
          }
        }

        return {
          ...event.toObject(),
          youtubeTitle: ytData.title || null,
          youtubeThumbnail: ytData.thumbnail || null
        };
      })
    );

    res.status(200).json({ success: true, total: enrichedEvents.length, data: enrichedEvents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get Featured Events
exports.getFeaturedEvents = async (req, res) => {
  try {
    await deactivateOldEvents();

    const featuredEvents = await TodayEvent.find({ status: 'active', featured: true }).sort({
      createdAt: -1
    });

    res.status(200).json({ success: true, total: featuredEvents.length, data: featuredEvents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Activate / Deactivate Event Manually
exports.toggleEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Event ID" });
    }

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status must be either 'active' or 'inactive'" });
    }

    const updated = await TodayEvent.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: `Event status changed to ${status}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// 🔸 Mark/Unmark Featured
exports.toggleFeaturedEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Event ID' });
    }

    const updated = await TodayEvent.findByIdAndUpdate(
      id,
      { featured: !!featured },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      message: `Event has been ${featured ? 'featured' : 'unfeatured'}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Update Event
exports.updateTodayEvent = async (req, res) => {
  try {
    await deactivateOldEvents();

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Event ID' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      updateData.image = imageUrl;
    }

    const updated = await TodayEvent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
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
      return res.status(400).json({ success: false, message: 'Invalid Event ID' });
    }

    const deleted = await TodayEvent.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, message: "Today's Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

///