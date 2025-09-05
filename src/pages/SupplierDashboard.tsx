"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  TrendingUp,
  Crown,
  Calendar,
  Users,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SupplierProfile {
  id: string;
  business_name: string;
  categories: string[];
  city: string;
  plan: string;
  verified: boolean;
  created_at: string;
}

interface DashboardStats {
  views: number;
  saves: number;
  inquiries: number;
  viewsChange: number;
  savesChange: number;
  inquiriesChange: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  created_at: string;
}

const SupplierDashboard = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [supplierProfile, setSupplierProfile] = React.useState<SupplierProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState<DashboardStats>({
    views: 0,
    saves: 0,
    inquiries: 0,
    viewsChange: 0,
    savesChange: 0,
    inquiriesChange: 0
  });
  const [leads, setLeads] = React.useState<Lead[]>([]);

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    await loadSupplierProfile(user.id);
  };

  const loadSupplierProfile = async (userId: string) => {
    try {
      // Load supplier profile
      const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (supplierError) throw supplierError;
      
      if (!supplier) {
        // Redirect to signup if no profile exists
        window.location.href = '/supplier/signup';
        return;
      }

      setSupplierProfile(supplier);
      
      // Load dashboard stats
      await loadStats(supplier.id);
      await loadLeads(supplier.id);
      
    } catch (error) {
      console.error('Error loading supplier data:', error);
      toast({
        title: "Error loading data",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async (supplierId: string) => {
    try {
      // Get last 30 days stats
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [viewsResult, savesResult, leadsResult] = await Promise.all([
        supabase
          .from('supplier_views')
          .select('id, created_at')
          .eq('supplier_id', supplierId)
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('favorites')
          .select('id, created_at')
          .eq('subject_id', supplierId)
          .eq('subject_type', 'supplier')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('leads')
          .select('id, created_at')
          .eq('supplier_id', supplierId)
          .gte('created_at', thirtyDaysAgo.toISOString())
      ]);

      setStats({
        views: viewsResult.data?.length || 0,
        saves: savesResult.data?.length || 0,
        inquiries: leadsResult.data?.length || 0,
        viewsChange: Math.floor(Math.random() * 20) - 10, // Mock data
        savesChange: Math.floor(Math.random() * 10) - 5,
        inquiriesChange: Math.floor(Math.random() * 5) - 2
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadLeads = async (supplierId: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const upgradeToFeatured = () => {
    toast({
      title: "Upgrade to Featured",
      description: "Stripe integration coming soon for plan upgrades.",
    });
  };

  const upgradeToPremium = () => {
    toast({
      title: "Upgrade to Premium", 
      description: "Stripe integration coming soon for plan upgrades.",
    });
  };

  if (!currentUser || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  if (!supplierProfile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="mb-4">No supplier profile found.</p>
        <Link to="/supplier/signup">
          <Button>Create Supplier Profile</Button>
        </Link>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
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
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline">
                    {supplierProfile.verified ? (
                      <>✓ Verified Supplier</>
                    ) : (
                      <>⏳ Pending Verification</>
                    )}
                  </Badge>
                  <Badge variant={supplierProfile.plan === 'premium' ? 'default' : 'secondary'}>
                    {supplierProfile.plan === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                    {supplierProfile.plan.charAt(0).toUpperCase() + supplierProfile.plan.slice(1)} Plan
                  </Badge>
                </div>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  {supplierProfile.business_name}
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  {supplierProfile.categories.join(' • ')} • {supplierProfile.city}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link to={`/suppliers/${supplierProfile.id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Profile
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* KPI Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Eye,
                  label: "Profile Views",
                  value: stats.views,
                  change: stats.viewsChange,
                  color: "text-blue-500"
                },
                {
                  icon: Heart,
                  label: "Saves/Favorites",
                  value: stats.saves,
                  change: stats.savesChange,
                  color: "text-red-500"
                },
                {
                  icon: MessageSquare,
                  label: "Inquiries",
                  value: stats.inquiries,
                  change: stats.inquiriesChange,
                  color: "text-green-500"
                }
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="luxury-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        <div className={`text-sm flex items-center ${
                          stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {stat.change >= 0 ? '+' : ''}{stat.change}%
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Analytics Chart Placeholder */}
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle>Performance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          Analytics chart coming soon
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Track views, saves, and inquiries over time
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Plan & Billing */}
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle>Plan & Billing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Current Plan</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {supplierProfile.plan} Plan
                        </p>
                      </div>
                      <Badge variant={supplierProfile.plan === 'premium' ? 'default' : 'secondary'}>
                        {supplierProfile.plan === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                        {supplierProfile.plan.charAt(0).toUpperCase() + supplierProfile.plan.slice(1)}
                      </Badge>
                    </div>
                    
                    {supplierProfile.plan === 'free' && (
                      <div className="space-y-3">
                        <Button onClick={upgradeToFeatured} className="w-full">
                          Upgrade to Featured - AUD $149/month
                        </Button>
                        <Button onClick={upgradeToPremium} variant="outline" className="w-full">
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium - AUD $299/month
                        </Button>
                      </div>
                    )}
                    
                    {supplierProfile.plan === 'featured' && (
                      <Button onClick={upgradeToPremium} className="w-full">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Premium - AUD $299/month
                      </Button>
                    )}
                    
                    {supplierProfile.plan === 'premium' && (
                      <div className="text-center py-4">
                        <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          You're on our highest tier! 
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

            </div>

            {/* Recent Leads */}
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle>Recent Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads.length > 0 ? (
                      leads.map((lead) => (
                        <div key={lead.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-foreground">{lead.name}</h4>
                              <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                                {lead.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </div>
                              {lead.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </div>
                              )}
                              <p className="mt-2">{lead.message}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </p>
                            <Button size="sm" className="mt-2">
                              Reply
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No inquiries yet.</p>
                        <p className="text-sm mt-1">
                          Inquiries from couples will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupplierDashboard;