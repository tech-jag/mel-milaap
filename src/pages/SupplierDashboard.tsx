"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign,
  Users, 
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Star,
  Eye,
  MessageCircle,
  Award,
  Settings,
  Plus,
  Filter,
  Download,
  ExternalLink,
  Crown,
  Heart,
  MessageSquare,
  Edit,
  BarChart3,
  FileText,
  Globe
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSupplierLeads } from "@/lib/planning";
import { Helmet } from "react-helmet-async";

interface SupplierProfile {
  id: string;
  business_name: string;
  categories: string[];
  city: string;
  plan: string;
  verified: boolean;
  created_at: string;
  description?: string;
  website?: string;
  rating?: number;
}

interface DashboardStats {
  views: number;
  inquiries: number;
  leads: number;
  rating: number;
  monthlyGrowth: number;
}

interface Lead {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  event_date?: string;
  budget_range?: string;
  message?: string;
  status: string;
  created_at: string;
}

const SupplierDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [supplierProfile, setSupplierProfile] = React.useState<SupplierProfile | null>(null);
  const [stats, setStats] = React.useState<DashboardStats>({
    views: 0,
    inquiries: 0,
    leads: 0,
    rating: 0,
    monthlyGrowth: 0
  });
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [activeTab, setActiveTab] = React.useState('overview');

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }
      
      setCurrentUser(user);
      await loadSupplierData(user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        title: "Authentication Error",
        description: "Please sign in to continue.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSupplierData = async (userId: string) => {
    try {
      // Load supplier profile
      const { data: supplier, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!supplier) {
        // Redirect to signup if no supplier profile exists
        navigate('/suppliers/signup');
        return;
      }

      setSupplierProfile(supplier);

      // Load leads data
      const leadsData = await getSupplierLeads(supplier.id);
      setLeads(leadsData);

      // Calculate stats (mock data for now)
      const mockStats = {
        views: Math.floor(Math.random() * 500) + 100,
        inquiries: leadsData.length,
        leads: leadsData.filter(lead => lead.status === 'new').length,
        rating: supplier.rating || 4.5,
        monthlyGrowth: Math.floor(Math.random() * 30) + 5
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading supplier data:', error);
      setSupplierProfile(null);
      setStats({
        views: 0,
        inquiries: 0,
        leads: 0,
        rating: 0,
        monthlyGrowth: 0
      });
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('supplier_leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Lead Updated",
        description: "Lead status has been updated successfully.",
      });

      // Reload leads
      if (supplierProfile) {
        const leadsData = await getSupplierLeads(supplierProfile.id);
        setLeads(leadsData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead status.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'contacted':
        return 'secondary';
      case 'quoted':
        return 'outline';
      case 'booked':
        return 'success';
      case 'lost':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'premium':
        return { variant: 'default', label: 'Premium', icon: Crown };
      case 'featured':
        return { variant: 'secondary', label: 'Featured', icon: Star };
      default:
        return { variant: 'outline', label: 'Free', icon: Heart };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!supplierProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Supplier Profile Found</h2>
          <p className="text-muted-foreground mb-6">
            You need to create a supplier profile to access the dashboard.
          </p>
          <Link to="/suppliers/signup">
            <Button>Create Supplier Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  const planBadge = getPlanBadge(supplierProfile.plan);
  const PlanIcon = planBadge.icon;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Supplier Dashboard - Mēl Milaap</title>
        <meta name="description" content="Manage your supplier business and track leads on Mēl Milaap" />
      </Helmet>

      <Navigation />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Supplier Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                  <p className="text-muted-foreground">{supplierProfile.business_name}</p>
                  <Badge variant={planBadge.variant as any} className="flex items-center space-x-1">
                    <PlanIcon className="w-3 h-3" />
                    <span>{planBadge.label}</span>
                  </Badge>
                  {supplierProfile.verified && (
                    <Badge variant="default" className="flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>Verified</span>
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link to={`/suppliers/${supplierProfile.id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Page
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/suppliers/profile/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">{stats.views}</h3>
                  <p className="text-xs text-muted-foreground">Profile Views</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">{stats.inquiries}</h3>
                  <p className="text-xs text-muted-foreground">Total Inquiries</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">{stats.rating.toFixed(1)}</h3>
                  <p className="text-xs text-muted-foreground">Average Rating</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">{stats.leads}</h3>
                  <p className="text-xs text-muted-foreground">New Leads</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">+{stats.monthlyGrowth}%</h3>
                  <p className="text-xs text-muted-foreground">Monthly Growth</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden md:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="leads" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline">Leads</span>
                </TabsTrigger>
                <TabsTrigger value="listings" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span className="hidden md:inline">Listings</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden md:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden md:inline">Billing</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leads.slice(0, 3).map((lead) => (
                          <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{lead.customer_name}</h4>
                              <p className="text-sm text-muted-foreground">{lead.customer_email}</p>
                              {lead.event_date && (
                                <p className="text-xs text-muted-foreground">
                                  Event: {new Date(lead.event_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Badge variant={getStatusColor(lead.status) as any}>
                              {lead.status}
                            </Badge>
                          </div>
                        ))}
                        
                        {leads.length === 0 && (
                          <div className="text-center py-8">
                            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No recent activity</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Leads Tab */}
              <TabsContent value="leads" className="space-y-6">
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Customer Leads ({leads.length})</CardTitle>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leads.map((lead) => (
                          <div key={lead.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-lg">{lead.customer_name}</h4>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <Mail className="w-3 h-3" />
                                    <span>{lead.customer_email}</span>
                                  </div>
                                  {lead.customer_phone && (
                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                      <Phone className="w-3 h-3" />
                                      <span>{lead.customer_phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className="px-3 py-1 border rounded-md text-sm"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="quoted">Quoted</option>
                                <option value="booked">Booked</option>
                                <option value="lost">Lost</option>
                              </select>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {lead.event_date && (
                                <div>
                                  <span className="font-medium">Event Date:</span>
                                  <p className="text-muted-foreground">
                                    {new Date(lead.event_date).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {lead.budget_range && (
                                <div>
                                  <span className="font-medium">Budget:</span>
                                  <p className="text-muted-foreground">{lead.budget_range}</p>
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Received:</span>
                                <p className="text-muted-foreground">
                                  {new Date(lead.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            {lead.message && (
                              <div className="mt-4">
                                <span className="font-medium">Message:</span>
                                <p className="text-muted-foreground mt-1">{lead.message}</p>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {leads.length === 0 && (
                          <div className="text-center py-12">
                            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No leads yet</h3>
                            <p className="text-muted-foreground">
                              Customer inquiries will appear here when they contact you
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Listings Tab */}
              <TabsContent value="listings" className="space-y-6">
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Manage Your Listings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Listing Management</h3>
                        <p className="text-muted-foreground mb-6">
                          Edit your public listing content, photos, and services
                        </p>
                        <Button>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Listing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                        <p className="text-muted-foreground">
                          Detailed performance metrics coming soon
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing & Subscription</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">Current Plan: {planBadge.label}</h3>
                              <p className="text-muted-foreground">
                                {supplierProfile.plan === 'free' 
                                  ? 'Basic features included'
                                  : 'Premium features unlocked'
                                }
                              </p>
                            </div>
                            {supplierProfile.plan === 'free' && (
                              <Button>
                                <Crown className="w-4 h-4 mr-2" />
                                Upgrade Plan
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Profile Views:</span>
                              <p className="text-muted-foreground">
                                {supplierProfile.plan === 'free' ? 'Limited' : 'Unlimited'}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Lead Management:</span>
                              <p className="text-muted-foreground">
                                {supplierProfile.plan === 'free' ? 'Basic' : 'Advanced'}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Analytics:</span>
                              <p className="text-muted-foreground">
                                {supplierProfile.plan === 'free' ? 'Basic' : 'Detailed'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SupplierDashboard;