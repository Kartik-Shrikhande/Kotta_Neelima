const express = require('express');
const router = express.Router();
const {
  createGalleryCategory,
  getGalleryCategories,
  deleteGalleryCategory
} = require('../controllers/galleryCategoryController');

router.post('/create', createGalleryCategory);
router.get('/all', getGalleryCategories);
router.delete('/delete/:id', deleteGalleryCategory);

module.exports = router;
