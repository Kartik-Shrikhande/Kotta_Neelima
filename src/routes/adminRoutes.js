const express = require('express');
const router = express.Router();


const {
  loginAdmin,
  getDashboard,
  registerAdmin
} = require('../controllers/adminController');


router.post('/login', loginAdmin);
router.post('/register', registerAdmin); // optional
router.get('/dashboard',getDashboard);

module.exports = router;

