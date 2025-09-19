import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Heart, MessageCircle, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityStats {
  profile_views_count: number;
  interests_sent_count: number;
  interests_received_count: number;
  matches_count: number;
}

interface ActivityTrackerProps {
  userId: string;
}

export function ActivityTracker({ userId }: ActivityTrackerProps) {
  const [stats, setStats] = useState<ActivityStats>({
    profile_views_count: 0,
    interests_sent_count: 0,
    interests_received_count: 0,
    matches_count: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivityStats();
  }, [userId]);

  const loadActivityStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading activity stats:', error);
        return;
      }

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading activity stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activityItems = [
    {
      icon: Eye,
      value: stats.profile_views_count,
      label: 'Profile Views',
      period: 'This month',
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      value: stats.interests_sent_count,
      label: 'Interests Sent',
      period: 'This month',
      color: 'text-rose-600'
    },
    {
      icon: MessageCircle,
      value: stats.interests_received_count,
      label: 'Interests Received',
      period: 'This month',
      color: 'text-green-600'
    },
    {
      icon: Users,
      value: stats.matches_count,
      label: 'Active Matches',
      period: 'Total',
      color: 'text-purple-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">My Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {activityItems.map((item, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-muted/30">
              <div className="flex justify-center mb-2">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-primary">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.period}</div>
            </div>
          ))}
        </div>

        {/* Engagement tips */}
        {stats.profile_views_count < 10 && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">
              💡 Tip: Complete your profile and add more photos to increase visibility!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}