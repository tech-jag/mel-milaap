import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OnboardingState {
  user_id: string;
  status: 'in_progress' | 'complete';
  current_step: number;
  last_saved_at: string;
}

export interface UserProfile {
  user_id: string;
  profile_ready: boolean;
  full_name?: string;
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not';
  birth_date?: string;
  birth_time?: string;
  birth_city?: string;
  height_cm?: number;
  body_type?: 'slim' | 'average' | 'athletic' | 'heavy' | 'prefer_not';
  complexion?: 'very_fair' | 'fair' | 'wheatish' | 'dark' | 'prefer_not';
  marital_status?: 'never_married' | 'divorced' | 'widowed' | 'annulled';
  have_children?: boolean;
  children_living_with?: 'me' | 'other' | 'na';
  languages_spoken?: string[];
  mother_tongue?: string;
  religion?: string;
  community?: string;
  sub_community?: string;
  gothra?: string;
  nakshatra?: string;
  manglik?: 'yes' | 'no' | 'unknown';
  location_country?: string;
  location_state?: string;
  location_city?: string;
  citizenship?: string;
  residency_status?: string;
  education_level?: string;
  field_of_study?: string;
  university?: string;
  occupation?: string;
  employer?: string;
  annual_income?: number;
  work_location?: string;
  diet?: 'vegetarian' | 'eggetarian' | 'non_vegetarian' | 'vegan' | 'halal' | 'prefer_not';
  drinking?: 'no' | 'occasional' | 'yes';
  smoking?: 'no' | 'occasional' | 'yes';
  lifestyle_tags?: string[];
  family_type?: 'nuclear' | 'joint' | 'other';
  family_values?: 'traditional' | 'moderate' | 'liberal' | 'other';
  father_occupation?: string;
  mother_occupation?: string;
  siblings_brothers?: number;
  siblings_sisters?: number;
  family_living_in?: string;
  family_about?: string;
  about_me?: string;
  highlights?: string[];
  photo_visibility?: 'public' | 'members' | 'on_request';
  contact_by?: string[];
  photo_primary_url?: string;
  updated_at?: string;
}

export interface PartnerPreferences {
  user_id: string;
  age_min?: number;
  age_max?: number;
  height_min_cm?: number;
  height_max_cm?: number;
  marital_statuses?: string[];
  has_children?: 'yes' | 'no' | 'unknown';
  religions?: string[];
  communities?: string[];
  mother_tongues?: string[];
  countries?: string[];
  states?: string[];
  cities?: string[];
  education_levels?: string[];
  professions?: string[];
  diet?: string[];
  drink?: string[];
  smoke?: string[];
  notes?: string;
  updated_at?: string;
}

export const useOnboardingState = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: onboardingState, isLoading: isLoadingState } = useQuery({
    queryKey: ['onboarding-state', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('onboarding_state')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as OnboardingState | null;
    },
    enabled: !!user?.id,
  });

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserProfile | null;
    },
    enabled: !!user?.id,
  });

  const { data: partnerPreferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['partner-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('partner_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as PartnerPreferences | null;
    },
    enabled: !!user?.id,
  });

  const updateOnboardingStep = useMutation({
    mutationFn: async (step: number) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('onboarding_state')
        .upsert({
          user_id: user.id,
          current_step: step,
          last_saved_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-state'] });
    },
  });

  const updateUserProfile = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  const updatePartnerPreferences = useMutation({
    mutationFn: async (updates: Partial<PartnerPreferences>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('partner_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-preferences'] });
    },
  });

  const completeOnboarding = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Update onboarding status and profile ready flag
      const { error: stateError } = await supabase
        .from('onboarding_state')
        .update({
          status: 'complete',
          last_saved_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (stateError) throw stateError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          profile_ready: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-state'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  return {
    onboardingState,
    userProfile,
    partnerPreferences,
    isLoading: isLoadingState || isLoadingProfile || isLoadingPreferences,
    updateOnboardingStep,
    updateUserProfile,
    updatePartnerPreferences,
    completeOnboarding,
  };
};