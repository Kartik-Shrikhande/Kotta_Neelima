// routes/policyInterventionProposalRoutes.js
const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/policyInterventionProposalController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');


router.get('/all', proposalController.getAllProposals);
router.use(authenticationMiddleware.authenticateUser,authenticationMiddleware.authorizeRoles(['admin']))
router.post('/post', proposalController.createProposal);
router.get('/:id', proposalController.getProposalById);
router.put('/update/:id', proposalController.updateProposal);
router.delete('/delete/:id', proposalController.deleteProposal);

module.exports = router;
