const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const {
  createGalleryCategory,
  getGalleryCategories,
  deleteGalleryCategory,
  updateGalleryCategory
} = require('../controllers/galleryCategoryController');

router.get('/all', getGalleryCategories);

router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))

router.post('/create', createGalleryCategory);
router.put('/update/:id', updateGalleryCategory); 
router.delete('/delete/:id', deleteGalleryCategory);

module.exports = router;
