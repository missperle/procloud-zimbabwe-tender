
// Export all cloud functions
const matchProposalsFunction = require('./matchProposals');

// Export the functions
module.exports = {
  ...matchProposalsFunction
  // Additional functions can be added here
};
