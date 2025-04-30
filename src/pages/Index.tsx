
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TenderSpotlight from "@/components/home/TenderSpotlight";
import HowItWorks from "@/components/home/HowItWorks";
import PaymentOptions from "@/components/home/PaymentOptions";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <Layout>
      {/* Hero and Tender Spotlight with Scroll-Snap */}
      <div className="scroll-container">
        <HeroSection />
        <TenderSpotlight />
      </div>
      
      {/* Regular Sections (outside scroll container) */}
      <section>
        <HowItWorks />
      </section>
      
      <section>
        <PaymentOptions />
      </section>
      
      <section>
        <CallToAction />
      </section>
    </Layout>
  );
};

export default Index;
