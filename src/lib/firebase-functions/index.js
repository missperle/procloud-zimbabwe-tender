
// Export all cloud functions
const matchProposalsFunction = require('./matchProposals');
const suggestBudgetTimelineFunction = require('./suggestBudgetTimeline');
const draftProposalFunction = require('./draftProposal');

// Export the functions
module.exports = {
  ...matchProposalsFunction,
  ...suggestBudgetTimelineFunction,
  ...draftProposalFunction
  // Additional functions can be added here
};
