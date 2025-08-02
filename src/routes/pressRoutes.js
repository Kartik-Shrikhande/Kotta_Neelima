const express = require('express');
const router = express.Router();
const pressController = require('../controllers/pressController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // use memory for AWS S3


router.get('/posts', pressController.getAllPress);

router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
router.post('/create/post', upload.single('image'), pressController.createPress);
router.get('/:id', pressController.getPressById);
router.put('/update/post/:id', upload.single('image'), pressController.updatePress);
router.delete('/delete/post/:id', pressController.deletePress);

module.exports = router;
