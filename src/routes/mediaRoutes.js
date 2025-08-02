const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

router.get('/post', mediaController.getAllMedia);

router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
router.post('/post', mediaController.createMedia);
router.put('/post/:id', mediaController.updateMedia);
router.delete('/post/:id', mediaController.deleteMedia);

module.exports = router;
