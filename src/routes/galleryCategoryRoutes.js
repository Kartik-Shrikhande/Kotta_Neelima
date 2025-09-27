const express = require('express');
const router = express.Router();
const {
  createGalleryCategory,
  getGalleryCategories,
  deleteGalleryCategory,
  updateGalleryCategory
} = require('../controllers/galleryCategoryController');

router.post('/create', createGalleryCategory);
router.put('/update/:id', updateGalleryCategory); 
router.get('/all', getGalleryCategories);
router.delete('/delete/:id', deleteGalleryCategory);

module.exports = router;
