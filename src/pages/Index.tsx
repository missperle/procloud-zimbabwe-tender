
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
      <HeroSection />
      <ProjectGrid />
      <TenderSpotlight />
      <HowItWorks />
      <PaymentOptions />
      <CallToAction />
    </Layout>
  );
};

export default Index;
