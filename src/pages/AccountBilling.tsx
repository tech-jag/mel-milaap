"use client";

import * as React from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountHeader } from "@/components/ui/account-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CreditCard, 
  Crown, 
  Calendar,
  Download,
  Eye,
  Plus,
  CheckCircle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AccountBilling() {
  const { toast } = useToast();
  const [user, setUser] = React.useState<any>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [billingHistory, setBillingHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    checkUserAndLoadData();
  }, []);

  const checkUserAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUser(user);
      
      // Load user profile for subscription info
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setUserProfile(profile);
      
      // Mock billing history - replace with real data
      setBillingHistory([
        {
          id: 1,
          date: '2024-01-15',
          amount: '$9.99',
          status: 'paid',
          description: 'Premium Plan - Monthly'
        },
        {
          id: 2,
          date: '2023-12-15',
          amount: '$9.99',
          status: 'paid',
          description: 'Premium Plan - Monthly'
        }
      ]);
      
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionInfo = () => {
    const tier = userProfile?.subscription_tier;
    if (!tier || tier === 'free') {
      return {
        name: 'Free Plan',
        price: '$0/month',
        badge: 'FREE',
        badgeVariant: 'secondary' as const,
        description: 'Basic features included',
        showUpgrade: true
      };
    } else if (tier === 'premium') {
      return {
        name: 'Premium Plan',
        price: '$9.99/month',
        badge: 'PREMIUM',
        badgeVariant: 'default' as const,
        description: 'All premium features unlocked',
        showUpgrade: false
      };
    } else if (tier === 'gold') {
      return {
        name: 'Gold Plan',
        price: '$19.99/month',
        badge: 'GOLD',
        badgeVariant: 'default' as const,
        description: 'All features + priority support',
        showUpgrade: false
      };
    }
    return {
      name: 'Free Plan',
      price: '$0/month',
      badge: 'FREE',
      badgeVariant: 'secondary' as const,
      description: 'Basic features included',
      showUpgrade: true
    };
  };

  const handleUpgrade = () => {
    toast({
      title: "Redirecting to Pricing",
      description: "Taking you to our pricing page to upgrade your plan.",
    });
    // Navigate to pricing page
  };

  const handleAddPaymentMethod = () => {
    toast({
      title: "Add Payment Method",
      description: "Payment method setup coming soon.",
    });
  };

  const downloadInvoice = (invoiceId: string) => {
    toast({
      title: "Downloading Invoice",
      description: "Your invoice download will begin shortly.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm lg:text-base">Loading billing information...</p>
        </div>
      </div>
    );
  }

  const subscriptionInfo = getSubscriptionInfo();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          {/* Account Header */}
          <AccountHeader
            title="Billing"
            description="Manage your subscription and billing"
            icon={CreditCard}
          />
          
          {/* Main Content */}
          <div className="container mx-auto px-4 lg:px-8 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 lg:space-y-8">
                
                {/* Current Plan */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <Card className="luxury-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Crown className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-primary" />
                        Current Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <Badge variant={subscriptionInfo.badgeVariant} className="mb-2 text-xs">
                            {subscriptionInfo.badge}
                          </Badge>
                          <h3 className="text-lg lg:text-xl font-medium mb-1">{subscriptionInfo.name}</h3>
                          <p className="text-sm lg:text-base text-muted-foreground mb-2">
                            {subscriptionInfo.description}
                          </p>
                          <p className="text-lg lg:text-xl font-semibold text-primary">
                            {subscriptionInfo.price}
                          </p>
                        </div>
                        {subscriptionInfo.showUpgrade && (
                          <Button 
                            onClick={handleUpgrade}
                            className="w-full sm:w-auto lg:max-w-xs text-sm lg:text-base"
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade to Premium
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment Methods */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <Card className="luxury-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-primary" />
                        Payment Methods
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-6 lg:py-8">
                        <CreditCard className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground mx-auto mb-3 lg:mb-4" />
                        <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
                          No payment methods added
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={handleAddPaymentMethod}
                          className="w-full sm:w-auto text-sm lg:text-base"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Payment Method
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Billing History */}
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <Card className="luxury-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Calendar className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-primary" />
                        Billing History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {billingHistory.length === 0 ? (
                        <div className="text-center py-6 lg:py-8">
                          <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground mx-auto mb-3 lg:mb-4" />
                          <p className="text-sm lg:text-base text-muted-foreground">
                            No billing history available
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 lg:space-y-4">
                          {billingHistory.map((invoice) => (
                            <div
                              key={invoice.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3 sm:space-y-0"
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm lg:text-base">{invoice.description}</p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <p className="text-xs lg:text-sm text-muted-foreground">{invoice.date}</p>
                                    <Badge 
                                      variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {invoice.status === 'paid' ? (
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                      ) : (
                                        <Clock className="w-3 h-3 mr-1" />
                                      )}
                                      {invoice.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between sm:justify-end space-x-3 flex-shrink-0">
                                <span className="font-semibold text-sm lg:text-base">{invoice.amount}</span>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => downloadInvoice(invoice.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Subscription Management */}
                {!subscriptionInfo.showUpgrade && (
                  <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                  >
                    <Card className="luxury-card">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg lg:text-xl">Subscription Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm lg:text-base">Next Billing Date</h4>
                              <p className="text-xs lg:text-sm text-muted-foreground">
                                February 15, 2024
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs self-start sm:self-center">
                              Auto-renewal enabled
                            </Badge>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button variant="outline" className="text-sm lg:text-base">
                                Change Plan
                              </Button>
                              <Button variant="outline" className="text-destructive text-sm lg:text-base">
                                Cancel Subscription
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}