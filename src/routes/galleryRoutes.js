const express = require('express');
const router = express.Router();
const multer = require('multer');
const galleryController = require('../controllers/galleryController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/posts', galleryController.getAllGallery);
//GALLERY IMAGE DOWNLOAD API
router.get('/download/:id', galleryController.downloadSingleImage);
router.get('/download-all', galleryController.downloadAllImages);


router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
router.post('/create/post', upload.single('image'), galleryController.createGallery);
router.get('/:id', galleryController.getGalleryById);
router.put('/update/post/:id', upload.single('image'), galleryController.updateGallery);
router.delete('/delete/post/:id', galleryController.deleteGallery);



module.exports = router;

