
import Layout from "@/components/layout/Layout";
import Feed from "@/components/explore/Feed";

const ExploreFeed = () => {
  return (
    <Layout>
      <div className="w-full py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Explore Feed</h1>
          <Feed />
        </div>
      </div>
    </Layout>
  );
};

export default ExploreFeed;
