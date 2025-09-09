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
          <section className="py-16 bg-gradient-hero">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                className="max-w-6xl mx-auto"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={fadeInUp} className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="mb-4">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Messaging Center
                    </Badge>
                    <h1 className="text-luxury-xl text-foreground mb-4">
                      Messages
                    </h1>
                    <p className="text-body-lg text-muted-foreground">
                      Connect and communicate with your matches.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

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