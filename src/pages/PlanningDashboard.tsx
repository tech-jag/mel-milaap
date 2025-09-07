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
  BookOpen,
  Globe,
  ArrowRight,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getBudget, getGuests, getTimelineItems, getGiftRegistries, getUserProfile, updateUserPlanningPhase } from "@/lib/planning";
// Remove SEO imports and components temporarily

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

const PlanningDashboard = () => {
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
      navigate('/auth');
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
      href: '/planning/budget',
      progress: stats.budget.progress,
      details: `${stats.budget.totalItems} categories • $${stats.budget.totalActual.toLocaleString()} spent`,
      premium: false
    },
    {
      id: 'guests',
      title: 'Guest List',
      description: 'Organize guests and track RSVPs',
      icon: Users,
      href: '/planning/guests',
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
      href: '/planning/checklist',
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

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading your planning dashboard...</div>
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
            className="max-w-4xl mx-auto text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-4">
                <Heart className="w-4 h-4 mr-2" />
                {planningPhase === 'discover' ? 'Ready to Plan?' : 'Planning Dashboard'}
              </Badge>
              
              {planningPhase === 'discover' ? (
                <div className="space-y-6">
                  <h1 className="text-luxury-xl text-foreground">
                    Ready to Start Planning Your Wedding?
                  </h1>
                  <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
                    You've found your person! Now let's plan the perfect celebration. 
                    Access our comprehensive planning tools to organize every detail.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={handleStartPlanning}
                    className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    Start Planning My Wedding
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div>
                  <h1 className="text-luxury-xl text-foreground mb-4">
                    Wedding Planning Dashboard
                  </h1>
                  <p className="text-body-lg text-muted-foreground">
                    Your wedding planning command center. Everything you need in one place.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

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

export default PlanningDashboard;