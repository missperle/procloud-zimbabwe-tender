
import { useEffect } from "react";
import { createTestUser, DEV_CREDENTIALS } from "@/utils/authHelpers";

const DevModeUsersInitializer = () => {
  // Create test users for development mode
  useEffect(() => {
    const initializeTestUsers = async () => {
      if (!import.meta.env.DEV) return;
      
      try {
        console.log("Checking if test users need to be created...");
        
        // Try to create client test user
        await createTestUser("client", DEV_CREDENTIALS.client.email, DEV_CREDENTIALS.client.password);
        
        // Try to create freelancer test user
        await createTestUser("freelancer", DEV_CREDENTIALS.freelancer.email, DEV_CREDENTIALS.freelancer.password);
      } catch (err) {
        console.error("Error creating test users:", err);
      }
    };
    
    initializeTestUsers();
  }, []);

  return null; // This component doesn't render anything
};

export default DevModeUsersInitializer;
