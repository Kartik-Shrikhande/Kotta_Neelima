// models/policyInterventionProposalModel.js
const mongoose = require('mongoose');

const policyInterventionProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('PolicyInterventionProposal', policyInterventionProposalSchema);
