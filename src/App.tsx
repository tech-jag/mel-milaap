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
import { MainLayout } from "./components/layout/MainLayout";

// ... keep existing imports

// Page imports
import Home from "./pages/Home";
import ComingSoon from "./pages/ComingSoon";
import AccountCollaborators from "./pages/AccountCollaborators";
import PlanningNotes from "./pages/PlanningNotes";
import Match from "./pages/Match";
import Matches from "./pages/Matches";
import Search from "./pages/Search";
import Inbox from "./pages/Inbox";
import InboxReceived from "./pages/InboxReceived";
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
import DevOnboarding from "./pages/DevOnboarding";
import MatrimonialSecurity from "./pages/MatrimonialSecurity";

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
              {/* Routes WITH floral branding, header, and footer */}
              <Route element={<MainLayout />}>
                {/* Home Landing Page */}
                <Route path="/" element={<Home />} />
                
                {/* Early Access - Coming Soon */}
                <Route path="/early-access" element={<ComingSoon />} />
                
                {/* Public Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/help" element={<Help />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/premium-plans" element={<PremiumPlans />} />
                <Route path="/trust" element={<Trust />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/story/:id" element={<StoryDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/data-rights" element={<DataRights />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/health" element={<Health />} />
                
                {/* Target Pages */}
                <Route path="/for-parents" element={<ForParents />} />
                <Route path="/for-singles" element={<ForSingles />} />
                <Route path="/for-suppliers" element={<ForSuppliers />} />
                
                {/* Destinations */}
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/city/sydney" element={<CitySydney />} />
                <Route path="/city/melbourne" element={<CityMelbourne />} />
                <Route path="/city/auckland" element={<CityAuckland />} />
                
                {/* Suppliers */}
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/suppliers/signup" element={<SupplierSignup />} />
                <Route path="/suppliers/feature-listings" element={<SuppliersFeatureListings />} />
                <Route path="/suppliers/pricing" element={<SuppliersPricing />} />
                
                {/* Tools and Features */}
                <Route path="/tools" element={<Tools />} />
                <Route path="/planning" element={<WeddingPlanning />} />
                <Route path="/planning/public" element={<PublicPlanning />} />
                <Route path="/planning/dashboard" element={<PlanningDashboard />} />
                <Route path="/planning/timeline" element={<PlanningTimeline />} />
                <Route path="/planning/registry" element={<PlanningRegistry />} />
                <Route path="/planning/checklist" element={<PlanningChecklist />} />
                <Route path="/planning/notes" element={<PlanningNotes />} />
                
                {/* Public Profiles */}
                <Route path="/profile/:id" element={<PublicProfile />} />
                <Route path="/profile/preview" element={<ProfilePreviewPage />} />
                
                {/* Development Route */}
                <Route path="/dev-onboarding" element={<DevOnboarding />} />
                <Route path="/partner-preferences" element={
                  <PrivateRoute>
                    <PartnerPreferences />
                  </PrivateRoute>
                } />
                
                {/* Protected Routes */}
                <Route path="/match" element={
                  <PrivateRoute>
                    <Match />
                  </PrivateRoute>
                } />
                <Route path="/matches" element={
                  <PrivateRoute>
                    <Matches />
                  </PrivateRoute>
                } />
                <Route path="/search" element={
                  <PrivateRoute>
                    <Search />
                  </PrivateRoute>
                } />
                <Route path="/inbox" element={
                  <PrivateRoute>
                    <Inbox />
                  </PrivateRoute>
                } />
                <Route path="/inbox/received" element={
                  <PrivateRoute>
                    <InboxReceived />
                  </PrivateRoute>
                } />
                
                {/* Account Routes */}
                <Route path="/account" element={
                  <PrivateRoute>
                    <Account />
                  </PrivateRoute>
                } />
                
                <Route path="/account/dashboard" element={
                  <PrivateRoute>
                    <AccountDashboard />
                  </PrivateRoute>
                } />
                
                <Route path="/account/profile" element={
                  <PrivateRoute>
                    <AccountProfile />
                  </PrivateRoute>
                } />
                
                <Route path="/account/photos" element={
                  <PrivateRoute>
                    <AccountPhotos />
                  </PrivateRoute>
                } />
                
                <Route path="/account/security" element={
                  <PrivateRoute>
                    <AccountSecurity />
                  </PrivateRoute>
                } />
                
                <Route path="/account/settings" element={
                  <PrivateRoute>
                    <AccountSettings />
                  </PrivateRoute>
                } />
                
                <Route path="/account/billing" element={
                  <PrivateRoute>
                    <AccountBilling />
                  </PrivateRoute>
                } />
                
                <Route path="/account/favorites" element={
                  <PrivateRoute>
                    <AccountFavorites />
                  </PrivateRoute>
                } />
                
                <Route path="/account/messages" element={
                  <PrivateRoute>
                    <AccountMessages />
                  </PrivateRoute>
                } />
                
                <Route path="/account/verification" element={
                  <PrivateRoute>
                    <AccountVerification />
                  </PrivateRoute>
                } />
                
                <Route path="/account/collaborators" element={
                  <PrivateRoute>
                    <AccountCollaborators />
                  </PrivateRoute>
                } />
                
                <Route path="/account/invites" element={
                  <PrivateRoute>
                    <AccountInvites />
                  </PrivateRoute>
                } />
                
                <Route path="/account/guests" element={
                  <PrivateRoute>
                    <AccountGuests />
                  </PrivateRoute>
                } />
                
                {/* Account Planning Routes */}
                <Route path="/account/planning" element={
                  <PrivateRoute>
                    <AccountPlanning />
                  </PrivateRoute>
                } />
                
                <Route path="/account/planning/budget" element={
                  <PrivateRoute>
                    <AccountPlanningBudget />
                  </PrivateRoute>
                } />
                
                <Route path="/account/planning/guests" element={
                  <PrivateRoute>
                    <AccountPlanningGuests />
                  </PrivateRoute>
                } />
                
                <Route path="/account/planning/todo" element={
                  <PrivateRoute>
                    <AccountPlanningTodo />
                  </PrivateRoute>
                } />
                
                <Route path="/account/planning/seating" element={
                  <PrivateRoute>
                    <AccountPlanningSeating />
                  </PrivateRoute>
                } />
                
                {/* Supplier Dashboard */}
                <Route path="/supplier/dashboard" element={
                  <PrivateRoute>
                    <SupplierDashboard />
                  </PrivateRoute>
                } />
                
                {/* Matrimonial Security Center */}
                <Route path="/matrimonial-security" element={
                  <PrivateRoute>
                    <MatrimonialSecurity />
                  </PrivateRoute>
                } />
              </Route>

              {/* Routes WITHOUT floral branding */}
               {/* Auth Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Onboarding Routes */}
              <Route path="/onboarding" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep1 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              {/* ... keep existing onboarding routes exactly as they were ... */}
              
              {/* Numbered onboarding routes */}
              <Route path="/onboarding/1" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep1 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/2" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep2 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/3" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep3 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/4" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep4 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/5" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep5 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/6" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep6 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/7" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep7 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/8" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep8 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/9" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep9 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/10" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep10 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/11" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep11 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/12" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep12 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/13" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep13 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/14" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep14 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/15" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep15 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/16" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep16 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/17" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep17 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/18" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep18 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/19" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep19 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/20" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep20 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/21" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep21 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/22" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep22 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/23" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep23 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-1" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep1 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-2" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep2 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-3" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep3 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-4" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep4 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-5" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep5 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-6" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep6 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-7" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep7 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-8" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep8 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-9" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep9 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-10" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep10 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-11" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep11 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-12" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep12 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-13" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep13 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-14" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep14 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-15" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep15 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-16" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep16 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-17" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep17 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-18" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep18 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-19" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep19 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-20" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep20 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-21" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep21 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-22" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep22 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              <Route path="/onboarding/step-23" element={
                <PrivateRoute>
                  <OnboardingGuard>
                    <OnboardingStep23 />
                  </OnboardingGuard>
                </PrivateRoute>
              } />
              
              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
