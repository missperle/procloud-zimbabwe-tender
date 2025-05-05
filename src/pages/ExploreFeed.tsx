
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import Feed from "@/components/explore/Feed";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import SubscriptionGuard from "@/components/subscription/SubscriptionGuard";

const ExploreFeed = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { currentUser } = useAuth();
  
  return (
    <Layout activeCategory={activeCategory} onCategoryChange={setActiveCategory}>
      <SubscriptionGuard>
        <div className="w-full min-h-screen">
          <Feed activeCategory={activeCategory} />
        </div>
      </SubscriptionGuard>
    </Layout>
  );
};

export default ExploreFeed;
