"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Users, 
  DollarSign,
  CheckSquare,
  Gift,
  Heart,
  Settings,
  Bell,
  Star,
  MessageCircle,
  BookOpen,
  Plus,
  ArrowRight,
  Shield,
  Camera,
  UserPlus,
  Crown
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  getBudget, 
  getGuests, 
  getTimelineItems, 
  getGiftRegistries, 
  getUserProfile, 
  updateUserPlanningPhase,
  getCollaborators,
  calculatePlanningProgress
} from "@/lib/planning";

interface DashboardStats {
  budget: {
    totalItems: number;
    totalPlanned: number;
    totalActual: number;
    progress: number;
  };
  guests: {
    total: number;
    confirmed: number;
    progress: number;
  };
  timeline: {
    total: number;
    completed: number;
    progress: number;
  };
  registry: {
    total: number;
    progress: number;
  };
  overall: number;
}

// Helper functions for plan badge mapping
const getPlanBadgeText = (tier: string) => {
  switch (tier) {
    case 'member_99':
      return 'Premium';
    case 'member_49': 
      return 'Member';
    case 'free':
    default:
      return 'Free';
  }
};

const getBadgeVariant = (tier: string) => {
  switch (tier) {
    case 'member_99':
      return 'default';
    case 'member_49':
      return 'secondary'; 
    case 'free':
    default:
      return 'outline';
  }
};

const AccountDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [stats, setStats] = React.useState<DashboardStats>({
    budget: { totalItems: 0, totalPlanned: 0, totalActual: 0, progress: 0 },
    guests: { total: 0, confirmed: 0, progress: 0 },
    timeline: { total: 0, completed: 0, progress: 0 },
    registry: { total: 0, progress: 0 },
    overall: 0
  });
  const [collaborators, setCollaborators] = React.useState<any[]>([]);

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
    await Promise.all([
      loadUserProfile(user.id),
      loadDashboardData(user.id),
      loadCollaborators(user.id)
    ]);
    setIsLoading(false);
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadDashboardData = async (userId: string) => {
    try {
      const [budgetData, guestsData, timelineData, registryData] = await Promise.all([
        getBudget(userId),
        getGuests(userId),
        getTimelineItems(userId),
        getGiftRegistries(userId)
      ]);

      const budgetStats = {
        totalItems: Array.isArray(budgetData.budget_items) ? budgetData.budget_items.length : 0,
        totalPlanned: Array.isArray(budgetData.budget_items) ? budgetData.budget_items.reduce((sum, item) => sum + (item.planned_amount || 0), 0) : 0,
        totalActual: Array.isArray(budgetData.budget_items) ? budgetData.budget_items.reduce((sum, item) => sum + (item.actual_amount || 0), 0) : 0,
        progress: 0
      };
      budgetStats.progress = budgetStats.totalPlanned > 0 ? (budgetStats.totalActual / budgetStats.totalPlanned) * 100 : 0;

      const guestsStats = {
        total: guestsData.length,
        confirmed: guestsData.filter(g => g.rsvp_status === 'yes').length,
        progress: guestsData.length > 0 ? (guestsData.filter(g => g.rsvp_status === 'yes').length / guestsData.length) * 100 : 0
      };

      const timelineStats = {
        total: timelineData.length,
        completed: timelineData.filter(t => t.status === 'done').length,
        progress: timelineData.length > 0 ? (timelineData.filter(t => t.status === 'done').length / timelineData.length) * 100 : 0
      };

      const registryStats = {
        total: registryData.length,
        progress: registryData.length > 0 ? 50 : 0
      };

      const overall = calculatePlanningProgress({
        budgetItems: budgetStats.totalItems,
        guests: guestsStats.total,
        timelineCompleted: timelineStats.completed,
        timelineTotal: timelineStats.total,
        registryItems: registryStats.total
      });

      setStats({
        budget: budgetStats,
        guests: guestsStats,
        timeline: timelineStats,
        registry: registryStats,
        overall
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Show empty states instead of error toasts for better UX
      setStats({
        budget: { totalItems: 0, totalPlanned: 0, totalActual: 0, progress: 0 },
        guests: { total: 0, confirmed: 0, progress: 0 },
        timeline: { total: 0, completed: 0, progress: 0 },
        registry: { total: 0, progress: 0 },
        overall: 0
      });
    }
  };

  const loadCollaborators = async (userId: string) => {
    try {
      const collaboratorsData = await getCollaborators(userId);
      setCollaborators(collaboratorsData);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  };

  const handleStartPlanning = async () => {
    if (!currentUser) return;

    try {
      await updateUserPlanningPhase(currentUser.id, 'planning');
      setUserProfile(prev => ({ ...prev, planning_phase: 'planning' }));
      
      toast({
        title: "Welcome to Planning!",
        description: "Your planning tools are now activated. Let's create your perfect wedding!",
      });

      navigate('/planning');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const quickActions = [
    { 
      title: "Complete Profile", 
      description: "Add photos and details", 
      href: "/account/profile", 
      icon: Camera,
      urgent: !userProfile?.subscription_tier || userProfile?.subscription_tier === 'free'
    },
    { 
      title: "Verify Account", 
      description: "Get verified status", 
      href: "/account/verification", 
      icon: Shield,
      urgent: true
    },
    { 
      title: "Invite Family", 
      description: "Add parents or siblings", 
      href: "/account/collaborators", 
      icon: UserPlus,
      urgent: false
    },
    { 
      title: "Upgrade Plan", 
      description: "Unlock premium features", 
      href: "/pricing", 
      icon: Crown,
      urgent: userProfile?.subscription_tier === 'free'
    }
  ];

  const planningCards = [
    {
      title: 'Budget Tracker',
      description: 'Manage wedding expenses',
      icon: DollarSign,
      href: '/planning/budget',
      progress: stats.budget.progress,
      details: `${stats.budget.totalItems} categories • $${stats.budget.totalActual.toLocaleString()} spent`,
      color: 'text-green-500'
    },
    {
      title: 'Guest List',
      description: 'Track RSVPs and invites',
      icon: Users,
      href: '/planning/guests',
      progress: stats.guests.progress,
      details: `${stats.guests.total} guests • ${stats.guests.confirmed} confirmed`,
      color: 'text-blue-500'
    },
    {
      title: 'Timeline',
      description: 'Wedding planning tasks',
      icon: Calendar,
      href: '/planning/timeline',
      progress: stats.timeline.progress,
      details: `${stats.timeline.completed}/${stats.timeline.total} tasks completed`,
      color: 'text-purple-500'
    },
    {
      title: 'Gift Registry',
      description: 'Share your wish list',
      icon: Gift,
      href: '/planning/registry',
      progress: stats.registry.progress,
      details: `${stats.registry.total} items added`,
      color: 'text-pink-500'
    }
  ];

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
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
                      const profileUrl = `${window.location.origin}/profile/${profileId}`;
                      navigator.clipboard.writeText(profileUrl);
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
                  {userProfile?.planning_phase === 'discover' 
                    ? "Ready to find your perfect match?"
                    : userProfile?.planning_phase === 'planning'
                    ? "Let's plan your dream wedding"
                    : "Celebrating your journey together"
                  }
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

            {/* Overall Progress */}
            {userProfile?.planning_phase === 'planning' && (
              <motion.div variants={fadeInUp}>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Wedding Planning Progress</h3>
                      <span className="text-2xl font-bold text-primary">{stats.overall}%</span>
                    </div>
                    <Progress value={stats.overall} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Keep going! You're making great progress on your wedding plans.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Activity Summary & Quick Actions */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Activity Summary */}
            <motion.div
              className="mb-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Activity Stats */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-card rounded-2xl shadow-elegant -rotate-1"></div>
                  <div className="relative bg-card rounded-2xl border shadow-soft p-6">
                    <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">Your Activity Summary</h2>
                    
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl border border-secondary/30">
                        <div className="text-3xl font-bold text-muted-foreground mb-2">0</div>
                        <div className="text-sm text-muted-foreground">Pending Invitations</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl border border-accent/30">
                        <div className="text-3xl font-bold text-muted-foreground mb-2">0</div>
                        <div className="text-sm text-muted-foreground">Accepted Invitations</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-success/20 to-success/10 rounded-xl border border-success/30">
                        <div className="text-3xl font-bold text-muted-foreground mb-2">0</div>
                        <div className="text-sm text-muted-foreground">Recent Visitors</div>
                      </div>
                    </div>
                    
                    {/* Premium Notice */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-6 shadow-soft">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="text-sm font-medium text-orange-800">
                          Only <span className="text-primary font-semibold">Premium</span> Members can avail these benefits
                        </div>
                      </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
                        <MessageCircle className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                        <div className="text-2xl font-bold text-purple-700 mb-1">0</div>
                        <div className="text-sm text-purple-600">Contacts Viewed</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200 shadow-sm">
                        <MessageCircle className="w-10 h-10 mx-auto mb-3 text-pink-600" />
                        <div className="text-2xl font-bold text-pink-700 mb-1">0</div>
                        <div className="text-sm text-pink-600">Chats Initiated</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Profile Improvement */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-champagne rounded-2xl shadow-champagne rotate-1"></div>
                  <div className="relative bg-card rounded-2xl border shadow-soft p-6 h-full">
                    <h3 className="text-2xl font-heading font-semibold mb-6">Improve your Profile</h3>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-soft">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2 text-lg">Members with Photos</h4>
                          <p className="text-green-700 mb-4">get twice as many responses</p>
                        </div>
                        <Camera className="w-8 h-8 text-green-600 flex-shrink-0" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-green-600 font-semibold">Get more responses</div>
                        <Link to="/account/profile">
                          <Button 
                            className="bg-white text-green-600 border-green-600 hover:bg-green-50 shadow-sm"
                            variant="outline"
                          >
                            Add Photo
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Additional CTA */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-accent/20 rounded-xl border border-accent/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-accent-foreground">Complete Your Journey</div>
                          <div className="text-sm text-muted-foreground">Unlock premium features</div>
                        </div>
                        <Link to="/pricing">
                          <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
                            Upgrade Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="mb-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">Quick Actions</h2>
              <p className="text-muted-foreground">Complete these tasks to optimize your experience</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {quickActions.map((action) => (
                <motion.div key={action.title} variants={fadeInUp}>
                  <Link to={action.href}>
                    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${action.urgent ? 'ring-2 ring-orange-200' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${action.urgent ? 'bg-orange-100' : 'bg-primary/10'}`}>
                            <action.icon className={`w-5 h-5 ${action.urgent ? 'text-orange-600' : 'text-primary'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{action.title}</h3>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Collaborators Section */}
            {collaborators.length > 0 && (
              <motion.div
                className="mb-12"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Family Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {collaborators.slice(0, 3).map((collab) => (
                        <div key={collab.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                          <div>
                            <p className="font-medium">{collab.invitee_email}</p>
                            <p className="text-sm text-muted-foreground capitalize">{collab.role} • {collab.status}</p>
                          </div>
                          <Badge variant={collab.status === 'accepted' ? 'default' : 'secondary'}>
                            {collab.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Link to="/account/collaborators" className="block mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Collaborators
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Planning Tools or Discover Mode */}
            {userProfile?.planning_phase === 'planning' ? (
              <motion.div
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp} className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">Planning Tools</h2>
                      <p className="text-muted-foreground">Manage every aspect of your wedding</p>
                    </div>
                    <Link to="/planning">
                      <Button variant="outline">
                        View All Tools
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={staggerChildren}
                >
                  {planningCards.map((card) => (
                    <motion.div key={card.title} variants={fadeInUp}>
                      <Link to={card.href}>
                        <Card className="h-full hover:shadow-luxury transition-shadow duration-300">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <card.icon className={`w-8 h-8 ${card.color}`} />
                              <span className="text-sm font-medium">{Math.round(card.progress)}%</span>
                            </div>
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                            <p className="text-muted-foreground text-sm">{card.description}</p>
                          </CardHeader>
                          <CardContent>
                            <Progress value={card.progress} className="h-2 mb-3" />
                            <p className="text-xs text-muted-foreground">{card.details}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="text-center bg-gradient-card rounded-2xl p-12 shadow-luxury border"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-2xl"></div>
                  <Heart className="w-20 h-20 text-primary mx-auto mb-6 relative z-10" />
                  <h3 className="text-3xl font-heading font-semibold text-foreground mb-4 relative z-10">
                    Ready to Start Planning?
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto relative z-10">
                    Found your perfect match? It's time to start planning your dream wedding! 
                    Access our comprehensive planning tools to organize every detail.
                  </p>
                  <Button size="lg" onClick={handleStartPlanning} className="relative z-10 shadow-elegant">
                    Start Planning My Wedding
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccountDashboard;