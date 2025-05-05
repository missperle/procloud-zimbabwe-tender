
// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";

// NOTE: This file is kept for backward compatibility but the app now uses Supabase instead of Firebase

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

// Firebase is no longer used for authentication or database in this application.
// These test user functions are now handled in LoginForm.tsx with Supabase.

// Function to get Firestore security rules for subscriptions collection
export const getSubscriptionSecurityRules = () => {
  return `
    // Firestore security rules for subscriptions collection
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /subscriptions/{subscriptionId} {
          // Allow users to create subscriptions only for their own userId
          allow create: if request.auth != null && 
                         request.resource.data.userId == request.auth.uid;
          
          // Allow users to read only their own subscription documents
          allow read: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
          
          // Only allow admins (with role="admin") to update status to "active"
          allow update: if request.auth != null && 
                         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin" || 
                         (request.auth.uid == resource.data.userId && 
                         request.resource.data.status != "active");
        }
      }
    }
  `;
};

export { auth, db };
