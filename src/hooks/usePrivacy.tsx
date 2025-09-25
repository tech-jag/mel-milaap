import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PrivacySettings {
  visibility: 'public' | 'community' | 'premium' | 'private';
  photo_visibility: 'all' | 'premium' | 'mutual';
  contact_visibility: 'all' | 'premium' | 'mutual';
  view_tracking_enabled: boolean;
}

export const usePrivacy = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    visibility: 'community',
    photo_visibility: 'all',
    contact_visibility: 'premium',
    view_tracking_enabled: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('visibility, photo_visibility, contact_visibility, view_tracking_enabled')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          visibility: data.visibility || 'community',
          photo_visibility: data.photo_visibility || 'all',
          contact_visibility: data.contact_visibility || 'premium',
          view_tracking_enabled: data.view_tracking_enabled ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySettings = async (newSettings: Partial<PrivacySettings>) => {
    if (!user) return;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSettings(updatedSettings);
      
      toast({
        title: 'Privacy Settings Updated',
        description: 'Your privacy preferences have been saved successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update privacy settings. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const checkProfileAccess = async (profileId: string): Promise<{
    canView: boolean;
    canViewPhotos: boolean;
    canViewContact: boolean;
  }> => {
    if (!user) {
      return { canView: false, canViewPhotos: false, canViewContact: false };
    }

    try {
      // Own profile
      if (user.id === profileId) {
        return { canView: true, canViewPhotos: true, canViewContact: true };
      }

      // Get target profile settings
      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('visibility, photo_visibility, contact_visibility')
        .eq('user_id', profileId)
        .single();

      if (!targetProfile) {
        return { canView: false, canViewPhotos: false, canViewContact: false };
      }

      // Check user's premium status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('subject_id', user.id)
        .eq('subject_type', 'user')
        .eq('status', 'active')
        .single();

      const isPremium = !!subscription;

      // Check mutual interests
      const { data: mutualInterest } = await supabase
        .from('interests')
        .select('status')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`)
        .eq('status', 'accepted')
        .single();

      const hasMutualInterest = !!mutualInterest;

      // Determine access levels
      let canView = false;
      let canViewPhotos = false;
      let canViewContact = false;

      // Profile visibility
      switch (targetProfile.visibility) {
        case 'public':
          canView = true;
          break;
        case 'community':
          canView = true;
          break;
        case 'premium':
          canView = isPremium || hasMutualInterest;
          break;
        case 'private':
          canView = hasMutualInterest;
          break;
      }

      // Photo visibility
      if (canView) {
        switch (targetProfile.photo_visibility) {
          case 'all':
            canViewPhotos = true;
            break;
          case 'premium':
            canViewPhotos = isPremium || hasMutualInterest;
            break;
          case 'mutual':
            canViewPhotos = hasMutualInterest;
            break;
        }
      }

      // Contact visibility
      if (canView) {
        switch (targetProfile.contact_visibility) {
          case 'all':
            canViewContact = true;
            break;
          case 'premium':
            canViewContact = isPremium || hasMutualInterest;
            break;
          case 'mutual':
            canViewContact = hasMutualInterest;
            break;
        }
      }

      return { canView, canViewPhotos, canViewContact };
    } catch (error) {
      console.error('Error checking profile access:', error);
      return { canView: false, canViewPhotos: false, canViewContact: false };
    }
  };

  const logProfileView = async (viewedProfileId: string) => {
    if (!user || user.id === viewedProfileId) return;

    try {
      const { error } = await supabase
        .from('profile_views')
        .insert({
          viewer_id: user.id,
          viewed_profile_id: viewedProfileId,
        });

      if (error && !error.message.includes('duplicate')) {
        console.error('Error logging profile view:', error);
      }
    } catch (error) {
      console.error('Error logging profile view:', error);
    }
  };

  return {
    settings,
    loading,
    updatePrivacySettings,
    checkProfileAccess,
    logProfileView,
    refreshSettings: loadPrivacySettings,
  };
};