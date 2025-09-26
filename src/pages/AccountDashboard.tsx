"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings } from "lucide-react";
import { FloralBranding } from "@/components/ui/FloralBranding";
import { MatrimonialDashboard } from "@/components/MatrimonialDashboard";

const AccountDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    setCurrentUser(user);
    await loadUserProfile(user.id);
    setIsLoading(false);
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const getPlanBadgeText = (tier: string) => {
    switch (tier) {
      case 'member_99': return 'Premium';
      case 'member_49': return 'Member';
      case 'free':
      default: return 'Free';
    }
  };

  const getBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'member_99': return 'default';
      case 'member_49': return 'secondary'; 
      case 'free':
      default: return 'outline';
    }
  };

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <FloralBranding variant="account" />
      
      {/* Header */}
      <section className="py-8 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-6xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                  Welcome back, {currentUser.user_metadata?.name || 'Beautiful Soul'}!
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary" className="text-sm font-mono">
                    ID: {userProfile?.profile_id || 'Not Set'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const profileId = userProfile?.profile_id;
                      if (!profileId) {
                        toast({
                          title: "Profile ID not set",
                          description: "Please complete your profile first.",
                          variant: "destructive"
                        });
                        return;
                      }
                      window.open(`/profile/${profileId}`, '_blank');
                      navigator.clipboard.writeText(`${window.location.origin}/profile/${profileId}`);
                      toast({
                        title: "Profile link copied!",
                        description: "Share this link with potential matches."
                      });
                    }}
                  >
                    Share Profile
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Ready to find your perfect match?
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getBadgeVariant(userProfile?.subscription_tier)}>
                  {getPlanBadgeText(userProfile?.subscription_tier)}
                </Badge>
                <Link to="/account/profile">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Matrimonial Dashboard */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <MatrimonialDashboard />
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountDashboard;