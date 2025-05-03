
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetailsPage from "./pages/JobDetailsPage";
import Freelancers from "./pages/Freelancers";
import FreelancerProfile from "./pages/FreelancerProfile";
import ClientDashboard from "./pages/ClientDashboard";
import Dashboard from "./pages/Dashboard";
import ExploreFeed from "./pages/ExploreFeed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyTokens from "./pages/BuyTokens";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import ImageGenerator from './components/client/ImageGenerator';
import SubmitProposalPage from "./pages/SubmitProposalPage";
import ChatWidget from "./components/chat/ChatWidget";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
                <Route path="/freelancers" element={<Freelancers />} />
                <Route path="/freelancers/:id" element={<FreelancerProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/explore" element={<ExploreFeed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/buy-tokens" element={<BuyTokens />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/generate-images" element={<ImageGenerator />} />
                <Route path="/jobs/:jobId/submit-proposal" element={<SubmitProposalPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatWidget />
            </TooltipProvider>
          </BrowserRouter>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
