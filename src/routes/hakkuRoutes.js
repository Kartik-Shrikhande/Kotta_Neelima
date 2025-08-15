const express = require('express');
const router = express.Router();
const hakkuController = require('../controllers/hakkuController');
const pressReleaseController = require('../controllers/pressReleaseController');
// Create
router.post('/create', hakkuController.createHakku);

// Update
router.put('/update/:id', hakkuController.updateHakku);

// Get all
router.get('/all', hakkuController.getAllHakku);

// Delete
router.delete('/delete/:id', hakkuController.deleteHakku);



//PRESS RELEASE ROUTES

// Create
router.post('/press-release/create', pressReleaseController.createPressRelease);

// Get all
router.get('/press-release/all', pressReleaseController.getAllPressReleases);

// Get by ID
router.get('/press-release/:id', pressReleaseController.getPressReleaseById);

// Update
router.put('/press-release/update/:id', pressReleaseController.updatePressRelease);

// Delete
router.delete('/press-release/delete/:id', pressReleaseController.deletePressRelease);

module.exports = router;
