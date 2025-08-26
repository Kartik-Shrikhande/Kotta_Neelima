// routes/nationalPoliticsRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/nationalPoliticsController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/post', upload.single('image'), controller.createNationalPolitics);
router.get('/all', controller.getAllNationalPolitics);
router.get('/:id', controller.getNationalPoliticsById);
router.put('/update/:id', upload.single('image'), controller.updateNationalPolitics);
router.delete('/delete/:id', controller.deleteNationalPolitics);

module.exports = router;
