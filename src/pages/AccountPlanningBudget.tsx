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
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BudgetItem {
  id: string;
  category: string;
  planned_amount: number;
  actual_amount: number;
  notes?: string;
}

interface Budget {
  id: string;
  name: string;
  total_budget?: number;
  items: BudgetItem[];
}

const AccountPlanningBudget = () => {
  const { toast } = useToast();
  const [budget, setBudget] = React.useState<Budget | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [newItem, setNewItem] = React.useState({
    category: '',
    planned_amount: '',
    actual_amount: '',
    notes: ''
  });
  const [showAddForm, setShowAddForm] = React.useState(false);

  React.useEffect(() => {
    checkAuthAndLoadBudget();
  }, []);

  const checkAuthAndLoadBudget = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    await loadBudget(user.id);
  };

  const loadBudget = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // Get or create budget
      let { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (budgetError && budgetError.code !== 'PGRST116') throw budgetError;

      if (!budgetData) {
        // Create new budget
        const { data: newBudget, error: createError } = await supabase
          .from('budgets')
          .insert({
            user_id: userId,
            name: 'Wedding Budget',
            total_budget: 50000
          })
          .select()
          .single();

        if (createError) throw createError;
        budgetData = newBudget;
      }

      // Load budget items
      const { data: itemsData, error: itemsError } = await supabase
        .from('budget_items')
        .select('*')
        .eq('budget_id', budgetData.id)
        .order('category');

      if (itemsError) throw itemsError;

      setBudget({
        ...budgetData,
        items: (itemsData || []).map(item => ({ ...item, category: item.category || 'General' }))
      });
    } catch (error) {
      console.error('Error loading budget:', error);
      toast({
        title: "Error loading budget",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addBudgetItem = async () => {
    if (!budget || !newItem.category || !newItem.planned_amount) return;

    try {
      const { data, error } = await supabase
        .from('budget_items')
        .insert({
          budget_id: budget.id,
          category: newItem.category,
          planned_amount: parseFloat(newItem.planned_amount),
          actual_amount: parseFloat(newItem.actual_amount) || 0,
          notes: newItem.notes
        })
        .select()
        .single();

      if (error) throw error;

      setBudget(prev => prev ? {
        ...prev,
        items: [...prev.items, data]
      } : null);

      setNewItem({ category: '', planned_amount: '', actual_amount: '', notes: '' });
      setShowAddForm(false);

      toast({
        title: "Budget item added",
        description: "Your budget has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateBudgetItem = async (itemId: string, field: string, value: number) => {
    if (!budget) return;

    try {
      const { error } = await supabase
        .from('budget_items')
        .update({ [field]: value })
        .eq('id', itemId);

      if (error) throw error;

      setBudget(prev => prev ? {
        ...prev,
        items: prev.items.map(item => 
          item.id === itemId ? { ...item, [field]: value } : item
        )
      } : null);
    } catch (error: any) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteBudgetItem = async (itemId: string) => {
    if (!budget) return;

    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setBudget(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      } : null);

      toast({
        title: "Budget item deleted",
        description: "Item removed from your budget.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    if (!budget) return;

    const headers = ['Category', 'Planned Amount', 'Actual Amount', 'Difference', 'Notes'];
    const rows = budget.items.map(item => [
      item.category,
      `$${item.planned_amount.toFixed(2)}`,
      `$${item.actual_amount.toFixed(2)}`,
      `$${(item.actual_amount - item.planned_amount).toFixed(2)}`,
      item.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-budget.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Budget exported",
      description: "Your budget has been downloaded as CSV.",
    });
  };

  if (!currentUser || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  if (!budget) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Error loading budget</div>
    </div>;
  }

  const totalPlanned = budget.items.reduce((sum, item) => sum + item.planned_amount, 0);
  const totalActual = budget.items.reduce((sum, item) => sum + item.actual_amount, 0);
  const remaining = totalPlanned - totalActual;
  const progressPercentage = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-4">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Budget Tracker
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Wedding Budget
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Track your wedding expenses and stay on budget.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Link to="/account">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Budget Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Budget Summary */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold text-foreground mb-1">
                      ${totalPlanned.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">Total Planned</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold text-foreground mb-1">
                      ${totalActual.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6 text-center">
                    {remaining >= 0 ? (
                      <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    )}
                    <h3 className={`text-2xl font-semibold mb-1 ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(remaining).toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {remaining >= 0 ? 'Remaining' : 'Over Budget'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 relative">
                      <Progress value={Math.min(progressPercentage, 100)} className="w-full h-2 mt-6" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-1">
                      {progressPercentage.toFixed(0)}%
                    </h3>
                    <p className="text-sm text-muted-foreground">Budget Used</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Budget Items */}
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Budget Breakdown</CardTitle>
                  <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  
                  {/* Add New Item Form */}
                  {showAddForm && (
                    <div className="mb-6 p-4 bg-card border border-border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Category</Label>
                          <Input
                            placeholder="e.g. Venue"
                            value={newItem.category}
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Planned Amount</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={newItem.planned_amount}
                            onChange={(e) => setNewItem({...newItem, planned_amount: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Actual Amount</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={newItem.actual_amount}
                            onChange={(e) => setNewItem({...newItem, actual_amount: e.target.value})}
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <Button onClick={addBudgetItem} className="flex-1">
                            Add
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget Items List */}
                  <div className="space-y-4">
                    {budget.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-border rounded-lg">
                        <div className="font-medium text-foreground">
                          {item.category}
                        </div>
                        <div className="text-sm">
                          <Label className="text-xs text-muted-foreground">Planned</Label>
                          <Input
                            type="number"
                            value={item.planned_amount}
                            onChange={(e) => updateBudgetItem(item.id, 'planned_amount', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div className="text-sm">
                          <Label className="text-xs text-muted-foreground">Actual</Label>
                          <Input
                            type="number"
                            value={item.actual_amount}
                            onChange={(e) => updateBudgetItem(item.id, 'actual_amount', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div className="text-sm">
                          <Label className="text-xs text-muted-foreground">Difference</Label>
                          <div className={`mt-2 font-medium ${
                            (item.actual_amount - item.planned_amount) > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ${(item.actual_amount - item.planned_amount).toFixed(2)}
                          </div>
                        </div>
                        <div className="text-sm">
                          <Label className="text-xs text-muted-foreground">Progress</Label>
                          <div className="mt-2">
                            <Progress 
                              value={item.planned_amount > 0 ? (item.actual_amount / item.planned_amount) * 100 : 0}
                              className="w-full h-2"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteBudgetItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {budget.items.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No budget items yet. Click "Add Item" to get started.
                      </div>
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

export default AccountPlanningBudget;