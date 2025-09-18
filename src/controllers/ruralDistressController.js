const mongoose = require('mongoose');
const RuralDistress = require('../models/ruralDistressModel');
const RuralDistressPhoto = require('../models/ruralDistressPhotoModel');
const RuralConference = require('../models/ruralConferenceModel');
const RuralBook = require('../models/ruralBookModel');
const RuralDistressArticle = require('../models/ruralDistressArticleModel');
const { uploadToS3 } = require('../utility/awsS3');


//RURAL DISTRESS CONTROLLER
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




//RURAL DISTRESS PHOTO CONTROLLER

// ✅ Create Photo
exports.createRuralDistressPhoto = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const imageUrl = await uploadToS3(req.file);

    const photo = new RuralDistressPhoto({ title, image: imageUrl });
    await photo.save();

    res.status(201).json({ success: true, message: 'Photo created successfully', data: photo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get All Photos
exports.getAllRuralDistressPhotos = async (req, res) => {
  try {
    const photos = await RuralDistressPhoto.find().sort({ createdAt: -1 });
    res.status(200).json({ total: photos.length, success: true, data: photos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// // ✅ Get Photo by ID
// exports.getRuralDistressPhotoById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid ID format' });
//     }

//     const photo = await RuralDistressPhoto.findById(id);
//     if (!photo) {
//       return res.status(404).json({ success: false, message: 'Photo not found' });
//     }

//     res.status(200).json({ success: true, data: photo });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// ✅ Update Photo


exports.updateRuralDistressPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const updateData = {};
    if (title) updateData.title = title;

    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      updateData.image = imageUrl;
    }

    const photo = await RuralDistressPhoto.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    res.status(200).json({ success: true, message: 'Updated successfully', data: photo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Delete Photo
exports.deleteRuralDistressPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const photo = await RuralDistressPhoto.findByIdAndDelete(id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




//RURAL DISTRESS -CONFERENCE CONTROLLER 



// 🔸 Create Conference
exports.createConference = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    const conference = await RuralConference.create({ description });

    res.status(201).json({
      success: true,
      message: 'Conference created successfully',
      data: conference
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get All Conferences
exports.getAllConferences = async (req, res) => {
  try {
    const conferences = await RuralConference.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: conferences.length,
      data: conferences
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Update Conference
exports.updateConference = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Conference ID' });
    }

    const updated = await RuralConference.findByIdAndUpdate(
      id,
      { description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conference not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Conference updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Delete Conference
exports.deleteConference = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Conference ID' });
    }

    const deleted = await RuralConference.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Conference not found' });
    }

    res.status(200).json({ success: true, message: 'Conference deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



//RURAL DISTRESS -BOOK CONTROLLER


// 🔸 Create Book
exports.createBook = async (req, res) => {
  try {
    const { title, description, publishedDate, author } = req.body;

    if (!title || !description || !publishedDate || !author) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Book image is required' });
    }

    const imageUrl = await uploadToS3(req.file);

    const book = await RuralBook.create({
      bookImage: imageUrl,
      title,
      description,
      publishedDate,
      author
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get All Books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await RuralBook.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: books.length, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Update Book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Book ID' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      updateData.bookImage = imageUrl;
    }

    const updatedBook = await RuralBook.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book updated successfully', data: updatedBook });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Book ID' });
    }

    const deleted = await RuralBook.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




//RURAL DISTRESS -ARTICLE CONTROLLER

// 🔸 Create Article
// 🔸 Create Article
exports.createRuralDistressArticle = async (req, res) => {
  try {
    const { title, url, description } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required' });
    }

    const article = new RuralDistressArticle({ title, url, description });
    await article.save();

    res.status(201).json({ success: true, message: 'Article created successfully', data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get All Articles
exports.getAllRuralDistressArticles = async (req, res) => {
  try {
    const articles = await RuralDistressArticle.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Update Article
exports.updateRuralDistressArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Article ID' });
    }
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required' });
    }

    const updated = await RuralDistressArticle.findByIdAndUpdate(
      id,
      { title, url, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, message: 'Article updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Delete Article
exports.deleteRuralDistressArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Article ID' });
    }

    const deleted = await RuralDistressArticle.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

   