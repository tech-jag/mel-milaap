"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckSquare,
  Calendar,
  Users,
  Camera,
  Music,
  Utensils,
  MapPin,
  Shirt,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/planning";
// Remove SEO imports and components temporarily

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  timeline: string;
  completed: boolean;
  optional?: boolean;
}

const defaultChecklistItems: Omit<ChecklistItem, 'id' | 'completed'>[] = [
  // 12+ Months Before
  { title: "Set your budget", category: "Budget", timeline: "12+ months", optional: false },
  { title: "Create guest list", category: "Planning", timeline: "12+ months", optional: false },
  { title: "Choose wedding date", category: "Planning", timeline: "12+ months", optional: false },
  { title: "Book ceremony venue", category: "Venue", timeline: "12+ months", optional: false },
  { title: "Book reception venue", category: "Venue", timeline: "12+ months", optional: false },
  
  // 9-12 Months Before
  { title: "Book photographer", category: "Vendors", timeline: "9-12 months", optional: false },
  { title: "Book videographer", category: "Vendors", timeline: "9-12 months", optional: true },
  { title: "Choose wedding party", category: "Planning", timeline: "9-12 months", optional: false },
  { title: "Book florist", category: "Vendors", timeline: "9-12 months", optional: false },
  { title: "Book caterer", category: "Vendors", timeline: "9-12 months", optional: false },
  
  // 6-9 Months Before
  { title: "Order wedding dress", category: "Attire", timeline: "6-9 months", optional: false },
  { title: "Order groom's suit", category: "Attire", timeline: "6-9 months", optional: false },
  { title: "Book entertainment/DJ", category: "Vendors", timeline: "6-9 months", optional: false },
  { title: "Book transport", category: "Logistics", timeline: "6-9 months", optional: false },
  { title: "Send save the dates", category: "Invitations", timeline: "6-9 months", optional: false },
  
  // 3-6 Months Before
  { title: "Order wedding invitations", category: "Invitations", timeline: "3-6 months", optional: false },
  { title: "Plan honeymoon", category: "Honeymoon", timeline: "3-6 months", optional: false },
  { title: "Register for gifts", category: "Gifts", timeline: "3-6 months", optional: false },
  { title: "Choose wedding cake", category: "Catering", timeline: "3-6 months", optional: false },
  { title: "Book hair and makeup", category: "Beauty", timeline: "3-6 months", optional: false },
  
  // 1-3 Months Before
  { title: "Send wedding invitations", category: "Invitations", timeline: "1-3 months", optional: false },
  { title: "Final venue walk-through", category: "Venue", timeline: "1-3 months", optional: false },
  { title: "Confirm vendor details", category: "Vendors", timeline: "1-3 months", optional: false },
  { title: "Wedding dress fittings", category: "Attire", timeline: "1-3 months", optional: false },
  { title: "Create seating plan", category: "Planning", timeline: "1-3 months", optional: false },
  
  // 1 Month Before
  { title: "Confirm guest count", category: "Planning", timeline: "1 month", optional: false },
  { title: "Prepare ceremony readings", category: "Ceremony", timeline: "1 month", optional: false },
  { title: "Break in wedding shoes", category: "Attire", timeline: "1 month", optional: false },
  { title: "Pack honeymoon bags", category: "Honeymoon", timeline: "1 month", optional: false },
  { title: "Prepare wedding favors", category: "Gifts", timeline: "1 month", optional: true },
  
  // 1 Week Before
  { title: "Rehearsal dinner", category: "Events", timeline: "1 week", optional: false },
  { title: "Confirm timeline with vendors", category: "Logistics", timeline: "1 week", optional: false },
  { title: "Prepare emergency kit", category: "Logistics", timeline: "1 week", optional: false },
  { title: "Get good night's sleep", category: "Self-care", timeline: "1 week", optional: false },
];

const PlanningChecklist = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [checklistItems, setChecklistItems] = React.useState<ChecklistItem[]>([]);

  React.useEffect(() => {
    checkAuthAndLoadChecklist();
  }, []);

  const checkAuthAndLoadChecklist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setCurrentUser(user);
    await loadChecklist(user.id);
  };

  const loadChecklist = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // For now, use localStorage to persist checklist state
      // In a full implementation, this would be stored in the database
      const saved = localStorage.getItem(`checklist_${userId}`);
      
      if (saved) {
        setChecklistItems(JSON.parse(saved));
      } else {
        // Initialize with default items
        const initialized = defaultChecklistItems.map(item => ({
          ...item,
          id: `${Date.now()}_${Math.random()}`,
          completed: false
        }));
        setChecklistItems(initialized);
        localStorage.setItem(`checklist_${userId}`, JSON.stringify(initialized));
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
      toast({
        title: "Error loading checklist",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = async (itemId: string) => {
    if (!currentUser) return;

    const updatedItems = checklistItems.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    setChecklistItems(updatedItems);
    localStorage.setItem(`checklist_${currentUser.id}`, JSON.stringify(updatedItems));

    const item = updatedItems.find(i => i.id === itemId);
    if (item?.completed) {
      await trackEvent('checklist_item_completed', { title: item.title, category: item.category });
    }

    toast({
      title: item?.completed ? "Task completed!" : "Task unmarked",
      description: item?.title,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'venue': return MapPin;
      case 'vendors': return Users;
      case 'attire': return Shirt;
      case 'catering': return Utensils;
      case 'beauty': return Camera;
      case 'logistics': return Calendar;
      default: return CheckSquare;
    }
  };

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading checklist...</div>
      </div>
    );
  }

  const timelineGroups = [
    '12+ months',
    '9-12 months', 
    '6-9 months',
    '3-6 months',
    '1-3 months',
    '1 month',
    '1 week'
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
                  Wedding Checklist
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Wedding Planning Checklist
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Stay organized with our comprehensive wedding planning checklist.
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

            {/* Progress Overview */}
            <motion.div variants={fadeInUp} className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Overall Progress</h3>
                    <span className="text-2xl font-bold text-primary">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {totalCount} tasks completed
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Checklist Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {timelineGroups.map((timeline) => {
              const timelineItems = checklistItems.filter(item => item.timeline === timeline);
              if (timelineItems.length === 0) return null;

              const completedInGroup = timelineItems.filter(item => item.completed).length;
              const groupProgress = (completedInGroup / timelineItems.length) * 100;

              return (
                <motion.div
                  key={timeline}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {timeline === '12+ months' ? '12+ Months Before' :
                           timeline === '9-12 months' ? '9-12 Months Before' :
                           timeline === '6-9 months' ? '6-9 Months Before' :
                           timeline === '3-6 months' ? '3-6 Months Before' :
                           timeline === '1-3 months' ? '1-3 Months Before' :
                           timeline === '1 month' ? '1 Month Before' :
                           '1 Week Before'}
                        </CardTitle>
                        <Badge variant="outline">
                          {completedInGroup}/{timelineItems.length}
                        </Badge>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${groupProgress}%` }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {timelineItems.map((item) => {
                          const CategoryIcon = getCategoryIcon(item.category);
                          
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                                item.completed 
                                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                  : 'border-border hover:bg-accent'
                              }`}
                            >
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={() => toggleItem(item.id)}
                                className="shrink-0"
                              />
                              
                              <CategoryIcon className={`w-4 h-4 shrink-0 ${
                                item.completed ? 'text-green-600' : 'text-muted-foreground'
                              }`} />
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${
                                    item.completed 
                                      ? 'line-through text-muted-foreground' 
                                      : 'text-foreground'
                                  }`}>
                                    {item.title}
                                  </span>
                                  {item.optional && (
                                    <Badge variant="secondary" className="text-xs">
                                      Optional
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {item.category}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanningChecklist;