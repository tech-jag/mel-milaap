import { supabase } from "@/integrations/supabase/client";

// Budget management functions using the new schema
export const ensureBudget = async (userId: string) => {
  try {
    // Check if budget exists
    let { data: budget, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    if (!budget) {
      // Create default budget
      const { data: newBudget, error: createError } = await supabase
        .from('budgets')
        .insert({
          user_id: userId,
          name: 'My Wedding Budget',
          total_budget: 50000,
          currency: 'AUD'
        })
        .select()
        .single();

      if (createError) throw createError;
      budget = newBudget;

      // Create default categories
      const defaultCategories = [
        { name: 'Venue & Reception', planned_amount: 20000, sort_order: 1 },
        { name: 'Photography & Videography', planned_amount: 8000, sort_order: 2 },
        { name: 'Catering & Bar', planned_amount: 12000, sort_order: 3 },
        { name: 'Attire & Beauty', planned_amount: 3000, sort_order: 4 },
        { name: 'Flowers & Decorations', planned_amount: 3000, sort_order: 5 },
        { name: 'Music & Entertainment', planned_amount: 2000, sort_order: 6 },
        { name: 'Transport', planned_amount: 1000, sort_order: 7 },
        { name: 'Miscellaneous', planned_amount: 1000, sort_order: 8 }
      ];

      for (const category of defaultCategories) {
        await supabase
          .from('budget_categories')
          .insert({
            budget_id: budget.id,
            ...category
          });
      }
    }

    return budget;
  } catch (error) {
    console.error('Error ensuring budget:', error);
    throw error;
  }
};

export const getBudgetWithCategories = async (userId: string) => {
  try {
    const budget = await ensureBudget(userId);
    
    const { data: categories, error } = await supabase
      .from('budget_categories')
      .select('*')
      .eq('budget_id', budget.id)
      .order('sort_order');

    if (error) throw error;

    return { budget, categories: categories || [] };
  } catch (error) {
    console.error('Error getting budget with categories:', error);
    throw error;
  }
};

export const updateBudgetCategory = async (categoryId: string, updates: {
  name?: string;
  planned_amount?: number;
}) => {
  try {
    const { error } = await supabase
      .from('budget_categories')
      .update(updates)
      .eq('id', categoryId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating budget category:', error);
    throw error;
  }
};

export const addBudgetCategory = async (budgetId: string, category: {
  name: string;
  planned_amount: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('budget_categories')
      .insert({
        budget_id: budgetId,
        name: category.name,
        planned_amount: category.planned_amount,
        sort_order: Date.now() // Simple ordering
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding budget category:', error);
    throw error;
  }
};

export const deleteBudgetCategory = async (categoryId: string) => {
  try {
    const { error } = await supabase
      .from('budget_categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting budget category:', error);
    throw error;
  }
};