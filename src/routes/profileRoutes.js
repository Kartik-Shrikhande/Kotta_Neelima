const express = require('express');
const multer = require('multer');
const {
  createProfileBio, getProfileBio, updateProfileBio, deleteProfileBio,
  createProfilePhoto, getAllProfilePhotos, deleteProfilePhoto,
  createProfileArticle, getAllProfileArticles, updateProfileArticle, deleteProfileArticle,
  downloadProfileBioImage, downloadProfilePhoto ,downloadAllProfilePhotos
} = require('../controllers/profileController');

const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Public GET routes
router.get('/bio/all', getProfileBio);
router.get('/photos/all', getAllProfilePhotos);
router.get('/articles/all', getAllProfileArticles);
router.get('/bio/download', downloadProfileBioImage);
router.get('/photos/download-all', downloadAllProfilePhotos);
router.get('/photos/download/:id', downloadProfilePhoto);

// Admin protected routes
router.use(authenticationMiddleware.authenticateUser, authenticationMiddleware.authorizeRoles(['admin']));

// Bio CRUD
router.post('/bio/create', upload.single('profileImage'), createProfileBio);
router.put('/bio/:id', upload.single('profileImage'), updateProfileBio);
router.delete('/bio/:id', deleteProfileBio);


// Photo CRUD
router.post('/photos/upload', upload.single('image'), createProfilePhoto);
router.delete('/photos/:id', deleteProfilePhoto);


// Article CRUD
router.post('/articles/create', createProfileArticle);
router.put('/articles/:id', updateProfileArticle);
router.delete('/articles/:id', deleteProfileArticle);


module.exports = router;
