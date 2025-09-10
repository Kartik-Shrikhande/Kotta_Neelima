const express = require('express');
const {
  createRuralDistress,
  getAllRuralDistress,
  getRuralDistressById,
  updateRuralDistress,
  deleteRuralDistress
} = require('../controllers/ruralDistressController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const router = express.Router();

router.get('/all', getAllRuralDistress);

// Routes for Rural Distress
router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
router.post('/create', createRuralDistress);
// router.get('/:id', getRuralDistressById);
router.put('/:id', updateRuralDistress);
router.delete('/:id', deleteRuralDistress);




module.exports = router;
