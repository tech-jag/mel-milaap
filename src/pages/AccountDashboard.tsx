"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardSwitcher } from "@/components/ui/dashboard-switcher";
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
import { getPlanBadgeText, getBadgeVariant, getUserSubscription } from "@/lib/planning-helpers";
import { Helmet } from "react-helmet-async";

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

// Dashboard mode state
const [dashboardMode, setDashboardMode] = React.useState<'match' | 'planning'>('planning');

const AccountDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [userSubscription, setUserSubscription] = React.useState<any>(null);
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
      const [profile, subscription] = await Promise.all([
        getUserProfile(userId),
        getUserSubscription(userId)
      ]);
      setUserProfile(profile);
      setUserSubscription(subscription);
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
      <Helmet>
        <title>Dashboard - Mēl Milaap</title>
        <meta name="description" content="Your personal wedding planning and match dashboard" />
      </Helmet>

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
                <Badge variant={getBadgeVariant(userSubscription?.plan || 'free')}>
                  {getPlanBadgeText(userSubscription?.plan || 'free')}
                </Badge>
                <Link to="/account/profile">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Dashboard Switcher */}
            <motion.div variants={fadeInUp} className="mb-6">
              <DashboardSwitcher 
                currentMode={dashboardMode}
                onModeChange={setDashboardMode}
              />
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

      {/* Quick Actions */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
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
                        <Card className="h-full hover:shadow-lg transition-shadow">
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
                className="text-center bg-card rounded-xl p-12"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  Ready to Start Planning?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Found your perfect match? It's time to start planning your dream wedding! 
                  Access our comprehensive planning tools to organize every detail.
                </p>
                <Button size="lg" onClick={handleStartPlanning}>
                  Start Planning My Wedding
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Collaborators Section */}
            {collaborators.length > 0 && (
              <motion.div
                className="mt-12"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Family Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {collaborators.slice(0, 3).map((collab) => (
                        <div key={collab.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccountDashboard;