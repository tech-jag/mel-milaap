"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Heart, 
  MessageCircle, 
  Calendar,
  Shield,
  Settings,
  Star,
  TrendingUp,
  Gift,
  CheckCircle,
  Crown
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { supabase } from "@/integrations/supabase/client";

const Account = () => {
  const [user, setUser] = React.useState<any>(null);
  const [stats, setStats] = React.useState({
    favorites: 0,
    messages: 0,
    planningProgress: 0,
    verified: false
  });
  const [userPlan, setUserPlan] = React.useState('free');

  React.useEffect(() => {
    checkUser();
    loadStats();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUser(user);
  };

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load user stats and plan
    const [favoritesResult, messagesResult, budgetResult, userResult] = await Promise.all([
      supabase.from('favorites').select('id').eq('user_id', user.id),
      supabase.from('messages').select('id').eq('sender_id', user.id),
      supabase.from('budgets').select('id').eq('user_id', user.id),
      supabase.from('users').select('plan').eq('id', user.id).single()
    ]);

    setStats({
      favorites: favoritesResult.data?.length || 0,
      messages: messagesResult.data?.length || 0,
      planningProgress: budgetResult.data?.length > 0 ? 25 : 0,
      verified: user.email_confirmed_at ? true : false
    });

    setUserPlan(userResult.data?.plan || 'free');
  };

  const quickActions = [
    {
      icon: Heart,
      title: "My Favorites",
      description: "Saved profiles and suppliers",
      href: "/account/favorites",
      color: "text-red-500"
    },
    {
      icon: Calendar,
      title: "Wedding Planning",
      description: "Budget, guests, and timeline",
      href: "/account/planning/budget",
      color: "text-blue-500"
    },
    {
      icon: Gift,
      title: "Digital Invites",
      description: "Create beautiful invitations",
      href: "/account/invites",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Security Settings",
      description: "2FA and privacy controls",
      href: "/account/security",
      color: "text-green-500"
    }
  ];

  const recentActivity = [
    { action: "Viewed profile", user: "Priya S.", time: "2 hours ago" },
    { action: "Added to favorites", user: "Rohit M.", time: "1 day ago" },
    { action: "Received interest", user: "Ananya K.", time: "2 days ago" },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6">
                <User className="w-4 h-4 mr-2" />
                My Account
              </Badge>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge 
                  variant={userPlan === 'free' ? 'secondary' : 'default'}
                  className="text-sm px-3 py-1"
                >
                  {userPlan.toUpperCase()} PLAN
                </Badge>
                {userPlan === 'free' && (
                  <Link to="/account/billing">
                    <Button variant="luxury" size="sm">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                )}
              </div>
              <h1 className="text-luxury-xl text-foreground mb-6">
                Welcome back, {user.user_metadata?.name || 'Member'}!
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Manage your profile, connect with matches, and plan your perfect wedding.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Stats Overview */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { icon: Heart, label: "Favorites", value: stats.favorites, color: "text-red-500" },
                { icon: MessageCircle, label: "Messages", value: stats.messages, color: "text-blue-500" },
                { icon: TrendingUp, label: "Planning Progress", value: `${stats.planningProgress}%`, color: "text-green-500" },
                { icon: CheckCircle, label: "Verification", value: stats.verified ? "Verified" : "Pending", color: stats.verified ? "text-green-500" : "text-amber-500" },
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="luxury-card text-center">
                    <CardContent className="p-6">
                      <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                      <h3 className="text-2xl font-semibold text-foreground mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Quick Actions */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        to={action.href}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-card/50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                          <action.icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {action.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-foreground">
                            {activity.action}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.user}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Link to="/account/planning/guests">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Guest List
                          </Button>
                        </Link>
                        <Link to="/account/planning/todo">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            To-Do List
                          </Button>
                        </Link>
                      </div>
                      <Link to="/match">
                        <Button variant="outline" className="w-full">
                          <Heart className="w-4 h-4 mr-2" />
                          Find New Matches
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Account;