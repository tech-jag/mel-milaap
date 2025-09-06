"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Users, 
  Calendar,
  MapPin,
  CheckCircle,
  ArrowRight,
  Lock,
  Star,
  Clock
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const tools = [
  {
    id: 1,
    title: "Budget Tracker",
    description: "Track wedding expenses and stay within budget with detailed categorization and reporting.",
    icon: Calculator,
    features: ["Expense categorization", "Real-time budget tracking", "Vendor payment scheduling", "Cost comparison tools"],
    premium: false,
    href: "/account/planning/budget"
  },
  {
    id: 2,
    title: "Guest List Manager",
    description: "Organize your guest list, track RSVPs, and manage seating arrangements effortlessly.",
    icon: Users,
    features: ["RSVP tracking", "Dietary requirements", "Seating arrangement", "Guest communications"],
    premium: false,
    href: "/account/planning/guests"
  },
  {
    id: 3,
    title: "Wedding Timeline",
    description: "Create detailed timelines for your wedding day and all pre-wedding events.",
    icon: Calendar,
    features: ["Day-of timeline", "Vendor coordination", "Task assignments", "Timeline sharing"],
    premium: true,
    href: "/account/planning/timeline"
  },
  {
    id: 4,
    title: "Venue Finder",
    description: "Discover and compare wedding venues with detailed information and virtual tours.",
    icon: MapPin,
    features: ["Venue comparison", "Availability checker", "Virtual tours", "Booking management"],
    premium: true,
    href: "/suppliers?category=venues"
  },
  {
    id: 5,
    title: "To-Do List",
    description: "Stay organized with comprehensive wedding planning checklists and task management.",
    icon: CheckCircle,
    features: ["Custom checklists", "Task prioritization", "Progress tracking", "Reminder notifications"],
    premium: false,
    href: "/account/planning/todo"
  },
  {
    id: 6, 
    title: "Seating Planner",
    description: "Design optimal seating arrangements for your reception with drag-and-drop interface.",
    icon: Users,
    features: ["Visual seating charts", "Table assignments", "Guest preferences", "Layout templates"],
    premium: true,
    href: "/account/planning/seating"
  }
];

const Tools = () => {
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    setIsLoading(false);
  };

  const LoginPrompt = () => (
    <Card className="luxury-card">
      <CardContent className="p-8 text-center">
        <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
        <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
          Sign in to Access Planning Tools
        </h3>
        <p className="text-muted-foreground mb-6">
          Create an account or sign in to start planning your dream wedding with our comprehensive tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth/signup">
            <Button variant="luxury" size="lg">
              Create Account
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-luxury-lg text-foreground mb-6"
              variants={fadeInUp}
            >
              Wedding Planning Tools
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Everything you need to plan your perfect wedding, from budget tracking to guest management
            </motion.p>
            {currentUser && (
              <motion.div variants={fadeInUp}>
                <Link to="/account">
                  <Button variant="luxury" size="lg">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {!currentUser && (
            <motion.div
              className="mb-12"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <LoginPrompt />
            </motion.div>
          )}

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isAccessible = currentUser || !tool.premium;
              
              return (
                <motion.div
                  key={tool.id}
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className={`luxury-card h-full ${!isAccessible ? 'opacity-75' : ''}`}>
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <div className="flex gap-2">
                          {tool.premium && (
                            <Badge className="bg-accent text-accent-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                        {tool.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="space-y-2 mb-8">
                        {tool.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                        {tool.features.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{tool.features.length - 3} more features
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        {isAccessible ? (
                          <Link to={tool.href}>
                            <Button variant="luxury" className="w-full">
                              {currentUser ? 'Open Tool' : 'Try Free'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            <Lock className="w-4 h-4 mr-2" />
                            Sign in Required
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-luxury-md text-foreground mb-6"
              variants={fadeInUp}
            >
              Why Choose Our Planning Tools?
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Designed specifically for South Asian weddings with cultural traditions in mind
            </motion.p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerChildren}
            >
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Time-Saving</h3>
                <p className="text-muted-foreground">Streamline your planning process with automated tools and templates</p>
              </motion.div>
              
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Collaborative</h3>
                <p className="text-muted-foreground">Share planning access with family members and wedding party</p>
              </motion.div>
              
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Expert-Designed</h3>
                <p className="text-muted-foreground">Built by wedding planning experts who understand your needs</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tools;