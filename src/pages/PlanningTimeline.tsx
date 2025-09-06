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
import { 
  Calendar,
  PlusCircle, 
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getTimelineItems, trackEvent } from "@/lib/planning";
import type { TimelineItem } from "@/lib/planning";
import { SEOHead } from "@/utils/seo";

const PlanningTimeline = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [timelineItems, setTimelineItems] = React.useState<TimelineItem[]>([]);
  const [newItem, setNewItem] = React.useState({
    title: '',
    due_on: '',
    status: 'todo' as 'todo' | 'doing' | 'done'
  });
  const [showAddForm, setShowAddForm] = React.useState(false);

  React.useEffect(() => {
    checkAuthAndLoadTimeline();
  }, []);

  const checkAuthAndLoadTimeline = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setCurrentUser(user);
    await loadTimeline(user.id);
  };

  const loadTimeline = async (userId: string) => {
    setIsLoading(true);
    
    try {
      const items = await getTimelineItems(userId);
      setTimelineItems(items);
    } catch (error) {
      console.error('Error loading timeline:', error);
      toast({
        title: "Error loading timeline",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTimelineItem = async () => {
    if (!currentUser || !newItem.title || !newItem.due_on) return;

    try {
      const { data, error } = await supabase
        .from('wedding_timeline_items')
        .insert({
          user_id: currentUser.id,
          title: newItem.title,
          due_on: newItem.due_on,
          status: newItem.status,
          sort_order: timelineItems.length
        })
        .select()
        .single();

      if (error) throw error;

      setTimelineItems(prev => [...prev, data]);
      setNewItem({ title: '', due_on: '', status: 'todo' });
      setShowAddForm(false);

      await trackEvent('timeline_item_added', { title: newItem.title });

      toast({
        title: "Timeline item added",
        description: "Your timeline has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateItemStatus = async (itemId: string, status: 'todo' | 'doing' | 'done') => {
    try {
      const { error } = await supabase
        .from('wedding_timeline_items')
        .update({ status })
        .eq('id', itemId);

      if (error) throw error;

      setTimelineItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, status } : item
        )
      );

      if (status === 'done') {
        await trackEvent('timeline_item_done', { itemId });
      }

      toast({
        title: "Status updated",
        description: `Task marked as ${status}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteTimelineItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wedding_timeline_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setTimelineItems(prev => prev.filter(item => item.id !== itemId));

      toast({
        title: "Timeline item deleted",
        description: "Item removed from your timeline.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-600';
      case 'doing': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return CheckCircle2;
      case 'doing': return Clock;
      default: return Circle;
    }
  };

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading timeline...</div>
      </div>
    );
  }

  const todoItems = timelineItems.filter(item => item.status === 'todo');
  const doingItems = timelineItems.filter(item => item.status === 'doing');
  const doneItems = timelineItems.filter(item => item.status === 'done');
  const totalProgress = timelineItems.length > 0 ? (doneItems.length / timelineItems.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {generateSEOTags({ 
        title: "Wedding Timeline - Mēl Milaap",
        description: "Stay on track with your wedding timeline. Organize tasks, set deadlines, and monitor progress."
      })}
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
                  <Calendar className="w-4 h-4 mr-2" />
                  Wedding Timeline
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Wedding Planning Timeline
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Stay organized with your wedding planning milestones and deadlines.
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/planning">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Planning
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Progress Overview */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Circle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold mb-1">{todoItems.length}</h3>
                    <p className="text-sm text-muted-foreground">To Do</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold mb-1">{doingItems.length}</h3>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold mb-1">{doneItems.length}</h3>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold mb-1">{Math.round(totalProgress)}%</h3>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Timeline Management */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Timeline Tasks</CardTitle>
                  <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </CardHeader>
                <CardContent>
                  
                  {/* Add New Task Form */}
                  {showAddForm && (
                    <div className="mb-6 p-4 bg-card border border-border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Task Title</Label>
                          <Input
                            placeholder="e.g. Book venue"
                            value={newItem.title}
                            onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <Input
                            type="date"
                            value={newItem.due_on}
                            onChange={(e) => setNewItem({...newItem, due_on: e.target.value})}
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <Button onClick={addTimelineItem} className="flex-1">
                            Add Task
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline Items List */}
                  <div className="space-y-4">
                    {timelineItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No timeline tasks yet. Click "Add Task" to get started.
                      </div>
                    ) : (
                      timelineItems
                        .sort((a, b) => new Date(a.due_on).getTime() - new Date(b.due_on).getTime())
                        .map((item) => {
                          const StatusIcon = getStatusIcon(item.status);
                          const isOverdue = new Date(item.due_on) < new Date() && item.status !== 'done';
                          
                          return (
                            <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                              <button
                                onClick={() => {
                                  const nextStatus = item.status === 'todo' ? 'doing' : 
                                                   item.status === 'doing' ? 'done' : 'todo';
                                  updateItemStatus(item.id, nextStatus);
                                }}
                                className={`${getStatusColor(item.status)} hover:opacity-70 transition-opacity`}
                              >
                                <StatusIcon className="w-6 h-6" />
                              </button>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-medium ${item.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {item.title}
                                  </h4>
                                  <Badge 
                                    variant={
                                      item.status === 'done' ? 'default' :
                                      item.status === 'doing' ? 'secondary' : 
                                      isOverdue ? 'destructive' : 'outline'
                                    }
                                  >
                                    {isOverdue && item.status !== 'done' ? 'Overdue' : item.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Due: {new Date(item.due_on).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => deleteTimelineItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })
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

export default PlanningTimeline;