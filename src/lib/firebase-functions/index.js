
// Export all cloud functions
const matchProposalsFunction = require('./matchProposals');
const suggestBudgetTimelineFunction = require('./suggestBudgetTimeline');
const draftProposalFunction = require('./draftProposal');
const chatSupportFunction = require('./chatSupport');
const analyzeProposalFunction = require('./analyzeProposal');
const pseudonymFunction = require('./assignPseudonym');

// Export the functions
module.exports = {
  ...matchProposalsFunction,
  ...suggestBudgetTimelineFunction,
  ...draftProposalFunction,
  ...chatSupportFunction,
  ...analyzeProposalFunction,
  ...pseudonymFunction
  // Additional functions can be added here
};
