import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-procloud-gray-900 text-procloud-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tighter text-white">
                pro<span className="text-procloud-green">Digital Cloud Agency</span>
              </span>
            </Link>
            <p className="text-sm mb-4">
              Zimbabwe's premier freelance marketplace connecting local talent with businesses.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-procloud-green">Browse Jobs</Link></li>
              <li><Link to="/freelancers" className="hover:text-procloud-green">Find Freelancers</Link></li>
              <li><Link to="/post-job" className="hover:text-procloud-green">Post a Brief</Link></li>
              <li><Link to="/how-it-works" className="hover:text-procloud-green">How It Works</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/success-stories" className="hover:text-procloud-green">Success Stories</Link></li>
              <li><Link to="/blog" className="hover:text-procloud-green">Blog</Link></li>
              <li><Link to="/guides" className="hover:text-procloud-green">Guides</Link></li>
              <li><Link to="/help" className="hover:text-procloud-green">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-procloud-green">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-procloud-green">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-procloud-green">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-procloud-green">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-procloud-gray-800 mt-8 pt-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} proCLOUD. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-procloud-green">Facebook</a>
              <a href="#" className="hover:text-procloud-green">Twitter</a>
              <a href="#" className="hover:text-procloud-green">Instagram</a>
              <a href="#" className="hover:text-procloud-green">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;