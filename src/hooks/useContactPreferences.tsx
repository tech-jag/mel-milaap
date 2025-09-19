import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface ContactPreferences {
  who_can_message: string;
  phone_visibility: string;
  auto_response_enabled: boolean;
  auto_response_message: string;
}

export function useContactPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<ContactPreferences>({
    who_can_message: 'premium-only',
    phone_visibility: 'premium-connections',
    auto_response_enabled: false,
    auto_response_message: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadContactPreferences();
    }
  }, [user]);

  const loadContactPreferences = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('contact_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences
        const { data: newPrefs, error: createError } = await supabase
          .from('contact_preferences')
          .insert({
            user_id: user.id,
            who_can_message: 'premium-only',
            phone_visibility: 'premium-connections',
            auto_response_enabled: false,
            auto_response_message: ''
          })
          .select()
          .single();

        if (createError) throw createError;
        if (newPrefs) setPreferences(newPrefs);
      }
    } catch (error) {
      console.error('Error loading contact preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<ContactPreferences>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contact_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          ...updates
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setPreferences(data);
        toast({
          title: "Preferences updated",
          description: "Your contact preferences have been saved.",
        });
      }
    } catch (error: any) {
      console.error('Error updating contact preferences:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    refreshPreferences: loadContactPreferences
  };
}