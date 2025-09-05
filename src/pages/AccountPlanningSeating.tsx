"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TableProperties,
  PlusCircle,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { supabase } from "@/integrations/supabase/client";

const AccountPlanningSeating = () => {
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
                  <TableProperties className="w-4 h-4 mr-2" />
                  Seating Planner
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Wedding Seating Chart
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Plan your reception seating arrangements.
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

      {/* Seating Planner */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Coming Soon Notice */}
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardContent className="p-8 text-center">
                  <TableProperties className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    Interactive Seating Planner
                  </h3>
                  <p className="text-body-lg text-muted-foreground mb-6">
                    Our advanced seating chart tool is coming soon! Create beautiful seating arrangements, 
                    drag and drop guests between tables, and visualize your reception layout.
                  </p>
                  <Badge variant="secondary" className="mb-6">Coming Soon</Badge>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground mb-2">Guest Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Import guests from your guest list and assign them to tables
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <TableProperties className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground mb-2">Table Layouts</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose from various table shapes and sizes for your venue
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Settings className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground mb-2">Drag & Drop</h4>
                      <p className="text-sm text-muted-foreground">
                        Easily rearrange seating with intuitive drag and drop
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Placeholder Tables */}
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle>Sample Table Layout</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={i} className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <TableProperties className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <h4 className="font-medium text-foreground mb-1">Table {i + 1}</h4>
                        <p className="text-sm text-muted-foreground">8 seats available</p>
                        <Button variant="outline" size="sm" className="mt-3" disabled>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Assign Guests
                        </Button>
                      </div>
                    ))}
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

export default AccountPlanningSeating;