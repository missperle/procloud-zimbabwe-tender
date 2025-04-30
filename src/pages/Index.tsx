
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import PaymentOptions from "@/components/home/PaymentOptions";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <HowItWorks />
      <PaymentOptions />
      <CallToAction />
    </Layout>
  );
};

export default Index;
