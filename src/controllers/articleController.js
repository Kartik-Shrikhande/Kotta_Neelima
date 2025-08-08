const Article = require('../model/articleModel');
const mongoose = require('mongoose');

// 🔸 CREATE
const { uploadToS3 } = require('../utility/awsS3');

exports.createArticle = async (req, res) => {
  try {
    const { date, title, description, url } = req.body;
    let pdfUrl = null;

    if (req.file) {
      // Upload manually to S3
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
    res.status(200).json({total:articles.length,data:articles});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔸 UPDATE
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid Article ID' });

    const { date, title, description, url } = req.body;

    const updatedFields = { date, title, description, url };

    // If PDF uploaded, send to S3 and add URL
    if (req.file) {
      const pdfUrl = await uploadToS3(req.file); // <- manually upload using your service
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid Article ID' });

    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Article not found' });

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
