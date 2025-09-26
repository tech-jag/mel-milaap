import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Camera, 
  Shield, 
  UserPlus, 
  Crown,
  Bell,
  Star,
  Users,
  Settings,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerChildren } from '@/lib/motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MatrimonialStats {
  profileCompletion: number;
  interestsReceived: number;
  interestsSent: number;
  profileViews: number;
  newMessages: number;
  activeConnections: number;
  pendingActions: number;
}

interface RecentActivity {
  id: string;
  type: 'interest_received' | 'interest_sent' | 'profile_view' | 'message' | 'connection';
  title: string;
  description: string;
  timestamp: string;
  urgent?: boolean;
}

export const MatrimonialDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<MatrimonialStats>({
    profileCompletion: 0,
    interestsReceived: 0,
    interestsSent: 0,
    profileViews: 0,
    newMessages: 0,
    activeConnections: 0,
    pendingActions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setUserProfile(profile);

      // Calculate profile completion
      const completion = calculateProfileCompletion(profile);
      
      // Load interests received
      const { data: interestsReceived } = await supabase
        .from('interests')
        .select('*')
        .eq('receiver_id', user?.id);

      // Load interests sent
      const { data: interestsSent } = await supabase
        .from('interests')
        .select('*')
        .eq('sender_id', user?.id);

      // Load profile views (if available)
      const { data: profileViews } = await supabase
        .from('profile_views')
        .select('*')
        .eq('viewed_profile_id', user?.id);

      // Load messages
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`);

      // Update stats
      setStats({
        profileCompletion: completion,
        interestsReceived: interestsReceived?.length || 0,
        interestsSent: interestsSent?.length || 0,
        profileViews: profileViews?.length || 0,
        newMessages: messages?.length || 0,
        activeConnections: interestsReceived?.filter(i => i.status === 'accepted').length || 0,
        pendingActions: interestsReceived?.filter(i => i.status === 'pending').length || 0
      });

      // Create recent activity
      const activities: RecentActivity[] = [];
      
      if (interestsReceived?.length) {
        activities.push({
          id: 'interests',
          type: 'interest_received',
          title: `${interestsReceived.length} Interest${interestsReceived.length > 1 ? 's' : ''} Received`,
          description: 'Review and respond to matrimonial interests',
          timestamp: new Date().toISOString(),
          urgent: interestsReceived.filter(i => i.status === 'pending').length > 0
        });
      }

      if (completion < 80) {
        activities.push({
          id: 'profile',
          type: 'profile_view',
          title: 'Complete Your Profile',
          description: `Profile is ${completion}% complete. Add photos and details.`,
          timestamp: new Date().toISOString(),
          urgent: true
        });
      }

      setRecentActivity(activities);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfileCompletion = (profile: any): number => {
    if (!profile) return 0;
    
    let completion = 0;
    const fields = [
      'first_name', 'last_name', 'date_of_birth', 'gender', 
      'height_cm', 'education', 'profession', 'city', 'state',
      'religion', 'community_caste', 'mother_tongue', 'bio'
    ];
    
    fields.forEach(field => {
      if (profile[field]) completion += 1;
    });
    
    // Add photo completion
    if (profile.photo_primary_url) completion += 2;
    
    return Math.round((completion / (fields.length + 2)) * 100);
  };

  const quickActions = [
    { 
      title: "Complete Profile", 
      description: "Add photos and details", 
      href: "/account/profile", 
      icon: Camera,
      urgent: stats.profileCompletion < 80
    },
    { 
      title: "Browse Matches", 
      description: "Find compatible partners", 
      href: "/search", 
      icon: Heart,
      urgent: false
    },
    { 
      title: "Verify Account", 
      description: "Get verified status", 
      href: "/account/verification", 
      icon: Shield,
      urgent: !userProfile?.verified
    },
    { 
      title: "Invite Family", 
      description: "Add parents or siblings", 
      href: "/account/collaborators", 
      icon: UserPlus,
      urgent: false
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Completion Alert */}
      {stats.profileCompletion < 80 && (
        <motion.div variants={fadeInUp}>
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Camera className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900">Complete Your Profile</h3>
                    <p className="text-sm text-orange-700">
                      Your profile is {stats.profileCompletion}% complete. Add photos and details to attract matches.
                    </p>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link to="/account/profile">
                    Complete Now
                  </Link>
                </Button>
              </div>
              <Progress value={stats.profileCompletion} className="mt-4" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Overview */}
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-red-500/10"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interests Received</p>
                  <p className="text-3xl font-bold text-pink-600">{stats.interestsReceived}</p>
                </div>
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
              {stats.pendingActions > 0 && (
                <Badge variant="secondary" className="mt-2">
                  {stats.pendingActions} pending
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.profileViews}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
              {userProfile?.subscription_tier === 'free' && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Premium feature
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeConnections}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Messages</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.newMessages}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className={`transition-all hover:shadow-md cursor-pointer ${
                  action.urgent ? 'border-orange-200 bg-orange-50/50' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        action.urgent ? 'bg-orange-100' : 'bg-primary/10'
                      }`}>
                        <action.icon className={`h-4 w-4 ${
                          action.urgent ? 'text-orange-600' : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      {action.urgent && (
                        <Badge variant="secondary" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Recent Activity
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/inbox">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                    <div className={`p-2 rounded-full ${
                      activity.urgent ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {activity.type === 'interest_received' && <Heart className="h-4 w-4 text-pink-600" />}
                      {activity.type === 'profile_view' && <Camera className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'message' && <MessageCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    {activity.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Action Required
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Complete your profile to start receiving interests!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade Banner for Free Users */}
      {userProfile?.subscription_tier === 'free' && (
        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Upgrade to Premium</h3>
                    <p className="text-sm text-purple-700">
                      Unlock advanced features: unlimited interests, profile views analytics, and priority support.
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/pricing">
                    Upgrade Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};