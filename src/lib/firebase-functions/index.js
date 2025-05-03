
// Export all cloud functions
const matchProposalsFunction = require('./matchProposals');
const suggestBudgetTimelineFunction = require('./suggestBudgetTimeline');

// Export the functions
module.exports = {
  ...matchProposalsFunction,
  ...suggestBudgetTimelineFunction
  // Additional functions can be added here
};
