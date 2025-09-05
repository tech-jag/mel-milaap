"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Trash2, 
  Filter,
  CheckSquare,
  Clock,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  category?: string;
  priority: string; // Changed from union to string to match database
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

const TodoManager = () => {
  const { toast } = useToast();
  const [todos, setTodos] = React.useState<TodoItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  
  const [newTodo, setNewTodo] = React.useState({
    title: '',
    description: '',
    due_date: undefined as Date | undefined,
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const categories = [
    { value: 'general', label: 'General', color: 'bg-gray-100' },
    { value: 'venue', label: 'Venue', color: 'bg-blue-100' },
    { value: 'catering', label: 'Catering', color: 'bg-green-100' },
    { value: 'photography', label: 'Photography', color: 'bg-purple-100' },
    { value: 'attire', label: 'Attire', color: 'bg-pink-100' },
    { value: 'decorations', label: 'Decorations', color: 'bg-yellow-100' },
    { value: 'music', label: 'Music & Entertainment', color: 'bg-indigo-100' },
    { value: 'paperwork', label: 'Paperwork', color: 'bg-red-100' }
  ];

  React.useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todo_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load todo items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todo_items')
        .insert({
          user_id: user.id,
          title: newTodo.title,
          description: newTodo.description || null,
          due_date: newTodo.due_date ? format(newTodo.due_date, 'yyyy-MM-dd') : null,
          category: newTodo.category,
          priority: newTodo.priority
        })
        .select()
        .single();

      if (error) throw error;

      setTodos([data, ...todos]);
      setNewTodo({
        title: '',
        description: '',
        due_date: undefined,
        category: 'general',
        priority: 'medium'
      });
      setShowForm(false);

      toast({
        title: "Todo Added!",
        description: "Your todo item has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add todo item",
        variant: "destructive"
      });
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todo_items')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));

      toast({
        title: completed ? "Task Completed!" : "Task Reopened",
        description: completed ? "Great progress on your wedding planning!" : "Task marked as pending",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update todo item",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todo_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));

      toast({
        title: "Todo Deleted",
        description: "Todo item has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete todo item",
        variant: "destructive"
      });
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckSquare className="w-4 h-4" />;
      default: return <CheckSquare className="w-4 h-4" />;
    }
  };

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card className="luxury-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Wedding Tasks</CardTitle>
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({todos.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending ({todos.filter(t => !t.completed).length})
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed ({todos.filter(t => t.completed).length})
              </Button>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1 rounded-lg border border-border bg-background text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </CardHeader>
      </Card>

      {/* Add Todo Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addTodo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Task Title *</label>
                    <Input
                      value={newTodo.title}
                      onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                      placeholder="e.g., Book wedding venue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newTodo.category}
                      onChange={(e) => setNewTodo({...newTodo, category: e.target.value})}
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                    placeholder="Additional details about this task..."
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newTodo.due_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTodo.due_date ? format(newTodo.due_date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newTodo.due_date}
                          onSelect={(date) => setNewTodo({...newTodo, due_date: date})}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={newTodo.priority}
                      onChange={(e) => setNewTodo({...newTodo, priority: e.target.value as any})}
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" variant="luxury">Add Task</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Todo List */}
      <motion.div
        className="space-y-4"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        {filteredTodos.length === 0 ? (
          <Card className="luxury-card">
            <CardContent className="p-8 text-center">
              <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "Start by adding your first wedding planning task!"
                  : `You don't have any ${filter} tasks at the moment.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTodos.map((todo) => (
            <motion.div key={todo.id} variants={fadeInUp}>
              <Card className={`luxury-card transition-all ${todo.completed ? 'opacity-75' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={(checked) => toggleTodo(todo.id, !!checked)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-semibold ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {todo.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {todo.description && (
                        <p className="text-sm text-muted-foreground">
                          {todo.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        {todo.category && (
                          <Badge className={`${getCategoryStyle(todo.category)} text-foreground border-0`}>
                            {categories.find(c => c.value === todo.category)?.label}
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className={`${getPriorityColor(todo.priority)} border-current`}>
                          {getPriorityIcon(todo.priority)}
                          <span className="ml-1 capitalize">{todo.priority}</span>
                        </Badge>
                        
                        {todo.due_date && (
                          <Badge variant="outline" className="text-muted-foreground">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {format(new Date(todo.due_date), "MMM d")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default TodoManager;