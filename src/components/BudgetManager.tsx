import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, DollarSign, Target, TrendingUp } from "lucide-react";

interface Budget {
  id: string;
  name: string;
  total_budget: number | null;
  currency: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  planned_amount: number;
  sort_order: number;
}

interface BudgetItem {
  id: string;
  budget_id: string;
  planned_amount: number;
  actual_amount: number;
  status: string;
  notes: string | null;
  vendor_name: string;
  vendor_contact: string;
}

export default function BudgetManager() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", amount: "" });
  const { toast } = useToast();

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ensure user has a budget
      const { data: budgetData } = await supabase.rpc('ensure_user_budget', {
        p_user_id: user.id
      });

      if (budgetData) {
        // Load budget info
        const { data: budget } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (budget) {
          setBudget(budget);

          // Load categories
          const { data: categoriesData } = await supabase
            .from('budget_categories')
            .select('*')
            .eq('budget_id', budget.id)
            .order('sort_order');

          if (categoriesData) {
            setCategories(categoriesData);
          }

          // Load items
          const { data: itemsData } = await supabase
            .from('budget_items')
            .select('*')
            .eq('budget_id', budget.id);

          if (itemsData) {
            setItems(itemsData);
          }
        }
      }
    } catch (error) {
      console.error('Error loading budget:', error);
      toast({
        title: "Error",
        description: "Failed to load budget data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!budget || !newCategory.name || !newCategory.amount) return;

    try {
      const { error } = await supabase
        .from('budget_categories')
        .insert({
          budget_id: budget.id,
          name: newCategory.name,
          planned_amount: parseFloat(newCategory.amount),
          sort_order: categories.length + 1
        });

      if (error) throw error;

      setNewCategory({ name: "", amount: "" });
      loadBudgetData();
      
      toast({
        title: "Success",
        description: "Category added successfully"
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error", 
        description: "Failed to add category",
        variant: "destructive"
      });
    }
  };

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned_amount, 0);
  const totalSpent = items.reduce((sum, item) => sum + item.actual_amount, 0);
  const budgetUsed = totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Wedding Budget</h1>
        <p className="text-muted-foreground">Track your wedding expenses and stay on budget</p>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-primary">
                  ${budget?.total_budget?.toLocaleString() || totalPlanned.toLocaleString()}
                </p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-destructive">
                  ${totalSpent.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-success">
                  ${Math.max(0, totalPlanned - totalSpent).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: ${totalSpent.toLocaleString()}</span>
              <span>Budget: ${totalPlanned.toLocaleString()}</span>
            </div>
            <Progress value={Math.min(budgetUsed, 100)} />
            <div className="text-center">
              <Badge variant={budgetUsed > 100 ? "destructive" : budgetUsed > 80 ? "secondary" : "default"}>
                {budgetUsed.toFixed(1)}% used
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const categorySpent = items
                .filter(item => item.category === category.name)
                .reduce((sum, item) => sum + item.actual_amount, 0);
              const categoryProgress = category.planned_amount > 0 
                ? (categorySpent / category.planned_amount) * 100 
                : 0;

              return (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        ${categorySpent.toLocaleString()} / ${category.planned_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Progress value={Math.min(categoryProgress, 100)} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{categoryProgress.toFixed(1)}% used</span>
                    <span>${(category.planned_amount - categorySpent).toLocaleString()} remaining</span>
                  </div>
                </div>
              );
            })}
            
            {/* Add Category Form */}
            <div className="p-4 border-2 border-dashed border-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="e.g., Photography"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category-amount">Planned Amount</Label>
                  <Input
                    id="category-amount"
                    type="number"
                    placeholder="0"
                    value={newCategory.amount}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCategory} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}