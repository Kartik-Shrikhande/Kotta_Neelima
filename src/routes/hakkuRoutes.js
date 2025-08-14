const express = require('express');
const router = express.Router();
const hakkuController = require('../controllers/hakkuController');

// Create
router.post('/create', hakkuController.createHakku);

// Update
router.put('/update/:id', hakkuController.updateHakku);

// Get all
router.get('/all', hakkuController.getAllHakku);

// Delete
router.delete('/delete/:id', hakkuController.deleteHakku);

module.exports = router;
