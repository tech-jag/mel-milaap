import { supabase } from "@/integrations/supabase/client";

// Plan badge helpers
export const getPlanBadgeText = (plan: string) => {
  switch (plan) {
    case 'member_99':
      return 'Premium';
    case 'member_49': 
      return 'Member';
    case 'free':
    default:
      return 'Free';
  }
};

export const getBadgeVariant = (plan: string) => {
  switch (plan) {
    case 'member_99':
      return 'default' as const;
    case 'member_49':
      return 'secondary' as const;
    case 'free':
    default:
      return 'outline' as const;
  }
};

// User subscription helpers
export const getUserSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('subject_id', userId)
      .eq('subject_type', 'user')
      .eq('status', 'active')
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
};

// Initialize user planning if needed
export const initializePlanning = async (userId: string) => {
  try {
    // Check if user has basic planning data
    const [budget, guests] = await Promise.all([
      supabase.from('budgets').select('id').eq('user_id', userId).maybeSingle(),
      supabase.from('guests').select('id').eq('user_id', userId).limit(1).maybeSingle()
    ]);

    // If no budget exists, create one
    if (!budget.data) {
      await supabase.from('budgets').insert({
        user_id: userId,
        name: 'My Wedding Budget',
        total_budget: 50000,
        currency: 'AUD'
      });
    }

    return true;
  } catch (error) {
    console.error('Error initializing planning:', error);
    return false;
  }
};