const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const {
  createCategory,
  getCategories,
  deleteCategory
} = require('../controllers/nationalPoliticsCategoryController');

const {
  createGalleryPost,
  getGalleryPosts,
  deleteGalleryPost,
  updateGalleryPost
} = require('../controllers/nationalPoliticsGalleryController');


router.get('/gallery', getGalleryPosts);

router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
// Category Routes
router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.delete('/categories/:id', deleteCategory);

// Gallery Routes
router.post('/gallery', upload.single('image'), createGalleryPost);
router.delete('/gallery/:id', deleteGalleryPost);
router.put('/gallery/:id', upload.single("image"),updateGalleryPost);

module.exports = router;
