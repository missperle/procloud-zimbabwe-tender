
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import Feed from "@/components/explore/Feed";
import { categories } from "@/components/layout/CategoryNav";

const ExploreFeed = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  return (
    <Layout activeCategory={activeCategory} onCategoryChange={setActiveCategory}>
      <div className="w-full min-h-screen">
        <Feed />
      </div>
    </Layout>
  );
};

export default ExploreFeed;
