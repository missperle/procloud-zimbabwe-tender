
// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Use environment variables in production
const firebaseConfig = {
  apiKey: "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY",
  authDomain: "proverb-digital.firebaseapp.com",
  projectId: "proverb-digital",
  storageBucket: "proverb-digital.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Initialize Firebase - with a named instance to avoid duplicate app error
const app = initializeApp(firebaseConfig, "proverb-digital-client");
const auth = getAuth(app);

// For testing purposes, create a test user
// Note: In a real app, you should create users through Firebase console or registration
const createTestUser = async () => {
  // This import is only used in development
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  
  try {
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      console.log("Setting up test user for development environment");
      const testEmail = "test@proverb.digital";
      const testPassword = "password123";
      
      // Try to create the test user
      await createUserWithEmailAndPassword(auth, testEmail, testPassword)
        .then(() => {
          console.log("Test user created successfully");
        })
        .catch((err) => {
          // If error is because user already exists, that's fine
          if (err.code === 'auth/email-already-in-use') {
            console.log("Test user already exists, ready to use");
          } else {
            console.error("Error creating test user:", err.message);
          }
        });
    }
  } catch (error) {
    console.error("Error setting up test user:", error);
  }
};

// Call this function on development environment initialization
if (import.meta.env.DEV) {
  createTestUser();
}

export { auth };
