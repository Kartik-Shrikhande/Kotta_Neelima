const express = require('express');
const {
  createRuralDistress,
  getAllRuralDistress,
  getRuralDistressById,
  updateRuralDistress,
  deleteRuralDistress
} = require('../controllers/ruralDistressController');

const router = express.Router();

// Routes for Rural Distress
router.post('/create', createRuralDistress);
router.get('/all', getAllRuralDistress);
// router.get('/:id', getRuralDistressById);
router.put('/:id', updateRuralDistress);
router.delete('/:id', deleteRuralDistress);




module.exports = router;
