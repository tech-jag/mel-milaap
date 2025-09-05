"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  CheckSquare, 
  PlusCircle, 
  Calendar,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  due_date?: string;
}

const AccountPlanningTodo = () => {
  const { toast } = useToast();
  const [todos, setTodos] = React.useState<TodoItem[]>([
    { id: '1', task: 'Book ceremony venue', completed: false, priority: 'high', category: 'Venue' },
    { id: '2', task: 'Send save the dates', completed: true, priority: 'high', category: 'Invitations' },
    { id: '3', task: 'Order wedding cake', completed: false, priority: 'medium', category: 'Catering' },
    { id: '4', task: 'Book photographer', completed: false, priority: 'high', category: 'Photography' },
    { id: '5', task: 'Choose flowers', completed: false, priority: 'low', category: 'Decorations' },
  ]);
  const [newTask, setNewTask] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    setIsLoading(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    
    toast({
      title: "Task updated",
      description: "Task status has been updated.",
    });
  };

  const addTodo = () => {
    if (!newTask.trim()) return;
    
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      task: newTask,
      completed: false,
      priority: 'medium',
      category: 'General'
    };
    
    setTodos(prev => [...prev, newTodo]);
    setNewTask('');
    
    toast({
      title: "Task added",
      description: "New task has been added to your list.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!currentUser || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

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
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Wedding Todo List
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Planning Checklist
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Keep track of your wedding planning tasks and progress.
                </p>
              </div>
              <Link to="/account">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Todo List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Progress Overview */}
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Progress Overview</h3>
                    <Badge variant="secondary">
                      {completedCount} of {totalCount} completed
                    </Badge>
                  </div>
                  <div className="w-full bg-border rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round(progress)}% complete
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Add New Task */}
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle>Add New Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter a new wedding task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    />
                    <Button onClick={addTodo}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Todo Items */}
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle>Wedding Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todos.map((todo) => (
                      <div 
                        key={todo.id} 
                        className={`flex items-center justify-between p-4 border border-border rounded-lg ${
                          todo.completed ? 'bg-muted/50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                          />
                          <div>
                            <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {todo.task}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {todo.category}
                              </Badge>
                              <div className={`flex items-center gap-1 text-xs ${getPriorityColor(todo.priority)}`}>
                                <AlertTriangle className="w-3 h-3" />
                                {todo.priority}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {todos.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No tasks yet. Add your first wedding planning task above.
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

export default AccountPlanningTodo;