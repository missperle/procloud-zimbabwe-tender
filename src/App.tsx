
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SignupClient from "./pages/SignupClient";
import SignupFreelancer from "./pages/SignupFreelancer";
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
import EditProfilePage from "./pages/EditProfilePage"; // Add this import
import SubmitProposalPage from "./pages/SubmitProposalPage";
import Pricing from "./pages/Pricing";
import BuyTokens from "./pages/BuyTokens";
import CreateBrief from "./pages/CreateBrief";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

// Protected route component for authentication
const ProtectedRoute = ({ children, isAllowed, redirectPath = '/login' }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

// Role-specific route component with more strict checking
const RoleRoute = ({ children, allowedRole, currentRole, redirectPath = '/login', onboardingCompleted }) => {
  // If not the allowed role, redirect
  if (!currentRole || currentRole !== allowedRole) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

function App() {
  const { currentUser, loading, userStatus } = useAuth();
  const { userRole } = useSubscription();
  
  // Determine the dashboard path based on user role and onboarding status
  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    
    // Use userStatus if available (it contains more reliable role information)
    const role = userStatus?.role || userRole;
    const onboardingCompleted = userStatus?.onboardingCompleted || false;
    
    if (role === 'freelancer') {
      return onboardingCompleted ? '/dashboard' : '/freelancer-onboarding';
    } else if (role === 'client') {
      return onboardingCompleted ? '/client-dashboard' : '/client-onboarding';
    }
    
    return '/register';
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes accessible to all users */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/signup/client" element={<SignupClient />} />
        <Route path="/signup/freelancer" element={<SignupFreelancer />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/explore" element={<ExploreFeed />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected routes that require authentication */}
        <Route path="/jobs/:id" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <JobDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/freelancers/:id" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <FreelancerProfile />
          </ProtectedRoute>
        } />

        {/* Role-specific routes for freelancers */}
        <Route path="/freelancer-onboarding" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <FreelancerOnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <RoleRoute allowedRole="freelancer" currentRole={userStatus?.role || userRole} redirectPath={getDashboardPath()} onboardingCompleted={userStatus?.onboardingCompleted || false}>
              <EditProfilePage />
            </RoleRoute>
          </ProtectedRoute>
        } />
        <Route path="/submit-proposal/:id" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <RoleRoute allowedRole="freelancer" currentRole={userStatus?.role || userRole} redirectPath={getDashboardPath()} onboardingCompleted={userStatus?.onboardingCompleted || false}>
              <SubmitProposalPage />
            </RoleRoute>
          </ProtectedRoute>
        } />

        {/* Role-specific routes for clients */}
        <Route path="/client-onboarding" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <ClientOnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/create-brief" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <RoleRoute allowedRole="client" currentRole={userStatus?.role || userRole} redirectPath={getDashboardPath()} onboardingCompleted={userStatus?.onboardingCompleted || false}>
              <CreateBrief />
            </RoleRoute>
          </ProtectedRoute>
        } />
        <Route path="/client-dashboard" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <RoleRoute allowedRole="client" currentRole={userStatus?.role || userRole} redirectPath={getDashboardPath()} onboardingCompleted={userStatus?.onboardingCompleted || false}>
              <ClientDashboard />
            </RoleRoute>
          </ProtectedRoute>
        } />

        {/* General protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/buy-tokens" element={
          <ProtectedRoute isAllowed={!!currentUser}>
            <BuyTokens />
          </ProtectedRoute>
        } />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
