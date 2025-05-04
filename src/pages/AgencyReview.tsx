
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ReviewQueue from "@/components/agency/ReviewQueue";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AgencyReview = () => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user has agency role
  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        // In a real app, this would fetch the user's role from Firestore
        const userDoc = await fetch(`/api/users/${currentUser.uid}`);
        const userData = await userDoc.json();
        setUserRole(userData.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserRole();
  }, [currentUser]);

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Redirect non-agency users
  if (!currentUser || userRole !== "agency") {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Layout activeCategory="All" onCategoryChange={() => {}}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Agency Review Queue</h1>
        <ReviewQueue />
      </div>
    </Layout>
  );
};

export default AgencyReview;
