"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  PlusCircle, 
  Trash2,
  Download,
  TrendingUp,
  AlertTriangle,
  Edit,
  Save,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getBudgetWithCategories, ensureBudget, updateBudgetCategory, addBudgetCategory, deleteBudgetCategory } from "@/lib/budget";
import { Helmet } from "react-helmet-async";

interface BudgetCategory {
  id: string;
  name: string;
  planned_amount: number;
  sort_order: number;
}

interface Budget {
  id: string;
  name: string;
  total_budget?: number;
  currency?: string;
}

const AccountPlanningBudget = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [budget, setBudget] = React.useState<Budget | null>(null);
  const [categories, setCategories] = React.useState<BudgetCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    planned_amount: ''
  });
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    setCurrentUser(user);
    await loadBudgetData(user.id);
    setIsLoading(false);
  };

  const loadBudgetData = async (userId: string) => {
    try {
      const { budget: budgetData, categories: categoriesData } = await getBudgetWithCategories(userId);
      setBudget(budgetData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading budget:', error);
      toast({
        title: "Error loading budget",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = async () => {
    if (!budget || !newCategory.name.trim()) return;

    setIsAddingCategory(true);
    try {
      const plannedAmount = parseFloat(newCategory.planned_amount) || 0;
      const newCat = await addBudgetCategory(budget.id, {
        name: newCategory.name.trim(),
        planned_amount: plannedAmount
      });
      
      setCategories(prev => [...prev, newCat]);
      setNewCategory({ name: '', planned_amount: '' });
      
      toast({
        title: "Category added!",
        description: `${newCategory.name} has been added to your budget`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (categoryId: string, updates: { name?: string; planned_amount?: number }) => {
    try {
      await updateBudgetCategory(categoryId, updates);
      
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      ));
      
      setEditingCategory(null);
      
      toast({
        title: "Category updated!",
        description: "Your budget category has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteBudgetCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      toast({
        title: "Category deleted",
        description: "The category has been removed from your budget",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Calculate totals
  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned_amount, 0);
  const budgetUsed = budget?.total_budget ? (totalPlanned / budget.total_budget) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your budget...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Wedding Budget - Mēl Milaap</title>
        <meta name="description" content="Track and manage your wedding budget with detailed categories and spending analysis" />
      </Helmet>

      <Navigation />
      
      {/* Header */}
      <section className="py-12 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Wedding Budget
                </h1>
                <p className="text-muted-foreground">
                  Track your expenses and stay on budget for your special day
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Link to="/planning">
                  <Button variant="outline" size="sm">
                    Back to Planning
                  </Button>
                </Link>
                <Button variant="outline" size="sm" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Budget Overview */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Summary Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${budget?.total_budget?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Planned Spending</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${totalPlanned.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Budget Used</p>
                        <p className="text-2xl font-bold text-foreground">
                          {budgetUsed.toFixed(1)}%
                        </p>
                      </div>
                      <AlertTriangle className={`w-8 h-8 ${budgetUsed > 100 ? 'text-red-500' : budgetUsed > 80 ? 'text-yellow-500' : 'text-green-500'}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div variants={fadeInUp} className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Budget Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      ${totalPlanned.toLocaleString()} of ${budget?.total_budget?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <Progress value={Math.min(budgetUsed, 100)} className="h-3" />
                  {budgetUsed > 100 && (
                    <p className="text-sm text-red-500 mt-2">
                      ⚠️ You're over budget by ${(totalPlanned - (budget?.total_budget || 0)).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Budget Categories */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Budget Categories</CardTitle>
                  <Button 
                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                    size="sm"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Add Category Form */}
                  {isAddingCategory && (
                    <div className="bg-muted/50 p-4 rounded-lg mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="category-name">Category Name</Label>
                          <Input
                            id="category-name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Photography"
                          />
                        </div>
                        <div>
                          <Label htmlFor="planned-amount">Planned Amount</Label>
                          <Input
                            id="planned-amount"
                            type="number"
                            value={newCategory.planned_amount}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, planned_amount: e.target.value }))}
                            placeholder="5000"
                          />
                        </div>
                        <div className="flex items-end space-x-2">
                          <Button 
                            onClick={handleAddCategory}
                            disabled={!newCategory.name.trim() || isAddingCategory}
                            size="sm"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsAddingCategory(false);
                              setNewCategory({ name: '', planned_amount: '' });
                            }}
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Categories List */}
                  <div className="space-y-4">
                    {categories.length === 0 ? (
                      <div className="text-center py-8">
                        <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">No budget categories yet</p>
                        <p className="text-sm text-muted-foreground">
                          Add categories to start tracking your wedding expenses
                        </p>
                      </div>
                    ) : (
                      categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          {editingCategory === category.id ? (
                            <EditCategoryForm 
                              category={category}
                              onSave={(updates) => handleUpdateCategory(category.id, updates)}
                              onCancel={() => setEditingCategory(null)}
                            />
                          ) : (
                            <>
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{category.name}</h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-muted-foreground">
                                    Planned: ${category.planned_amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingCategory(category.id)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Edit Category Form Component
const EditCategoryForm = ({ 
  category, 
  onSave, 
  onCancel 
}: { 
  category: BudgetCategory; 
  onSave: (updates: { name?: string; planned_amount?: number }) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = React.useState(category.name);
  const [plannedAmount, setPlannedAmount] = React.useState(category.planned_amount.toString());

  const handleSave = () => {
    const updates: { name?: string; planned_amount?: number } = {};
    
    if (name.trim() !== category.name) {
      updates.name = name.trim();
    }
    
    const newAmount = parseFloat(plannedAmount) || 0;
    if (newAmount !== category.planned_amount) {
      updates.planned_amount = newAmount;
    }
    
    onSave(updates);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
      />
      <Input
        type="number"
        value={plannedAmount}
        onChange={(e) => setPlannedAmount(e.target.value)}
        placeholder="Planned amount"
      />
      <div className="flex items-center space-x-2">
        <Button size="sm" onClick={handleSave}>
          <Save className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AccountPlanningBudget;