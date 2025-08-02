const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const {
  loginAdmin,
  getDashboard,
  registerAdmin
} = require('../controllers/adminController');


router.post('/login', loginAdmin);
router.post('/register', registerAdmin); // optional
router.get('/dashboard',getDashboard);

// 🔹 Verify Token Route (Checks if access token is valid)
router.post('/refresh-token', authenticationMiddleware.refreshToken);
router.post('/verify-token', authenticationMiddleware.verifyToken);

module.exports = router;

