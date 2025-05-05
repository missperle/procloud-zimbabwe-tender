
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ReviewQueue from "@/components/agency/ReviewQueue";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import { supabase } from "@/integrations/supabase/client";

const AgencyReview = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [currentUser]);
  
  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <RoleGuard allowedRoles={["agency"]}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Agency Review Queue</h1>
          <ReviewQueue />
        </div>
      </Layout>
    </RoleGuard>
  );
};

export default AgencyReview;
