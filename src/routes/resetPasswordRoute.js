const express = require('express');
const router = express.Router();
const authController = require('../controllers/resetPasswordController');

router.post('/forgot-password', authController.sendResetLink);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password', authController.verifyResetToken);

module.exports = router;
