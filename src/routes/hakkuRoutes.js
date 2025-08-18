const express = require('express');
const router = express.Router();
const hakkuController = require('../controllers/hakkuController');
const pressReleaseController = require('../controllers/pressReleaseController');
const pressCoverageController = require('../controllers/pressCoverageController');
// Create
router.post('/create', hakkuController.createHakku);

// Update
router.put('/update/:id', hakkuController.updateHakku);

// Get all
router.get('/all', hakkuController.getAllHakku);

// Delete
router.delete('/delete/:id', hakkuController.deleteHakku);



//PRESS RELEASE ROUTES

router.post('/press-release/create', pressReleaseController.createPressRelease);
router.get('/press-release/all', pressReleaseController.getAllPressReleases);
router.get('/press-release/:id', pressReleaseController.getPressReleaseById);
router.put('/press-release/update/:id', pressReleaseController.updatePressRelease);
router.delete('/press-release/delete/:id', pressReleaseController.deletePressRelease);




//PRESS COVERAGE ROUTES

router.post('/press-coverage/create', pressCoverageController.createPressCoverage);
router.get('/press-coverage/all', pressCoverageController.getAllPressCoverage);
router.get('/press-coverage/:id', pressCoverageController.getPressCoverageById);
router.put('/press-coverage/update/:id', pressCoverageController.updatePressCoverage);
router.delete('/press-coverage/delete/:id', pressCoverageController.deletePressCoverage);

module.exports = router;


module.exports = router;
