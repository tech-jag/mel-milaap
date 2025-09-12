import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorBoundary } from "./components/system/ErrorBoundary";
import { AuthProvider } from "./hooks/useAuth";
import { PrivateRoute } from "./components/routing/PrivateRoute";

// ... keep existing imports

// Page imports
import Index from "./pages/Index";
import AccountCollaborators from "./pages/AccountCollaborators";
import PlanningNotes from "./pages/PlanningNotes";
import Match from "./pages/Match";
import Suppliers from "./pages/Suppliers";
import PublicPlanning from "./pages/PublicPlanning";
import AccountPlanning from "./pages/AccountPlanning";
import WeddingPlanning from "./pages/WeddingPlanning";
import Tools from "./pages/Tools";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Premium from "./pages/Premium";
import PartnerPreferences from "./pages/PartnerPreferences";
import ProfilePreviewPage from "./pages/ProfilePreview";
import Pricing from "./pages/Pricing";
import Trust from "./pages/Trust";
import Verification from "./pages/Verification";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import AccountSecurity from "./pages/AccountSecurity";
import AccountProfile from "./pages/AccountProfile";
import AccountPhotos from "./pages/AccountPhotos";
import AccountBilling from "./pages/AccountBilling";
import AccountFavorites from "./pages/AccountFavorites";
import AccountPlanningBudget from "./pages/AccountPlanningBudget";
import AccountPlanningGuests from "./pages/AccountPlanningGuests";
import AccountPlanningTodo from "./pages/AccountPlanningTodo";
import AccountGuests from "./pages/AccountGuests";
import AccountPlanningSeating from "./pages/AccountPlanningSeating";
import AccountInvites from "./pages/AccountInvites";
import PlanningDashboard from "./pages/PlanningDashboard";
import PlanningTimeline from "./pages/PlanningTimeline";
import PlanningRegistry from "./pages/PlanningRegistry";
import PlanningChecklist from "./pages/PlanningChecklist";
import AccountMessages from "./pages/AccountMessages";
import AccountVerification from "./pages/AccountVerification";
import SupplierSignup from "./pages/SupplierSignup";
import SupplierDashboard from "./pages/SupplierDashboard";
import AccountSettings from "./pages/AccountSettings";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CitySydney from "./pages/CitySydney";
import CityMelbourne from "./pages/CityMelbourne";
import CityAuckland from "./pages/CityAuckland";
import Health from "./pages/Health";
import NotFound from "./pages/NotFound";
import AccountDashboard from "./pages/AccountDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataRights from "./pages/DataRights";
import HowItWorks from "./pages/HowItWorks";
import ForParents from "./pages/ForParents";
import ForSingles from "./pages/ForSingles";
import ForSuppliers from "./pages/ForSuppliers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Destinations from "./pages/Destinations";
import SuppliersFeatureListings from "./pages/SuppliersFeatureListings";
import SuppliersPricing from "./pages/SuppliersPricing";

// Import Onboarding components
import { OnboardingGuard } from "./components/onboarding/OnboardingGuard";
import OnboardingStep1 from "./pages/onboarding/OnboardingStep1";
import OnboardingStep2 from "./pages/onboarding/OnboardingStep2";
import OnboardingStep3 from "./pages/onboarding/OnboardingStep3";
import OnboardingStep4 from "./pages/onboarding/OnboardingStep4";
import OnboardingStep5 from "./pages/onboarding/OnboardingStep5";
import OnboardingStep6 from "./pages/onboarding/OnboardingStep6";
import OnboardingStep7 from "./pages/onboarding/OnboardingStep7";
import OnboardingStep8 from "./pages/onboarding/OnboardingStep8";
import OnboardingStep9 from "./pages/onboarding/OnboardingStep9";
import OnboardingStep10 from "./pages/onboarding/OnboardingStep10";
import OnboardingStep11 from "./pages/onboarding/OnboardingStep11";
import OnboardingStep12 from "./pages/onboarding/OnboardingStep12";
import OnboardingStep13 from "./pages/onboarding/OnboardingStep13";
import OnboardingStep14 from "./pages/onboarding/OnboardingStep14";
import OnboardingStep15 from "./pages/onboarding/OnboardingStep15";
import OnboardingStep16 from "./pages/onboarding/OnboardingStep16";
import OnboardingStep17 from "./pages/onboarding/OnboardingStep17";
import OnboardingStep18 from "./pages/onboarding/OnboardingStep18";
import OnboardingStep19 from "./pages/onboarding/OnboardingStep19";
import OnboardingStep20 from "./pages/onboarding/OnboardingStep20";
import OnboardingStep21 from "./pages/onboarding/OnboardingStep21";
import OnboardingStep22 from "./pages/onboarding/OnboardingStep22";
import OnboardingStep23 from "./pages/onboarding/OnboardingStep23";
import PremiumPlans from "./pages/PremiumPlans";
import PublicProfile from "./pages/PublicProfile";

const queryClient = new QueryClient();

// Debug logging to confirm React is working
console.log('React import check:', { 
  React: typeof React, 
  useEffect: typeof React.useEffect,
  useState: typeof React.useState 
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Landing Page - Coming Soon */}
              <Route path="/" element={<Index />} />
              
              {/* Catch-all Route - Redirect to Landing */}
              <Route path="*" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
