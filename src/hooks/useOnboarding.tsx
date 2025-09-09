import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface OnboardingData {
  // Step 0: Welcome
  profile_manager: 'self' | 'parent' | 'sibling' | 'other';
  manager_relation?: string;
  
  // Step 1: Identity
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  
  // Step 2: Physical
  height_cm: number | null;
  marital_status: string;
  has_children: boolean;
  
  // Step 3: Community
  religion: string;
  caste_community: string;
  mother_tongue: string;
  
  // Step 4: Education
  education_level: string;
  education_field: string;
  education_institution: string;
  
  // Step 5: Profession
  profession_title: string;
  industry: string;
  company: string;
  income_range: string;
  employment_type: string;
  
  // Step 6: Location
  country_of_residence: string;
  city: string;
  citizenship: string;
  visa_status: string;
  willing_to_relocate: boolean;
  
  // Step 7: Family
  family_type: string;
  family_values: string;
  father_occupation: string;
  mother_occupation: string;
  siblings_count: number;
  
  // Step 8: Lifestyle
  diet: string;
  smoke: string;
  drink: string;
  hobbies: string[];
  
  // Step 9: About
  bio: string;
  
  // Step 19: Contact
  visibility_photos: string;
  visibility_last_seen: boolean;
  messaging_policy: string;
  
  // Partner preferences
  partner_age_min: number;
  partner_age_max: number;
  partner_height_min_cm: number | null;
  partner_height_max_cm: number | null;
  partner_countries: string[];
  partner_education_levels: string[];
  partner_religions: string[];
  partner_diet: string[];
  partner_notes: string;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [loading, setLoading] = useState(false);

  // Load existing progress
  useEffect(() => {
    if (!user) return;
    
    const loadProgress = async () => {
      try {
        const { data: progress } = await supabase
          .from('onboarding_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (progress) {
          setCurrentStep(progress.current_step);
          setData((progress.draft as Partial<OnboardingData>) || {});
        }
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
      }
    };
    
    loadProgress();
  }, [user]);

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const saveProgress = async (step: number, stepData?: Partial<OnboardingData>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedData = stepData ? { ...data, ...stepData } : data;
      
      await supabase
        .from('onboarding_progress')
        .upsert({
          user_id: user.id,
          current_step: step,
          draft: updatedData
        });
        
      setCurrentStep(step);
      if (stepData) setData(updatedData);
      
      console.log('onboarding_step_completed', { step, time_spent: Date.now() });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error saving progress",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Save profile data
      const profileData = {
        user_id: user.id,
        profile_manager: data.profile_manager || 'self',
        manager_relation: data.manager_relation,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        dob: data.dob,
        height_cm: data.height_cm,
        marital_status: data.marital_status,
        has_children: data.has_children || false,
        religion: data.religion,
        caste_community: data.caste_community,
        mother_tongue: data.mother_tongue,
        education_level: data.education_level,
        education_field: data.education_field,
        education_institution: data.education_institution,
        profession_title: data.profession_title,
        industry: data.industry,
        company: data.company,
        income_range: data.income_range,
        employment_type: data.employment_type,
        country_of_residence: data.country_of_residence,
        city: data.city,
        citizenship: data.citizenship,
        visa_status: data.visa_status,
        willing_to_relocate: data.willing_to_relocate,
        family_type: data.family_type,
        family_values: data.family_values,
        father_occupation: data.father_occupation,
        mother_occupation: data.mother_occupation,
        siblings_count: data.siblings_count,
        diet: data.diet,
        smoke: data.smoke,
        drink: data.drink,
        hobbies: data.hobbies || [],
        bio: data.bio,
        visibility_photos: data.visibility_photos || 'all',
        visibility_last_seen: data.visibility_last_seen !== false,
        messaging_policy: data.messaging_policy || 'all',
        onboarding_completed: true
      };
      
      await supabase.from('profiles').upsert(profileData);
      
      // Save partner preferences
      const preferencesData = {
        user_id: user.id,
        age_min: data.partner_age_min,
        age_max: data.partner_age_max,
        height_min_cm: data.partner_height_min_cm,
        height_max_cm: data.partner_height_max_cm,
        countries: data.partner_countries || [],
        education_levels: data.partner_education_levels || [],
        religions: data.partner_religions || [],
        diet: data.partner_diet || [],
        notes: data.partner_notes
      };
      
      await supabase.from('partner_preferences').upsert(preferencesData);
      
      // Clear progress
      await supabase
        .from('onboarding_progress')
        .delete()
        .eq('user_id', user.id);
        
      toast({
        title: "Profile completed!",
        description: "Welcome to Mēl Milaap"
      });
      
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error completing profile",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    data,
    loading,
    updateData,
    saveProgress,
    completeOnboarding,
    setCurrentStep
  };
};