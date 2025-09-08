"use client";

import React from "react";
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
  BookOpen,
  ArrowRight,
  Clock,
  Settings,
  Crown,
  Shield,
  UserPlus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getBudget, getGuests, getTimelineItems, getGiftRegistries, getUserProfile, updateUserPlanningPhase } from "@/lib/planning";

interface PlanningStats {
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
}

const AccountPlanning = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [stats, setStats] = React.useState<PlanningStats>({
    budget: { totalItems: 0, totalPlanned: 0, totalActual: 0, progress: 0 },
    guests: { total: 0, confirmed: 0, progress: 0 },
    timeline: { total: 0, completed: 0, progress: 0 },
    registry: { total: 0, progress: 0 }
  });
  const [planningPhase, setPlanningPhase] = React.useState<string>('discover');
  const [subscriptionTier, setSubscriptionTier] = React.useState<string>('free');

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login?returnTo=/account/planning');
      return;
    }
    
    setCurrentUser(user);
    await loadPlanningData(user.id);
  };

  const loadPlanningData = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // Load user profile info
      const profile = await getUserProfile(userId);
      setPlanningPhase(profile.planning_phase || 'discover');
      setSubscriptionTier(profile.subscription_tier || 'free');

      // Load all planning data in parallel
      const [budgetData, guestsData, timelineData, registryData] = await Promise.all([
        getBudget(userId),
        getGuests(userId),
        getTimelineItems(userId),
        getGiftRegistries(userId)
      ]);

      // Calculate statistics
      const budgetStats = {
        totalItems: budgetData.budget_items?.length || 0,
        totalPlanned: budgetData.budget_items?.reduce((sum, item) => sum + (item.planned_amount || 0), 0) || 0,
        totalActual: budgetData.budget_items?.reduce((sum, item) => sum + (item.actual_amount || 0), 0) || 0,
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
        progress: registryData.length > 0 ? 50 : 0 // Simplified progress calculation
      };

      setStats({
        budget: budgetStats,
        guests: guestsStats,
        timeline: timelineStats,
        registry: registryStats
      });
    } catch (error) {
      console.error('Error loading planning data:', error);
      // Show empty states instead of error toasts for better UX
      setStats({
        budget: { totalItems: 0, totalPlanned: 0, totalActual: 0, progress: 0 },
        guests: { total: 0, confirmed: 0, progress: 0 },
        timeline: { total: 0, completed: 0, progress: 0 },
        registry: { total: 0, progress: 0 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPlanning = async () => {
    if (!currentUser) return;

    try {
      await updateUserPlanningPhase(currentUser.id, 'planning');
      setPlanningPhase('planning');
      
      toast({
        title: "Welcome to Planning!",
        description: "Your planning tools are now activated. Let's create your perfect wedding!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const planningCards = [
    {
      id: 'budget',
      title: 'Budget Tracker',
      description: 'Manage your wedding budget and expenses',
      icon: DollarSign,
      href: '/account/planning/budget',
      progress: stats.budget.progress,
      details: `${stats.budget.totalItems} categories • $${stats.budget.totalActual.toLocaleString()} spent`,
      premium: false
    },
    {
      id: 'guests',
      title: 'Guest List',
      description: 'Organize guests and track RSVPs',
      icon: Users,
      href: '/account/planning/guests',
      progress: stats.guests.progress,
      details: `${stats.guests.total} guests • ${stats.guests.confirmed} confirmed`,
      premium: false
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Stay on track with wedding milestones',
      icon: Calendar,
      href: '/planning/timeline',
      progress: stats.timeline.progress,
      details: `${stats.timeline.completed}/${stats.timeline.total} tasks completed`,
      premium: subscriptionTier === 'free'
    },
    {
      id: 'registry',
      title: 'Gift Registry',
      description: 'Share your wish list with guests',
      icon: Gift,
      href: '/planning/registry',
      progress: stats.registry.progress,
      details: `${stats.registry.total} items added`,
      premium: subscriptionTier === 'free'
    },
    {
      id: 'checklist',
      title: 'Wedding Checklist',
      description: 'Complete essential wedding tasks',
      icon: CheckSquare,
      href: '/account/planning/todo',
      progress: 0,
      details: 'Interactive wedding planning checklist',
      premium: false
    },
    {
      id: 'notes',
      title: 'Planning Notes',
      description: 'Save ideas, inspiration, and notes',
      icon: BookOpen,
      href: '/planning/notes',
      progress: 0,
      details: 'Digital scrapbook for your ideas',
      premium: false
    }
  ];

  const quickActions = [
    {
      title: 'Invite Family Members',
      description: 'Give family access to help plan',
      icon: UserPlus,
      href: '/account/invites',
      variant: 'outline' as const
    },
    {
      title: 'Verify Your Account',
      description: 'Get verified badge & premium features',
      icon: Shield,
      href: '/account/verification',
      variant: 'outline' as const
    },
    {
      title: 'Upgrade Plan',
      description: 'Unlock advanced planning tools',
      icon: Crown,
      href: '/pricing',
      variant: 'luxury' as const
    }
  ];

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your planning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center justify-between mb-6">
                <Badge variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  {planningPhase === 'discover' ? 'Ready to Plan?' : 'Planning Dashboard'}
                </Badge>
                <Link to="/account">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              
              {planningPhase === 'discover' ? (
                <div className="text-center space-y-6">
                  <h1 className="text-luxury-xl text-foreground">
                    Ready to Start Planning Your Wedding?
                  </h1>
                  <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
                    You've found your person! Now let's plan the perfect celebration. 
                    Access our comprehensive planning tools to organize every detail.
                  </p>
                  <Button 
                    size="xl" 
                    onClick={handleStartPlanning}
                    className="bg-gradient-primary text-primary-foreground hover:scale-105"
                  >
                    Start Planning My Wedding
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="text-luxury-xl text-foreground mb-4">
                    My Wedding Planning
                  </h1>
                  <p className="text-body-lg text-muted-foreground">
                    Your personal wedding planning command center
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      {planningPhase !== 'discover' && (
        <section className="py-8 bg-background border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {quickActions.map((action, index) => (
                  <motion.div key={action.title} variants={fadeInUp}>
                    <Link to={action.href}>
                      <Card className="h-full hover:shadow-lg transition-all group cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                              <action.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-foreground truncate">
                                {action.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {action.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Planning Tools Grid */}
      {planningPhase !== 'discover' && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              
              {/* Quick Stats */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp}>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h3 className="text-2xl font-semibold mb-1">
                        ${stats.budget.totalActual.toLocaleString()}
                      </h3>
                      <p className="text-sm text-muted-foreground">Budget Spent</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h3 className="text-2xl font-semibold mb-1">{stats.guests.total}</h3>
                      <p className="text-sm text-muted-foreground">Guests Invited</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h3 className="text-2xl font-semibold mb-1">{stats.timeline.completed}</h3>
                      <p className="text-sm text-muted-foreground">Tasks Completed</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <h3 className="text-2xl font-semibold mb-1">
                        {Math.round((stats.budget.progress + stats.guests.progress + stats.timeline.progress) / 3)}%
                      </h3>
                      <p className="text-sm text-muted-foreground">Overall Progress</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Planning Tools Cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {planningCards.map((card) => (
                  <motion.div key={card.id} variants={fadeInUp}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <card.icon className="w-8 h-8 text-primary" />
                          {card.premium && (
                            <Badge variant="secondary">Premium</Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                          {card.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{Math.round(card.progress)}%</span>
                            </div>
                            <Progress value={card.progress} className="h-2" />
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            {card.details}
                          </p>
                          
                          <Link to={card.href} className="block w-full">
                            <Button 
                              variant={card.premium ? "outline" : "default"}
                              className="w-full"
                              disabled={card.premium && subscriptionTier === 'free'}
                            >
                              {card.premium && subscriptionTier === 'free' ? 'Upgrade Required' : 'Open'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default AccountPlanning;