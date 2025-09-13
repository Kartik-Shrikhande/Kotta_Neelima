const express = require('express');
const ruralDistressController = require('../controllers/ruralDistressController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/all', ruralDistressController.getAllRuralDistress);
router.get('/photos/all', ruralDistressController.getAllRuralDistressPhotos);
router.get('/conferences/all', ruralDistressController.getAllConferences);

// ✅ Protect the following routes for Admin only
router.use(
  authenticationMiddleware.authenticateUser,
  authenticationMiddleware.authorizeRoles(['admin'])
);

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

module.exports = router;
