const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// CRUD Routes
router.post('/post', contactController.createContact);
router.get('/all', contactController.getAllContacts);
router.get('/contact/:id', contactController.getContactById);
router.put('/update/:id', contactController.updateContact);
router.delete('/delete/:id', contactController.deleteContact);

module.exports = router;
