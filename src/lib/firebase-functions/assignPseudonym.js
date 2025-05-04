
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Get a reference to Firestore (admin.initializeApp already called in index.js)
const db = admin.firestore();

// Helper function to generate a random suffix (A01, B42, etc.)
const generateRandomSuffix = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I and O to avoid confusion
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${letter}${number}`;
};

// Cloud Function to assign pseudonyms to new users
exports.assignPseudonym = functions.auth.user().onCreate(async (user) => {
  try {
    // Get user record from Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    // If user document doesn't exist yet or already has a pseudonym, exit
    if (!userDoc.exists || (userDoc.data() && userDoc.data().pseudonym)) {
      console.log('User document missing or pseudonym already assigned');
      return null;
    }
    
    // Get user role or default to 'freelancer'
    const userData = userDoc.data() || {};
    const userRole = userData.role || 'freelancer';
    
    // Determine prefix based on role and skills (if available)
    let prefix = 'Professional';
    
    if (userData.skills && Array.isArray(userData.skills)) {
      if (userData.skills.some(skill => 
        ['design', 'graphic', 'ui', 'ux', 'illustration'].includes(skill.toLowerCase()))) {
        prefix = 'Designer';
      } else if (userData.skills.some(skill => 
        ['writing', 'content', 'copywriting', 'editing'].includes(skill.toLowerCase()))) {
        prefix = 'Writer';
      } else if (userData.skills.some(skill => 
        ['development', 'coding', 'programming', 'developer'].includes(skill.toLowerCase()))) {
        prefix = 'Developer';
      }
    } else if (userRole === 'agency') {
      prefix = 'Agent';
    }
    
    // Generate initial pseudonym
    let pseudonym = `${prefix} ${generateRandomSuffix()}`;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Check if pseudonym is unique, regenerate if not
    while (attempts < maxAttempts) {
      const existingUser = await db.collection('users')
        .where('pseudonym', '==', pseudonym)
        .limit(1)
        .get();
      
      if (existingUser.empty) {
        break; // Pseudonym is unique
      }
      
      // Generate a new suffix and try again
      pseudonym = `${prefix} ${generateRandomSuffix()}`;
      attempts++;
    }
    
    // Update user document with the pseudonym
    await db.collection('users').doc(user.uid).set({
      pseudonym: pseudonym,
      pseudonymAssignedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log(`Assigned pseudonym "${pseudonym}" to user ${user.uid}`);
    return null;
  } catch (error) {
    console.error('Error assigning pseudonym:', error);
    return null;
  }
});

// Export the function
module.exports = {
  assignPseudonym: exports.assignPseudonym
};
