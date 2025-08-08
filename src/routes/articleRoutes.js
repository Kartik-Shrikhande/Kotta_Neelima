const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/articles', articleController.getAllArticles);

router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
router.post('/create', upload.single('pdf'), articleController.createArticle);
router.put('/:id', upload.single('pdf'), articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
