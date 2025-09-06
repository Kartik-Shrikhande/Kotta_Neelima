const express = require('express');
const {
  createJournalism,
  getAllJournalism,
  updateJournalism,
  deleteJournalism,
} = require('../controllers/journalismController');

const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const router = express.Router();


router.get('/all', getAllJournalism);
router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
router.post('/create', createJournalism);
router.put('/:id', updateJournalism);
router.delete('/:id', deleteJournalism);

module.exports = router;
