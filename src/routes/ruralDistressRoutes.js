const express = require('express');
const ruralDistressController = require('../controllers/ruralDistressController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/all', ruralDistressController.getAllRuralDistress);
router.get('/photos/all', ruralDistressController.getAllRuralDistressPhotos);
router.get('/conferences/all', ruralDistressController.getAllConferences);
router.get('/books/all', ruralDistressController.getAllBooks);
router.get('/articles/all', ruralDistressController.getAllRuralDistressArticles);

// ✅ Protect the following routes for Admin only
router.use(
  authenticationMiddleware.authenticateUser,
  authenticationMiddleware.authorizeRoles(['admin'])
);


//RURAL DISTRESS ROUTES - RURAL SECTION
router.post('/create', ruralDistressController.createRuralDistress);
// router.get('/:id', ruralDistressController.getRuralDistressById);
router.put('/:id', ruralDistressController.updateRuralDistress);
router.delete('/:id', ruralDistressController.deleteRuralDistress);



//RURAL DISTRESS PHOTO ROUTES
router.post('/photos/create', upload.single('image'), ruralDistressController.createRuralDistressPhoto);
// router.get('/photos/:id', getRuralDistressPhotoById);
router.put('/photos/:id', upload.single('image'), ruralDistressController.updateRuralDistressPhoto);
router.delete('/photos/:id', ruralDistressController.deleteRuralDistressPhoto);



//RURAL DISTRESS -CONFERENCE ROUTES
router.post('/conferences/create', ruralDistressController.createConference);
router.put('/conferences/:id', ruralDistressController.updateConference);
router.delete('/conferences/:id', ruralDistressController.deleteConference);


//RURAL DISTRESS -BOOK ROUTES
router.post('/books/create', upload.single('bookImage'), ruralDistressController.createBook);
router.put('/books/:id', upload.single('bookImage'), ruralDistressController.updateBook);
router.delete('/books/:id', ruralDistressController.deleteBook);


//RURAL DISTRESS ARTICLE ROUTES
// router.get('/articles/:id', getRuralDistressArticleById);
router.post('/article/create', ruralDistressController.createRuralDistressArticle);
router.put('/article/:id', ruralDistressController.updateRuralDistressArticle);
router.delete('/article/:id', ruralDistressController.deleteRuralDistressArticle);

module.exports = router;

