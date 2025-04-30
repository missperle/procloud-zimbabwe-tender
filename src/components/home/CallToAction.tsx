import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const CallToAction = () => {
  return <section className="py-20 bg-procloud-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute h-96 w-96 rounded-full bg-procloud-green blur-3xl -top-20 -right-20" />
        <div className="absolute h-96 w-96 rounded-full bg-procloud-green blur-3xl -bottom-20 -left-20" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6">Join the Cloud Community</h2>
          <p className="text-xl mb-8 text-procloud-gray-300">
            Whether you're a talented creator or a business seeking quality work,
            proCLOUD connects you with Zimbabwe's best freelance marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/signup?type=freelancer">
              <Button size="lg" className="w-full sm:w-auto text-lg bg-procloud-green hover:bg-procloud-gold hover:text-black">
                Join as a Freelancer
              </Button>
            </Link>
            <Link to="/signup?type=business">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg border-white text-white hover:bg-white/10">
                Sign up as a Business
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToAction;