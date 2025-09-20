const mongoose = require("mongoose");
const axios = require("axios");
const Podcast = require("../models/podcastModel");

// Helper: Get YouTube metadata
const getYoutubeMetadata = async (url) => {
  try {
    // Use oEmbed API for thumbnail + title
    const oEmbedRes = await axios.get(
      `https://www.youtube.com/oembed?url=${url}&format=json`
    );

    return {
      ytTitle: oEmbedRes.data.title,
      thumbnail: oEmbedRes.data.thumbnail_url,
    };
  } catch (err) {
    return { ytTitle: null, thumbnail: null };
  }
};

// 🔸 Create Podcast
exports.createPodcast = async (req, res) => {
  try {
    const { title, url, date } = req.body;
    if (!title || !url || !date) {
      return res
        .status(400)
        .json({ success: false, message: "Title, URL, and Date are required" });
    }

    const meta = await getYoutubeMetadata(url);

    const podcast = new Podcast({
      title,
      url,
      date,
      ytTitle: meta.ytTitle,
      thumbnail: meta.thumbnail,
    });

    await podcast.save();
    res
      .status(201)
      .json({ success: true, message: "Podcast created successfully", data: podcast });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get All Podcasts
exports.getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      total: podcasts.length,
      data: podcasts,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Update Podcast
exports.updatePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Podcast ID" });
    }

    const meta = url ? await getYoutubeMetadata(url) : {};

    const updated = await Podcast.findByIdAndUpdate(
      id,
      { title, url, date, ...meta },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Podcast not found" });
    }

    res.status(200).json({
      success: true,
      message: "Podcast updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Delete Podcast
exports.deletePodcast = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Podcast ID" });
    }

    const deleted = await Podcast.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Podcast not found" });
    }

    res.status(200).json({ success: true, message: "Podcast deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
