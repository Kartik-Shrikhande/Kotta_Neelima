const mongoose = require('mongoose');
const ProfileBio = require('../models/profileBioModel');
const ProfilePhoto = require('../models/profilePhotoModel');
const ProfileArticle = require('../models/profileArticleModel');
const { uploadToS3 } = require('../utility/awsS3');

// const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const axios = require("axios");
const JSZip = require("jszip");

// // Re-create S3 client here (same as your s3Service.js)
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// const bucketName = process.env.S3_BUCKET_NAME;

/* ---------------------- BIO CRUD ---------------------- */

// 🔸 Create Profile Bio
exports.createProfileBio = async (req, res) => {
  try {
    const { description, descriptionHindi, descriptionTelugu, designation } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    let profileImage = null;
    if (req.file) {
      profileImage = await uploadToS3(req.file);
    }

    const bio = new ProfileBio({
      description,
      descriptionHindi,
      descriptionTelugu,
      profileImage,
      designation
    });

    await bio.save();
    res.status(201).json({ success: true, message: 'Bio created successfully', data: bio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Get Latest Profile Bio
exports.getProfileBio = async (req, res) => {
  try {
    const bio = await ProfileBio.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Update Profile Bio
exports.updateProfileBio = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid Bio ID' });

    let updateData = { ...req.body };

    if (req.file) {
      const profileImage = await uploadToS3(req.file);
      updateData.profileImage = profileImage;
    }

    const updatedBio = await ProfileBio.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBio) return res.status(404).json({ success: false, message: 'Bio not found' });

    res.status(200).json({ success: true, message: 'Bio updated successfully', data: updatedBio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Delete Profile Bio
exports.deleteProfileBio = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid Bio ID' });

    const deleted = await ProfileBio.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Bio not found' });

    res.status(200).json({ success: true, message: 'Bio deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


/* ---------------------- DOWNLOAD BIO IMAGE ---------------------- */
exports.downloadProfileBioImage = async (req, res) => {
  try {
    const bio = await ProfileBio.findOne().sort({ createdAt: -1 });
    if (!bio || !bio.profileImage) {
      return res.status(404).json({ success: false, message: "No bio image found" });
    }

    // Extract filename from URL
    const fileName = bio.profileImage.split("/").pop();

    // Fetch image from S3
    const response = await axios({
      url: bio.profileImage,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", response.headers["content-type"]);

    response.data.pipe(res);
  } catch (err) {
    console.error("Bio Image Download Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// exports.downloadProfileBioImage = async (req, res) => {
//   try {
//     const bio = await ProfileBio.findOne().sort({ createdAt: -1 });
//     if (!bio || !bio.profileImage) {
//       return res.status(404).json({ success: false, message: "No bio image found" });
//     }

//     // Extract the key from the full URL
//     // Example URL: https://your-bucket.s3.region.amazonaws.com/gallery/uuid.jpg
//     const urlParts = bio.profileImage.split(`.amazonaws.com/`);
//     if (!urlParts[1]) {
//       return res.status(400).json({ success: false, message: "Invalid S3 URL in bio image" });
//     }
//     const key = urlParts[1];

//     const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
//     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min validity

//     return res.status(200).json({
//       success: true,
//       downloadUrl: signedUrl,
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };



/* ---------------------- PHOTO CRUD ---------------------- */
exports.createProfilePhoto = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: 'Image file is required' });

    const imageUrl = await uploadToS3(req.file);

    const photo = new ProfilePhoto({ image: imageUrl });
    await photo.save();
    res.status(201).json({ success: true, message: 'Photo added successfully', data: photo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllProfilePhotos = async (req, res) => {
  try {
    const photos = await ProfilePhoto.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: photos.length, data: photos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid Photo ID' });

    const deleted = await ProfilePhoto.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Photo not found' });

    res.status(200).json({ success: true, message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


/* ---------------------- DOWNLOAD PROFILE PHOTO ---------------------- */


// 🔸 Download Single Photo
exports.downloadProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await ProfilePhoto.findById(id);

    if (!photo || !photo.image) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    const fileName = photo.image.split("/").pop();

    const response = await axios({
      url: photo.image,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", response.headers["content-type"]);

    response.data.pipe(res);
  } catch (err) {
    console.error("Profile Photo Download Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔸 Download All Photos (zipped)
exports.downloadAllProfilePhotos = async (req, res) => {
  try {
    const photos = await ProfilePhoto.find();
    if (!photos.length) {
      return res.status(404).json({ success: false, message: "No photos found" });
    }

    const zip = new JSZip();

    for (let i = 0; i < photos.length; i++) {
      if (!photos[i].image) continue;
      const response = await axios.get(photos[i].image, { responseType: "arraybuffer" });
      const imgBuffer = Buffer.from(response.data, "binary");
      const fileName = `photo_${i + 1}.jpg`;
      zip.file(fileName, imgBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", "attachment; filename=profile_photos.zip");
    res.send(zipBuffer);
  } catch (err) {
    console.error("Download All Profile Photos Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


/* ---------------------- ARTICLE CRUD ---------------------- */
exports.createProfileArticle = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const article = new ProfileArticle({ title, description, url });
    await article.save();
    res.status(201).json({ success: true, message: 'Article created successfully', data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllProfileArticles = async (req, res) => {
  try {
    const articles = await ProfileArticle.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateProfileArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid Article ID' });

    const updated = await ProfileArticle.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Article not found' });

    res.status(200).json({ success: true, message: 'Article updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteProfileArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid Article ID' });

    const deleted = await ProfileArticle.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Article not found' });

    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




