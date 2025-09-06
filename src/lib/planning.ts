import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Type definitions
export type Budget = Database['public']['Tables']['budgets']['Row'];
export type BudgetItem = Database['public']['Tables']['budget_items']['Row'];
export type Guest = Database['public']['Tables']['guests']['Row'];
export type TimelineItem = Database['public']['Tables']['wedding_timeline_items']['Row'];
export type GiftRegistry = Database['public']['Tables']['gift_registries']['Row'];
export type Wedding = Database['public']['Tables']['weddings']['Row'];

// Analytics helper
export const trackEvent = async (event: string, payload: any = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event,
      payload
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Budget helpers
export const getBudget = async (userId: string) => {
  let { data: budget, error } = await supabase
    .from('budgets')
    .select('*, budget_items(*)')
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;

  if (!budget) {
    const { data: newBudget, error: createError } = await supabase
      .from('budgets')
      .insert({
        user_id: userId,
        name: 'Wedding Budget',
        total_budget: 50000
      })
      .select('*, budget_items(*)')
      .single();

    if (createError) throw createError;
    budget = newBudget;
  }

  return budget;
};

// Guest helpers
export const getGuests = async (userId: string) => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('user_id', userId)
    .order('full_name');

  if (error) throw error;
  return data || [];
};

// Timeline helpers
export const getTimelineItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('wedding_timeline_items')
    .select('*')
    .eq('user_id', userId)
    .order('due_on');

  if (error) throw error;
  return data || [];
};

// Registry helpers
export const getGiftRegistries = async (userId: string) => {
  const { data, error } = await supabase
    .from('gift_registries')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order');

  if (error) throw error;
  return data || [];
};

// Wedding helpers
export const getWedding = async (userId: string) => {
  let { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;

  if (!wedding) {
    const { data: newWedding, error: createError } = await supabase
      .from('weddings')
      .insert({
        user_id: userId,
        partner_name: null,
        event_date: null,
        venue: null
      })
      .select()
      .single();

    if (createError) throw createError;
    wedding = newWedding;
  }

  return wedding;
};

// User profile helpers
export const updateUserPlanningPhase = async (userId: string, phase: 'discover' | 'planning' | 'married') => {
  const { error } = await supabase
    .from('users')
    .update({ planning_phase: phase })
    .eq('id', userId);

  if (error) throw error;
  
  await trackEvent('planning_phase_changed', { phase });
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('planning_phase, subscription_tier, plan')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};