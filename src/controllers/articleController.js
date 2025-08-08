const mongoose = require('mongoose');
const Article = require('../model/articleModel');
const { uploadToS3 } = require('../utility/awsS3');

// 🔸 CREATE
exports.createArticle = async (req, res) => {
  try {
    const { date, title, description, url } = req.body;

    // ✅ Field validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required fields.',
      });
    }

    let pdfUrl = null;
    if (req.file) {
      pdfUrl = await uploadToS3(req.file);
    }

    const article = new Article({
      date,
      title,
      description,
      url,
      pdf: pdfUrl,
    });

    await article.save();
    res.status(201).json({ message: 'Article created successfully', article });
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// 🔸 GET ALL
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json({ total: articles.length, data: articles });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔸 UPDATE
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Article ID' });
    }

    const { date, title, description, url } = req.body;

    // ✅ Field validation
    if (title === '' || description === '') {
      return res.status(400).json({
        success: false,
        message: 'Title and description cannot be empty.',
      });
    }

    const updatedFields = {};
    if (date) updatedFields.date = date;
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (url) updatedFields.url = url;

    if (req.file) {
      const pdfUrl = await uploadToS3(req.file);
      updatedFields.pdf = pdfUrl;
    }

    const updated = await Article.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updated) return res.status(404).json({ message: 'Article not found' });

    res.status(200).json({ message: 'Article updated successfully', article: updated });
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// 🔸 DELETE
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Article ID' });
    }

    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Article not found' });

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error('Error deleting article:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
