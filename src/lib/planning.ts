import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Type definitions - enhanced with new tables
export type Budget = Database['public']['Tables']['budgets']['Row'];
export type BudgetItem = Database['public']['Tables']['budget_items']['Row'];
export type Guest = Database['public']['Tables']['guests']['Row'];
export type TimelineItem = Database['public']['Tables']['wedding_timeline_items']['Row'];
export type GiftRegistry = Database['public']['Tables']['gift_registries']['Row'];
export type Wedding = Database['public']['Tables']['weddings']['Row'];
export type Collaborator = Database['public']['Tables']['collaborators']['Row'];
export type SupplierLead = Database['public']['Tables']['supplier_leads']['Row'];
export type Article = Database['public']['Tables']['articles']['Row'];

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

// Enhanced user profile helpers
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('planning_phase, subscription_tier, plan, partner_name, wedding_date, venue_location')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserPlanningPhase = async (userId: string, phase: 'discover' | 'planning' | 'married') => {
  const { error } = await supabase
    .from('users')
    .update({ planning_phase: phase })
    .eq('id', userId);

  if (error) throw error;
  
  await trackEvent('planning_phase_changed', { phase });
};

export const updateUserWeddingDetails = async (userId: string, details: {
  partner_name?: string;
  wedding_date?: string;
  venue_location?: string;
}) => {
  const { error } = await supabase
    .from('users')
    .update(details)
    .eq('id', userId);

  if (error) throw error;
  
  await trackEvent('wedding_details_updated', details);
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

export const addBudgetItem = async (budgetId: string, item: {
  category: string;
  planned_amount?: number;
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('budget_items')
    .insert({
      budget_id: budgetId,
      ...item
    })
    .select()
    .single();

  if (error) throw error;
  
  await trackEvent('budget_item_added', { category: item.category });
  return data;
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

export const addGuest = async (userId: string, guest: {
  full_name: string;
  email?: string;
  phone?: string;
  side?: string;
  group_name?: string;
}) => {
  const { data, error } = await supabase
    .from('guests')
    .insert({
      user_id: userId,
      ...guest
    })
    .select()
    .single();

  if (error) throw error;
  
  await trackEvent('guest_added', { side: guest.side });
  return data;
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

export const addTimelineItem = async (userId: string, item: {
  title: string;
  due_on: string;
  priority?: string;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('wedding_timeline_items')
    .insert({
      user_id: userId,
      ...item
    })
    .select()
    .single();

  if (error) throw error;
  
  await trackEvent('timeline_item_added', { priority: item.priority });
  return data;
};

export const updateTimelineItemStatus = async (itemId: string, status: string) => {
  const updateData: any = { status };
  if (status === 'done') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('wedding_timeline_items')
    .update(updateData)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  
  await trackEvent('timeline_item_updated', { status });
  return data;
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

export const addGiftRegistryItem = async (userId: string, item: {
  type: string;
  title: string;
  url?: string;
  description?: string;
  target_amount?: number;
  image_url?: string;
}) => {
  const { data, error } = await supabase
    .from('gift_registries')
    .insert({
      user_id: userId,
      ...item
    })
    .select()
    .single();

  if (error) throw error;
  
  await trackEvent('registry_item_added', { type: item.type });
  return data;
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

// Collaboration helpers
export const getCollaborators = async (userId: string) => {
  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .or(`inviter_user_id.eq.${userId},invitee_user_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const inviteCollaborator = async (inviterUserId: string, email: string, role: string) => {
  // Generate invitation token
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  const { data, error } = await supabase
    .from('collaborators')
    .insert({
      inviter_user_id: inviterUserId,
      invitee_email: email,
      role: role as 'parent' | 'sibling' | 'partner' | 'close_friend',
      invitation_token: token,
      invitation_expires_at: expiresAt.toISOString(),
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  
  await trackEvent('collaborator_invited', { role, email });
  
  // TODO: Send email invitation with token
  return data;
};

// Article helpers
export const getPublishedArticles = async (category?: string) => {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data;
};

// Supplier lead helpers
export const getSupplierLeads = async (supplierId: string) => {
  const { data, error } = await supabase
    .from('supplier_leads')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addSupplierLead = async (supplierId: string, lead: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  event_date?: string;
  budget_range?: string;
  message?: string;
}) => {
  const { data, error } = await supabase
    .from('supplier_leads')
    .insert({
      supplier_id: supplierId,
      ...lead,
      status: 'new'
    })
    .select()
    .single();

  if (error) throw error;
  
  await trackEvent('supplier_lead_added', { supplier_id: supplierId });
  return data;
};

// Planning progress calculation
export const calculatePlanningProgress = (stats: {
  budgetItems: number;
  guests: number;
  timelineCompleted: number;
  timelineTotal: number;
  registryItems: number;
}) => {
  const components = [
    stats.budgetItems > 0 ? 25 : 0,
    stats.guests > 0 ? 25 : 0,
    stats.timelineTotal > 0 ? (stats.timelineCompleted / stats.timelineTotal) * 25 : 0,
    stats.registryItems > 0 ? 25 : 0
  ];
  
  return Math.round(components.reduce((sum, val) => sum + val, 0));
};