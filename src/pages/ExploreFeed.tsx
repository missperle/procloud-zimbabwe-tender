
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Feed from "@/components/explore/Feed";
import TabBar from "@/components/explore/TabBar";
import { categories } from "@/components/layout/CategoryNav";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import SubscriptionGuard from "@/components/subscription/SubscriptionGuard";

const ExploreFeed = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { currentUser } = useAuth();
  
  // Ensure that the feed is refreshed when the category changes
  useEffect(() => {
    document.title = "Explore | Proverb Digital";
    // Force scroll to top when the category changes
    window.scrollTo(0, 0);
  }, [activeCategory]);

  return (
    <Layout>
      <div className="w-full min-h-screen bg-white">
        <div className="sticky top-16 z-20 bg-white border-b border-gray-200">
          <TabBar 
            categories={categories} 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
        </div>
        <SubscriptionGuard>
          <div className="w-full min-h-screen">
            <Feed activeCategory={activeCategory} />
          </div>
        </SubscriptionGuard>
      </div>
    </Layout>
  );
};

export default ExploreFeed;
