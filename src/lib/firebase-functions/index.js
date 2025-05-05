
// Export all cloud functions
const matchProposalsFunction = require('./matchProposals');
const suggestBudgetTimelineFunction = require('./suggestBudgetTimeline');
const draftProposalFunction = require('./draftProposal');
const chatSupportFunction = require('./chatSupport');

// Export the functions
module.exports = {
  ...matchProposalsFunction,
  ...suggestBudgetTimelineFunction,
  ...draftProposalFunction,
  ...chatSupportFunction
  // Additional functions can be added here
};
