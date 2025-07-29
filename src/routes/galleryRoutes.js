const express = require('express');
const router = express.Router();
const multer = require('multer');
const galleryController = require('../controllers/galleryController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create/post', upload.single('image'), galleryController.createGallery);
router.get('/posts', galleryController.getAllGallery);
router.get('/:id', galleryController.getGalleryById);
router.put('/update/post/:id', upload.single('image'), galleryController.updateGallery);
router.delete('/delete/post/:id', galleryController.deleteGallery);

module.exports = router;

