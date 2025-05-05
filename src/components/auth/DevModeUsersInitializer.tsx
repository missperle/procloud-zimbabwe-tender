
import { useEffect } from "react";
import { createTestUsers } from "@/utils/devAuth/testUserCreator";

/**
 * Component that runs only in development mode to ensure test users exist
 * This component doesn't render anything and just handles the side effect
 * of creating test users when the application starts
 */
const DevModeUsersInitializer = () => {
  // Create test users for development mode
  useEffect(() => {
    // Only run in development mode
    if (import.meta.env.DEV) {
      createTestUsers();
    }
  }, []);

  return null; // This component doesn't render anything
};

export default DevModeUsersInitializer;
