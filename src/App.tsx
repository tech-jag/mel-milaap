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
              {/* Public Marketing Pages - No Auth Required */}
              <Route path="/" element={<Index />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/wedding-planning" element={<WeddingPlanning />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/:slug" element={<StoryDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/data-rights" element={<DataRights />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/trust" element={<Trust />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/city/sydney" element={<CitySydney />} />
              <Route path="/city/melbourne" element={<CityMelbourne />} />
              <Route path="/city/auckland" element={<CityAuckland />} />
              <Route path="/health" element={<Health />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/for/parents" element={<ForParents />} />
              <Route path="/for/singles" element={<ForSingles />} />
              <Route path="/for/suppliers" element={<ForSuppliers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/help" element={<Help />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/suppliers/featured" element={<SuppliersFeatureListings />} />
              <Route path="/suppliers/pricing" element={<SuppliersPricing />} />
              <Route path="/premium-plans" element={<OnboardingGuard><PremiumPlans /></OnboardingGuard>} />
              <Route path="/planning" element={<PublicPlanning />} />
              <Route path="/profile/:userId" element={<PublicProfile />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Auth />} />
              <Route path="/auth/signup" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account/reset-password" element={<ResetPassword />} />
              
              {/* Supplier Public Routes */}
              <Route path="/supplier/signup" element={<SupplierSignup />} />
              <Route path="/suppliers/signup" element={<SupplierSignup />} />

              {/* Onboarding Routes - Protected */}
              <Route path="/onboarding/1" element={<OnboardingGuard><OnboardingStep1 /></OnboardingGuard>} />
              <Route path="/onboarding/2" element={<OnboardingGuard><OnboardingStep2 /></OnboardingGuard>} />
              <Route path="/onboarding/3" element={<OnboardingGuard><OnboardingStep3 /></OnboardingGuard>} />
              <Route path="/onboarding/4" element={<OnboardingGuard><OnboardingStep4 /></OnboardingGuard>} />
              <Route path="/onboarding/5" element={<OnboardingGuard><OnboardingStep5 /></OnboardingGuard>} />
              <Route path="/onboarding/6" element={<OnboardingGuard><OnboardingStep6 /></OnboardingGuard>} />
              <Route path="/onboarding/7" element={<OnboardingGuard><OnboardingStep7 /></OnboardingGuard>} />
              <Route path="/onboarding/8" element={<OnboardingGuard><OnboardingStep8 /></OnboardingGuard>} />
              <Route path="/onboarding/9" element={<OnboardingGuard><OnboardingStep9 /></OnboardingGuard>} />
              <Route path="/onboarding/10" element={<OnboardingGuard><OnboardingStep10 /></OnboardingGuard>} />
              <Route path="/onboarding/11" element={<OnboardingGuard><OnboardingStep11 /></OnboardingGuard>} />
              <Route path="/onboarding/12" element={<OnboardingGuard><OnboardingStep12 /></OnboardingGuard>} />
              <Route path="/onboarding/13" element={<OnboardingGuard><OnboardingStep13 /></OnboardingGuard>} />
              <Route path="/onboarding/14" element={<OnboardingGuard><OnboardingStep14 /></OnboardingGuard>} />
              <Route path="/onboarding/15" element={<OnboardingGuard><OnboardingStep15 /></OnboardingGuard>} />
              <Route path="/onboarding/16" element={<OnboardingGuard><OnboardingStep16 /></OnboardingGuard>} />
              <Route path="/onboarding/17" element={<OnboardingGuard><OnboardingStep17 /></OnboardingGuard>} />
              <Route path="/onboarding/18" element={<OnboardingGuard><OnboardingStep18 /></OnboardingGuard>} />
              <Route path="/onboarding/19" element={<OnboardingGuard><OnboardingStep19 /></OnboardingGuard>} />
              <Route path="/onboarding/20" element={<OnboardingGuard><OnboardingStep20 /></OnboardingGuard>} />
              <Route path="/onboarding/21" element={<OnboardingGuard><OnboardingStep21 /></OnboardingGuard>} />
              <Route path="/onboarding/22" element={<OnboardingGuard><OnboardingStep22 /></OnboardingGuard>} />
              <Route path="/onboarding/23" element={<OnboardingGuard><OnboardingStep23 /></OnboardingGuard>} />
              
              {/* Protected Routes with OnboardingGuard */}
              <Route path="/match" element={<OnboardingGuard><Match /></OnboardingGuard>} />
              
              {/* Protected Planning Routes */}
              <Route path="/account/planning" element={<OnboardingGuard><PrivateRoute><AccountPlanning /></PrivateRoute></OnboardingGuard>} />
              <Route path="/planning/budget" element={<OnboardingGuard><PrivateRoute><AccountPlanningBudget /></PrivateRoute></OnboardingGuard>} />
              <Route path="/planning/guests" element={<OnboardingGuard><PrivateRoute><AccountPlanningGuests /></PrivateRoute></OnboardingGuard>} />
              <Route path="/planning/timeline" element={<OnboardingGuard><PrivateRoute><PlanningTimeline /></PrivateRoute></OnboardingGuard>} />
              <Route path="/planning/registry" element={<OnboardingGuard><PrivateRoute><PlanningRegistry /></PrivateRoute></OnboardingGuard>} />
              <Route path="/planning/checklist" element={<OnboardingGuard><PrivateRoute><PlanningChecklist /></PrivateRoute></OnboardingGuard>} />
              <Route path="/planning/notes" element={<OnboardingGuard><PrivateRoute><PlanningNotes /></PrivateRoute></OnboardingGuard>} />
              
              {/* Protected Account Routes */}
              <Route path="/account" element={<OnboardingGuard><PrivateRoute><AccountDashboard /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/settings" element={<OnboardingGuard><PrivateRoute><AccountSettings /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/profile" element={<OnboardingGuard><PrivateRoute><AccountProfile /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/photos" element={<OnboardingGuard><PrivateRoute><AccountPhotos /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/billing" element={<OnboardingGuard><PrivateRoute><AccountBilling /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/security" element={<OnboardingGuard><PrivateRoute><AccountSecurity /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/verification" element={<OnboardingGuard><PrivateRoute><AccountVerification /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/messages" element={<OnboardingGuard><PrivateRoute><AccountMessages /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/favorites" element={<OnboardingGuard><PrivateRoute><AccountFavorites /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/planning/budget" element={<OnboardingGuard><PrivateRoute><AccountPlanningBudget /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/planning/guests" element={<OnboardingGuard><PrivateRoute><AccountPlanningGuests /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/planning/todo" element={<OnboardingGuard><PrivateRoute><AccountPlanningTodo /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/planning/seating" element={<OnboardingGuard><PrivateRoute><AccountPlanningSeating /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/invites" element={<OnboardingGuard><PrivateRoute><AccountInvites /></PrivateRoute></OnboardingGuard>} />
              <Route path="/account/collaborators" element={<OnboardingGuard><PrivateRoute><AccountCollaborators /></PrivateRoute></OnboardingGuard>} />
              
              {/* Protected Supplier Routes */}
              <Route path="/supplier/dashboard" element={<OnboardingGuard><PrivateRoute><SupplierDashboard /></PrivateRoute></OnboardingGuard>} />
              <Route path="/suppliers/dashboard" element={<OnboardingGuard><PrivateRoute><SupplierDashboard /></PrivateRoute></OnboardingGuard>} />
              
              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
