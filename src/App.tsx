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
import AccountFavorites from "./pages/AccountFavorites";
import AccountPlanningBudget from "./pages/AccountPlanningBudget";
import AccountPlanningGuests from "./pages/AccountPlanningGuests";
import AccountPlanningTodo from "./pages/AccountPlanningTodo";
import AccountPlanningSeating from "./pages/AccountPlanningSeating";
import AccountInvites from "./pages/AccountInvites";
import Health from "./pages/Health";
import NotFound from "./pages/NotFound";

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
          <Route path="/account/security" element={<AccountSecurity />} />
          <Route path="/account/favorites" element={<AccountFavorites />} />
          <Route path="/account/planning/budget" element={<AccountPlanningBudget />} />
          <Route path="/account/planning/guests" element={<AccountPlanningGuests />} />
          <Route path="/account/planning/todo" element={<AccountPlanningTodo />} />
          <Route path="/account/planning/seating" element={<AccountPlanningSeating />} />
          <Route path="/account/invites" element={<AccountInvites />} />
          <Route path="/health" element={<Health />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
