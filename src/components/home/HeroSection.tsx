
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingShapes from "../ui/floating-shapes";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-procloud-black text-white">
      <FloatingShapes density="medium" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 leading-tight">
            <span className="inline-block">Zimbabwe's Premier</span>
            <br />
            <span className="text-outline-white text-procloud-green">Digital Tender</span>
            <span className="inline-block"> Platform</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-procloud-gray-300 max-w-2xl mx-auto text-balance">
            Connecting talented local freelancers with businesses through a transparent, no-bid platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link to="/post-job">
              <Button size="lg" className="text-lg w-full sm:w-auto bg-procloud-green hover:bg-procloud-green-dark text-black font-medium">
                Post a Brief
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="text-lg w-full sm:w-auto border-white text-white hover:bg-white/10 font-medium">
                Submit Work
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
