
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TenderSpotlight from "@/components/home/TenderSpotlight";
import HowItWorks from "@/components/home/HowItWorks";
import PaymentOptions from "@/components/home/PaymentOptions";
import CallToAction from "@/components/home/CallToAction";
import ProjectGrid from "@/components/projects/ProjectGrid";

const Index = () => {
  return (
    <Layout>
      <div className="sections-container">
        {/* Hero Section */}
        <section className="full-height-section">
          <div className="section-content">
            <HeroSection />
          </div>
          <div className="section-mask"></div>
        </section>
        
        {/* Projects Grid Section */}
        <section className="full-height-section">
          <div className="section-content">
            <ProjectGrid />
          </div>
          <div className="section-mask"></div>
        </section>
        
        {/* Tender Spotlight Section */}
        <section className="full-height-section">
          <div className="section-content">
            <TenderSpotlight />
          </div>
          <div className="section-mask"></div>
        </section>
        
        {/* How It Works Section */}
        <section className="full-height-section">
          <div className="section-content">
            <HowItWorks />
          </div>
          <div className="section-mask"></div>
        </section>
        
        {/* Payment Options Section */}
        <section className="full-height-section">
          <div className="section-content">
            <PaymentOptions />
          </div>
          <div className="section-mask"></div>
        </section>
        
        {/* Call to Action Section */}
        <section className="full-height-section">
          <div className="section-content">
            <CallToAction />
          </div>
          <div className="section-mask"></div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
