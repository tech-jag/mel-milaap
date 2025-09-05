"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  CheckSquare,
  Heart,
  Camera,
  Music,
  MapPin,
  Cake,
  ArrowRight,
  Star,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { supabase } from "@/integrations/supabase/client";

const planningCategories = [
  {
    title: "Budget Management",
    description: "Track expenses and stay within budget",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-50",
    link: "/account/planning/budget",
    progress: 65
  },
  {
    title: "Guest List",
    description: "Manage invitations and RSVPs",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    link: "/account/planning/guests",
    progress: 80
  },
  {
    title: "To-Do Checklist",
    description: "Never miss an important task",
    icon: CheckSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    link: "/account/planning/todo",
    progress: 45
  },
  {
    title: "Venue & Suppliers",
    description: "Find and book wedding services",
    icon: MapPin,
    color: "text-accent",
    bgColor: "bg-accent/10",
    link: "/suppliers",
    progress: 30
  },
  {
    title: "Timeline Planning",
    description: "Plan your wedding day schedule",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    link: "/account/planning/timeline",
    progress: 20
  },
  {
    title: "Style & Theme",
    description: "Define your wedding aesthetics",
    icon: Star,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    link: "/account/planning/style",
    progress: 55
  }
];

const weddingServices = [
  { name: "Venues", icon: MapPin, count: "150+ options" },
  { name: "Photography", icon: Camera, count: "200+ photographers" },
  { name: "Catering", icon: Cake, count: "80+ caterers" },
  { name: "Music & DJ", icon: Music, count: "120+ entertainers" },
  { name: "Flowers", icon: Heart, count: "90+ florists" },
  { name: "Decorations", icon: Star, count: "110+ decorators" }
];

const WeddingPlanning = () => {
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [weddingDate, setWeddingDate] = React.useState<Date | null>(null);
  const [overallProgress, setOverallProgress] = React.useState(0);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    
    // Calculate overall progress
    const totalProgress = planningCategories.reduce((sum, category) => sum + category.progress, 0);
    setOverallProgress(Math.round(totalProgress / planningCategories.length));
    
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-luxury-lg text-foreground mb-6"
              variants={fadeInUp}
            >
              Wedding Planning Made Simple
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Organize every detail of your dream wedding with our comprehensive planning tools
            </motion.p>
            
            {currentUser && (
              <motion.div variants={fadeInUp} className="mb-8">
                <Card className="max-w-md mx-auto luxury-card">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-foreground mb-2">Your Wedding Progress</h3>
                    <div className="space-y-3">
                      <Progress value={overallProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground">
                        {overallProgress}% Complete
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {currentUser ? (
                <Button variant="luxury" size="lg" asChild>
                  <Link to="/account">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="luxury" size="lg" asChild>
                    <Link to="/auth/signup">Start Planning</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/suppliers">Browse Suppliers</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Planning Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-md text-foreground mb-6">
              Everything You Need to Plan Your Perfect Day
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              From budget management to guest coordination, our tools help you stay organized
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {planningCategories.map((category, index) => (
              <motion.div
                key={category.title}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link to={category.link}>
                  <Card className="luxury-card h-full hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                          <category.icon className={`w-6 h-6 ${category.color}`} />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      
                      {currentUser && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{category.progress}%</span>
                          </div>
                          <Progress value={category.progress} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Wedding Services */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-md text-foreground mb-6">
              Trusted Wedding Suppliers
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with verified suppliers across Australia and New Zealand
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {weddingServices.map((service) => (
              <motion.div
                key={service.name}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <Card className="luxury-card text-center cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {service.count}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Button variant="luxury" size="lg" asChild>
              <Link to="/suppliers">
                Browse All Suppliers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-luxury-md text-foreground mb-6"
              variants={fadeInUp}
            >
              Ready to Start Planning?
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Join thousands of couples who have planned their perfect wedding with our tools
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <Link to="/auth/signup">Create Account</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WeddingPlanning;