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
            <OnboardingGuard>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/match" element={<Match />} />
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
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Auth />} />
              <Route path="/auth/signup" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account/reset-password" element={<ResetPassword />} />
              
              {/* Onboarding Routes */}
              <Route path="/onboarding/1" element={<OnboardingStep1 />} />
              <Route path="/onboarding/2" element={<OnboardingStep2 />} />
              <Route path="/onboarding/3" element={<OnboardingStep3 />} />
            <Route path="/onboarding/4" element={<OnboardingStep4 />} />
            <Route path="/onboarding/5" element={<OnboardingStep5 />} />
            <Route path="/onboarding/6" element={<OnboardingStep6 />} />
            <Route path="/onboarding/7" element={<OnboardingStep7 />} />
            <Route path="/onboarding/8" element={<OnboardingStep8 />} />
            <Route path="/onboarding/9" element={<OnboardingStep9 />} />
            <Route path="/onboarding/10" element={<OnboardingStep10 />} />
            <Route path="/onboarding/11" element={<OnboardingStep11 />} />
            <Route path="/onboarding/12" element={<OnboardingStep12 />} />
            <Route path="/onboarding/13" element={<OnboardingStep13 />} />
            <Route path="/onboarding/14" element={<OnboardingStep14 />} />
            <Route path="/onboarding/15" element={<OnboardingStep15 />} />
            <Route path="/onboarding/16" element={<OnboardingStep16 />} />
            <Route path="/onboarding/17" element={<OnboardingStep17 />} />
            <Route path="/onboarding/18" element={<OnboardingStep18 />} />
            <Route path="/onboarding/19" element={<OnboardingStep19 />} />
            <Route path="/onboarding/20" element={<OnboardingStep20 />} />
            <Route path="/onboarding/21" element={<OnboardingStep21 />} />
            <Route path="/onboarding/22" element={<OnboardingStep22 />} />
            <Route path="/onboarding/23" element={<OnboardingStep23 />} />
              <Route path="/onboarding/:step" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-semibold mb-4">Onboarding Step Coming Soon</h1><p className="text-muted-foreground">This step is being developed. Please check back soon!</p></div></div>} />
              
              {/* Public Planning Route */}
              <Route path="/planning" element={<PublicPlanning />} />
              
              {/* Protected Planning Routes */}
              <Route path="/account/planning" element={<PrivateRoute><AccountPlanning /></PrivateRoute>} />
              <Route path="/planning/budget" element={<PrivateRoute><AccountPlanningBudget /></PrivateRoute>} />
              <Route path="/planning/guests" element={<PrivateRoute><AccountPlanningGuests /></PrivateRoute>} />
              <Route path="/planning/timeline" element={<PrivateRoute><PlanningTimeline /></PrivateRoute>} />
              <Route path="/planning/registry" element={<PrivateRoute><PlanningRegistry /></PrivateRoute>} />
              <Route path="/planning/checklist" element={<PrivateRoute><PlanningChecklist /></PrivateRoute>} />
              <Route path="/planning/notes" element={<PrivateRoute><PlanningNotes /></PrivateRoute>} />
              
              {/* Protected Account Routes */}
              <Route path="/account" element={<PrivateRoute><AccountDashboard /></PrivateRoute>} />
              <Route path="/account/settings" element={<PrivateRoute><AccountSettings /></PrivateRoute>} />
              <Route path="/account/profile" element={<PrivateRoute><AccountProfile /></PrivateRoute>} />
              <Route path="/account/photos" element={<PrivateRoute><AccountPhotos /></PrivateRoute>} />
              <Route path="/account/billing" element={<PrivateRoute><AccountBilling /></PrivateRoute>} />
              <Route path="/account/security" element={<PrivateRoute><AccountSecurity /></PrivateRoute>} />
              <Route path="/account/verification" element={<PrivateRoute><AccountVerification /></PrivateRoute>} />
              <Route path="/account/messages" element={<PrivateRoute><AccountMessages /></PrivateRoute>} />
              <Route path="/account/favorites" element={<PrivateRoute><AccountFavorites /></PrivateRoute>} />
              <Route path="/account/planning/budget" element={<PrivateRoute><AccountPlanningBudget /></PrivateRoute>} />
              <Route path="/account/planning/guests" element={<PrivateRoute><AccountPlanningGuests /></PrivateRoute>} />
              <Route path="/account/planning/todo" element={<PrivateRoute><AccountPlanningTodo /></PrivateRoute>} />
              <Route path="/account/planning/seating" element={<PrivateRoute><AccountPlanningSeating /></PrivateRoute>} />
              <Route path="/account/invites" element={<PrivateRoute><AccountInvites /></PrivateRoute>} />
              <Route path="/account/collaborators" element={<PrivateRoute><AccountCollaborators /></PrivateRoute>} />
              
              {/* Supplier Routes */}
              <Route path="/supplier/signup" element={<SupplierSignup />} />
              <Route path="/suppliers/signup" element={<SupplierSignup />} />
              <Route path="/supplier/dashboard" element={<PrivateRoute><SupplierDashboard /></PrivateRoute>} />
              <Route path="/suppliers/dashboard" element={<PrivateRoute><SupplierDashboard /></PrivateRoute>} />
              
              {/* Public Routes */}
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
              
              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </OnboardingGuard>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
