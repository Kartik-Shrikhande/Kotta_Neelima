const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.post('/post', mediaController.createMedia);
router.get('/post', mediaController.getAllMedia);
router.put('/post/:id', mediaController.updateMedia);
router.delete('/post/:id', mediaController.deleteMedia);

module.exports = router;
