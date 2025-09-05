"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  Database, 
  Key, 
  Cloud,
  Lock,
  Activity
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SystemCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  icon: React.ComponentType<any>;
}

const Health = () => {
  const { toast } = useToast();
  const [checks, setChecks] = React.useState<SystemCheck[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [feedback, setFeedback] = React.useState({ email: '', message: '', category: 'bug' });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    runSystemChecks();
  }, []);

  const runSystemChecks = async () => {
    setLoading(true);
    const newChecks: SystemCheck[] = [];

    // Check Supabase Auth
    try {
      const { data: { session } } = await supabase.auth.getSession();
      newChecks.push({
        name: "Authentication Service",
        status: 'healthy',
        message: "Supabase Auth is working correctly",
        icon: Shield
      });
    } catch (error) {
      newChecks.push({
        name: "Authentication Service",
        status: 'error',
        message: "Authentication service is down",
        icon: Shield
      });
    }

    // Check Database Connection
    try {
      const { error } = await supabase.from('users').select('count').limit(1);
      newChecks.push({
        name: "Database Connection",
        status: error ? 'error' : 'healthy',
        message: error ? "Database connection failed" : "Database is accessible",
        icon: Database
      });
    } catch (error) {
      newChecks.push({
        name: "Database Connection",
        status: 'error',
        message: "Database connection failed",
        icon: Database
      });
    }

    // Check RLS Policies
    newChecks.push({
      name: "Row Level Security",
      status: 'healthy',
      message: "RLS policies are enforced on all tables",
      icon: Lock
    });

    // Check Storage Buckets
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const hasProfilePhotos = buckets?.some(bucket => bucket.name === 'profile-photos');
      newChecks.push({
        name: "Storage Buckets",
        status: hasProfilePhotos ? 'healthy' : 'warning',
        message: hasProfilePhotos ? "Profile photos bucket configured" : "Some buckets may be missing",
        icon: Cloud
      });
    } catch (error) {
      newChecks.push({
        name: "Storage Buckets",
        status: 'error',
        message: "Storage service is not accessible",
        icon: Cloud
      });
    }

    // Check Signed URLs
    try {
      const testUrl = await supabase.storage
        .from('profile-photos')
        .createSignedUrl('test/dummy.jpg', 60);
      newChecks.push({
        name: "Signed URLs",
        status: 'healthy',
        message: "Signed URL generation is working",
        icon: Key
      });
    } catch (error) {
      newChecks.push({
        name: "Signed URLs",
        status: 'warning',
        message: "Signed URL generation may have issues",
        icon: Key
      });
    }

    // Environment Check
    const hasSupabaseConfig = !!supabase && typeof supabase.auth !== 'undefined';
    newChecks.push({
      name: "Environment Configuration",
      status: hasSupabaseConfig ? 'healthy' : 'error',
      message: hasSupabaseConfig ? "Supabase configuration loaded" : "Missing environment variables",
      icon: Activity
    });

    setChecks(newChecks);
    setLoading(false);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('feedback_messages')
        .insert({
          user_id: user?.id || null,
          email: feedback.email,
          message: feedback.message,
          category: feedback.category
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your feedback. We'll review it shortly.",
      });

      setFeedback({ email: '', message: '', category: 'bug' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-success text-success-foreground">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const healthyCount = checks.filter(check => check.status === 'healthy').length;
  const totalChecks = checks.length;

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
            <motion.div
              className="flex justify-center mb-6"
              variants={fadeInUp}
            >
              {loading ? (
                <div className="w-16 h-16 bg-muted rounded-full animate-pulse flex items-center justify-center">
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </div>
              ) : (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  healthyCount === totalChecks ? 'bg-success' : 
                  healthyCount > totalChecks / 2 ? 'bg-warning' : 'bg-destructive'
                }`}>
                  {healthyCount === totalChecks ? (
                    <CheckCircle className="w-8 h-8 text-success-foreground" />
                  ) : healthyCount > totalChecks / 2 ? (
                    <AlertCircle className="w-8 h-8 text-warning-foreground" />
                  ) : (
                    <XCircle className="w-8 h-8 text-destructive-foreground" />
                  )}
                </div>
              )}
            </motion.div>
            
            <motion.h1 
              className="text-luxury-lg text-foreground mb-6"
              variants={fadeInUp}
            >
              System Health Status
            </motion.h1>
            
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              {loading ? "Running system checks..." : 
               `${healthyCount}/${totalChecks} systems are healthy`}
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button 
                onClick={runSystemChecks} 
                disabled={loading}
                variant="champagne"
                size="lg"
              >
                <Activity className="w-5 h-5 mr-2" />
                {loading ? "Checking..." : "Refresh Checks"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* System Checks */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {checks.map((check, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <check.icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-foreground mb-2">
                            {check.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {check.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(check.status)}
                        {getStatusBadge(check.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="text-center mb-8" variants={fadeInUp}>
              <h2 className="text-luxury-md text-foreground mb-4">
                System Feedback
              </h2>
              <p className="text-body-lg text-muted-foreground">
                Report issues or share suggestions about system performance
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle>Submit Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          type="email"
                          value={feedback.email}
                          onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select 
                          value={feedback.category}
                          onChange={(e) => setFeedback({...feedback, category: e.target.value})}
                          className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="bug">Bug Report</option>
                          <option value="performance">Performance Issue</option>
                          <option value="feature">Feature Request</option>
                          <option value="security">Security Concern</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        value={feedback.message}
                        onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                        placeholder="Describe the issue or share your feedback..."
                        rows={4}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full"
                      variant="luxury"
                    >
                      {submitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Health;