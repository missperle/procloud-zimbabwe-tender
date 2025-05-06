
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import JobDetailsPage from "./pages/JobDetailsPage";
import Freelancers from "./pages/Freelancers";
import FreelancerProfile from "./pages/FreelancerProfile";
import ExploreFeed from "./pages/ExploreFeed";
import FreelancerOnboardingPage from "./pages/FreelancerOnboardingPage";
import ClientOnboardingPage from "./pages/ClientOnboardingPage";
import SubmitProposalPage from "./pages/SubmitProposalPage";
import Pricing from "./pages/Pricing";
import BuyTokens from "./pages/BuyTokens";
import CreateBrief from "./pages/CreateBrief";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} /> {/* Add an alias for signup to register */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/client-onboarding" element={<ClientOnboardingPage />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/freelancers/:id" element={<FreelancerProfile />} />
        <Route path="/explore" element={<ExploreFeed />} />
        <Route path="/freelancer-onboarding" element={<FreelancerOnboardingPage />} />
        <Route path="/submit-proposal/:id" element={<SubmitProposalPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/buy-tokens" element={<BuyTokens />} />
        <Route path="/create-brief" element={<CreateBrief />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
