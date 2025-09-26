const Gallery = require('../models/galleryModel');
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { uploadToS3 } = require('../utility/awsS3');
// 2️⃣ Download All Images as ZIP
const axios = require("axios");
const JSZip = require("jszip");
const archiver = require('archiver');
const mongoose= require('mongoose');
const GalleryCategory = require('../models/galleryCategoryModel'); // ✅ new category model

exports.createGallery = async (req, res) => {
  try {
    const { title, teluguTitle, hindiTitle, date, time } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = await uploadToS3(req.file);

    // If time is not provided, use current time in HH:mm format
    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata', // use your local timezone
    });

    const newGallery = new Gallery({
      title,
      teluguTitle,
      hindiTitle,
      image: imageUrl,
      date,
      time: time || currentTime, // ⬅️ fallback to current time if not provided
    });

    await newGallery.save();
    res.status(201).json({ success: true, gallery: newGallery });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get all
exports.getAllGallery = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.json({ total:galleries.length,success: true, galleries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get by ID
exports.getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'post Not found' });
    }
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update
exports.updateGallery = async (req, res) => {
  try {


    const galleryId = req.params.id;

   if (!mongoose.Types.ObjectId.isValid(galleryId)) {
      return res.status(400).json({ success: false, message: 'Invalid Post ID' });
    }


    const { title, teluguTitle, hindiTitle, date, time } = req.body;

 if (
      (!req.body || Object.keys(req.body).length === 0) &&
      !req.file
    ) {
      return res.status(400).json({ success: false, message: 'Request body is empty' });
    }

    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // If new image uploaded, replace it
    if (req.file) {
      const newImageUrl = await uploadToS3(req.file);
      gallery.image = newImageUrl;
    }

    // Set current time if not provided
    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });

    gallery.title = title || gallery.title;
    gallery.teluguTitle = teluguTitle || gallery.teluguTitle;
    gallery.hindiTitle = hindiTitle || gallery.hindiTitle;
    gallery.date = date || gallery.date;
    gallery.time = time || currentTime;

    await gallery.save();

    res.json({ success: true, gallery });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete
exports.deleteGallery = async (req, res) => {
  
  try {

     const galleryId = req.params.id;

         if (!mongoose.Types.ObjectId.isValid(galleryId)) {
      return res.status(400).json({ success: false, message: 'Invalid Post ID' });
    }
    
    const gallery = await Gallery.findByIdAndDelete(galleryId);


    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Post Not found' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 
// 🔸 Create Gallery Post
// exports.createGallery = async (req, res) => {
//   try {
//     const { title, teluguTitle, hindiTitle, date, time, categoryId } = req.body;

//     if (!title || !date || !categoryId) {
//       return res.status(400).json({ success: false, message: "Title, date, and category are required" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//       return res.status(400).json({ success: false, message: "Invalid Category ID" });
//     }

//     const category = await GalleryCategory.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "Image file is required" });
//     }

//     const imageUrl = await uploadToS3(req.file);

//     // fallback to current time if not provided
//     const currentTime = new Date().toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false,
//       timeZone: 'Asia/Kolkata',
//     });

//     const newGallery = new Gallery({
//       title,
//       teluguTitle,
//       hindiTitle,
//       image: imageUrl,
//       date,
//       time: time || currentTime,
//       category: categoryId,
//     });

//     await newGallery.save();
//     res.status(201).json({ success: true, message: "Gallery post created", data: newGallery });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 🔸 Get All Gallery Posts
// exports.getAllGallery = async (req, res) => {
//   try {
//     const galleries = await Gallery.find()
//       .populate("category", "name")
//       .sort({ createdAt: -1 });

//     res.json({ total: galleries.length, success: true, data: galleries });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 🔸 Get Gallery Post by ID
// exports.getGalleryById = async (req, res) => {
//   try {
//     const gallery = await Gallery.findById(req.params.id).populate("category", "name");
//     if (!gallery) {
//       return res.status(404).json({ success: false, message: 'Post not found' });
//     }
//     res.json({ success: true, data: gallery });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 🔸 Update Gallery Post
// exports.updateGallery = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, teluguTitle, hindiTitle, date, time, categoryId } = req.body || {};

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid Gallery Post ID' });
//     }

//     let updateData = {};
//     if (title) updateData.title = title;
//     if (teluguTitle) updateData.teluguTitle = teluguTitle;
//     if (hindiTitle) updateData.hindiTitle = hindiTitle;
//     if (date) updateData.date = date;
//     if (time) updateData.time = time;

//     if (categoryId) {
//       if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//         return res.status(400).json({ success: false, message: "Invalid Category ID" });
//       }
//       const category = await GalleryCategory.findById(categoryId);
//       if (!category) {
//         return res.status(404).json({ success: false, message: "Category not found" });
//       }
//       updateData.category = categoryId;
//     }

//     if (req.file) {
//       const imageUrl = await uploadToS3(req.file);
//       updateData.image = imageUrl;
//     }

//     const updated = await Gallery.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
//       .populate("category", "name");

//     if (!updated) {
//       return res.status(404).json({ success: false, message: 'Gallery post not found' });
//     }

//     res.json({ success: true, message: "Gallery post updated", data: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 🔸 Delete Gallery Post
// exports.deleteGallery = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid Post ID' });
//     }

//     const deleted = await Gallery.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({ success: false, message: 'Post not found' });
//     }

//     res.json({ success: true, message: 'Post deleted' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


//////////////////////////////////////////////////



// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 1️⃣ Single Image Download (pre-signed URL)
// GET /api/gallery/download/:id

exports.downloadSingleImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageDoc = await Gallery.findById(id);

    if (!imageDoc) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    // Extract filename from URL
    const fileName = imageDoc.image.split("/").pop();

    // Fetch file from S3
    const response = await axios({
      url: imageDoc.image,
      method: "GET",
      responseType: "stream"
    });

    // Set download headers
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", response.headers["content-type"]);

    // Pipe file to response
    response.data.pipe(res);

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// exports.downloadSingleImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const imageDoc = await Gallery.findById(id);

//     if (!imageDoc) {
//       return res.status(404).json({ success: false, message: "Image not found" });
//     }

//     // Send the file as a download
//     res.redirect(imageDoc.image); // Redirects directly to the S3 URL
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };




exports.downloadAllImages = async (req, res) => {
  try {
    const images = await Gallery.find();

    if (!images.length) {
      return res.status(404).json({ success: false, message: "No images found" });
    }

    const zip = new JSZip();

    // Fetch each image and add to zip
    for (let i = 0; i < images.length; i++) {
      const response = await axios.get(images[i].image, { responseType: "arraybuffer" });
      const imgBuffer = Buffer.from(response.data, "binary");

      // Add image with original filename (or index)
      const fileName = `image_${i + 1}.jpg`;
      zip.file(fileName, imgBuffer);
    }

    // Generate zip
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", "attachment; filename=gallery_images.zip");
    res.send(zipBuffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
