import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ActivityStats {
  profile_views_count: number;
  interests_sent_count: number;
  interests_received_count: number;
  matches_count: number;
  last_updated: string;
}

export function useActivityStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ActivityStats>({
    profile_views_count: 0,
    interests_sent_count: 0,
    interests_received_count: 0,
    matches_count: 0,
    last_updated: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadActivityStats();
    }
  }, [user]);

  const loadActivityStats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Try to get existing stats
      const { data, error } = await supabase
        .from('user_activity_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setStats(data);
      } else {
        // Create initial stats record
        const { data: newStats, error: createError } = await supabase
          .from('user_activity_stats')
          .insert({
            user_id: user.id,
            profile_views_count: 0,
            interests_sent_count: 0,
            interests_received_count: 0,
            matches_count: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        if (newStats) setStats(newStats);
      }
    } catch (error) {
      console.error('Error loading activity stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = async (updates: Partial<ActivityStats>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_activity_stats')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setStats(data);
    } catch (error) {
      console.error('Error updating activity stats:', error);
    }
  };

  const incrementProfileViews = () => {
    updateStats({
      profile_views_count: stats.profile_views_count + 1
    });
  };

  const incrementInterestsSent = () => {
    updateStats({
      interests_sent_count: stats.interests_sent_count + 1
    });
  };

  const incrementInterestsReceived = () => {
    updateStats({
      interests_received_count: stats.interests_received_count + 1
    });
  };

  const incrementMatches = () => {
    updateStats({
      matches_count: stats.matches_count + 1
    });
  };

  return {
    stats,
    isLoading,
    refreshStats: loadActivityStats,
    incrementProfileViews,
    incrementInterestsSent,
    incrementInterestsReceived,
    incrementMatches
  };
}