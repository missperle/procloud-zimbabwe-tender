
// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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
const db = getFirestore(app);

// For testing purposes, create test users
// Note: In a real app, you should create users through Firebase console or registration
const createTestUsers = async () => {
  // This import is only used in development
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  
  try {
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      console.log("Setting up test users for development environment");
      
      // Create client test user
      const clientEmail = "test@proverb.digital";
      const clientPassword = "password123";
      
      // Try to create the client test user
      await createUserWithEmailAndPassword(auth, clientEmail, clientPassword)
        .then(async (userCredential) => {
          console.log("Client test user created successfully");
          // Set user role in Firestore
          await setDoc(doc(db, "users", userCredential.user.uid), {
            email: clientEmail,
            role: "client",
            createdAt: new Date(),
          });
        })
        .catch(async (err) => {
          // If error is because user already exists, check if role exists in Firestore
          if (err.code === 'auth/email-already-in-use') {
            console.log("Client test user already exists, checking role in Firestore");
            
            // Sign in to get the UID
            const { signInWithEmailAndPassword } = await import("firebase/auth");
            try {
              const userCredential = await signInWithEmailAndPassword(auth, clientEmail, clientPassword);
              const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
              
              if (!userDoc.exists()) {
                // Create the user document if it doesn't exist
                await setDoc(doc(db, "users", userCredential.user.uid), {
                  email: clientEmail,
                  role: "client",
                  createdAt: new Date(),
                });
                console.log("Added role 'client' to existing test user");
              }
              
              // Sign out
              auth.signOut();
            } catch (signInError) {
              console.error("Error checking client test user:", signInError);
            }
          } else {
            console.error("Error creating client test user:", err.message);
          }
        });
        
      // Create agency test user
      const agencyEmail = "agency@proverb.digital";
      const agencyPassword = "agency123";
      
      // Try to create the agency test user
      await createUserWithEmailAndPassword(auth, agencyEmail, agencyPassword)
        .then(async (userCredential) => {
          console.log("Agency test user created successfully");
          // Set user role in Firestore
          await setDoc(doc(db, "users", userCredential.user.uid), {
            email: agencyEmail,
            role: "agency",
            createdAt: new Date(),
          });
        })
        .catch(async (err) => {
          // If error is because user already exists, check if role exists in Firestore
          if (err.code === 'auth/email-already-in-use') {
            console.log("Agency test user already exists, checking role in Firestore");
            
            // Sign in to get the UID
            const { signInWithEmailAndPassword } = await import("firebase/auth");
            try {
              const userCredential = await signInWithEmailAndPassword(auth, agencyEmail, agencyPassword);
              const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
              
              if (!userDoc.exists()) {
                // Create the user document if it doesn't exist
                await setDoc(doc(db, "users", userCredential.user.uid), {
                  email: agencyEmail,
                  role: "agency",
                  createdAt: new Date(),
                });
                console.log("Added role 'agency' to existing test user");
              }
              
              // Sign out
              auth.signOut();
            } catch (signInError) {
              console.error("Error checking agency test user:", signInError);
            }
          } else {
            console.error("Error creating agency test user:", err.message);
          }
        });
        
      // Create sample briefs for agency to review
      await createSampleBriefs();
    }
  } catch (error) {
    console.error("Error setting up test users:", error);
  }
};

// Create sample briefs for agency to review
const createSampleBriefs = async () => {
  try {
    const briefs = [
      {
        id: "brief1",
        title: "E-commerce website redesign",
        originalText: "We need a complete redesign of our online store to improve conversion rates and user experience. The current site is outdated and not mobile-friendly. We want a modern, responsive design that showcases our products better.",
        status: "new",
        clientId: "client123",
        createdAt: new Date()
      },
      {
        id: "brief2",
        title: "Marketing campaign for product launch",
        originalText: "We're launching a new line of eco-friendly products next month and need a comprehensive digital marketing campaign. We want to focus on social media, email marketing, and potentially some paid advertising.",
        status: "new",
        clientId: "client456",
        createdAt: new Date()
      },
      {
        id: "brief3",
        title: "Mobile app development",
        originalText: "We need to develop a companion app for our existing web service. The app should allow users to access their accounts, view their order history, and make purchases. We want both iOS and Android versions.",
        status: "new",
        clientId: "client789",
        createdAt: new Date()
      }
    ];

    // Check if briefs already exist
    const briefsCollection = db.collection("briefs");
    const snapshot = await briefsCollection.where("status", "==", "new").get();
    
    // Only add sample briefs if none exist
    if (snapshot.empty) {
      console.log("Creating sample briefs for agency review");
      for (const brief of briefs) {
        await briefsCollection.doc(brief.id).set(brief);
      }
    }
  } catch (error) {
    console.error("Error creating sample briefs:", error);
  }
};

// Call this function on development environment initialization
if (import.meta.env.DEV) {
  createTestUsers();
}

export { auth, db };
