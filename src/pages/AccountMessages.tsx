"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { supabase } from "@/integrations/supabase/client";
import MessagingCenter from "@/components/MessagingCenter";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AccountMessages = () => {
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    setIsLoading(false);
  };

  if (!currentUser || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          {/* Header */}
          <div className="bg-background border-b">
            <div className="container mx-auto px-4 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                  <p className="text-muted-foreground">Connect and communicate with your matches</p>
                </div>
                <Link to="/account">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Messaging Interface */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <MessagingCenter />
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AccountMessages;