// routes/policyInterventionProposalRoutes.js
const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/policyInterventionProposalController');

router.post('/post', proposalController.createProposal);
router.get('/all', proposalController.getAllProposals);
router.get('/:id', proposalController.getProposalById);
router.put('/update/:id', proposalController.updateProposal);
router.delete('/delete/:id', proposalController.deleteProposal);

module.exports = router;
