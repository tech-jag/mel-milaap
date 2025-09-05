import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Match from "./pages/Match";
import Suppliers from "./pages/Suppliers";
import Planning from "./pages/Planning";
import Stories from "./pages/Stories";
import Premium from "./pages/Premium";
import Pricing from "./pages/Pricing";
import Trust from "./pages/Trust";
import Verification from "./pages/Verification";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";
import Auth from "./pages/Auth";
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
import SupplierSignup from "./pages/SupplierSignup";
import SupplierDashboard from "./pages/SupplierDashboard";
import CitySydney from "./pages/CitySydney";
import CityMelbourne from "./pages/CityMelbourne";
import CityAuckland from "./pages/CityAuckland";
import Health from "./pages/Health";
import NotFound from "./pages/NotFound";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/match" element={<Match />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/auth/login" element={<Auth />} />
          <Route path="/auth/signup" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/profile" element={<AccountProfile />} />
          <Route path="/account/photos" element={<AccountPhotos />} />
          <Route path="/account/billing" element={<AccountBilling />} />
          <Route path="/account/security" element={<AccountSecurity />} />
          <Route path="/account/verification" element={<Verification />} />
          <Route path="/account/favorites" element={<AccountFavorites />} />
          <Route path="/account/planning/budget" element={<AccountPlanningBudget />} />
          <Route path="/account/planning/guests" element={<AccountPlanningGuests />} />
          <Route path="/account/planning/todo" element={<AccountPlanningTodo />} />
          <Route path="/account/planning/seating" element={<AccountPlanningSeating />} />
          <Route path="/account/invites" element={<AccountInvites />} />
          <Route path="/supplier/signup" element={<SupplierSignup />} />
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
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
          <Route path="/help" element={<Help />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/suppliers/featured" element={<SuppliersFeatureListings />} />
          <Route path="/suppliers/pricing" element={<SuppliersPricing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
