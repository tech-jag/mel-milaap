"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { FileText, Shield, Users, Heart, Camera } from "lucide-react";

interface TermsSection {
  title: string;
  content: string;
}

interface TermsData {
  sections: TermsSection[];
}

const TermsOfService = () => {
  const { user } = useAuth();
  const [termsData, setTermsData] = React.useState<TermsData | null>(null);
  const [accepted, setAccepted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasAccepted, setHasAccepted] = React.useState(false);

  React.useEffect(() => {
    loadTermsData();
    if (user) {
      checkAcceptanceStatus();
    }
  }, [user]);

  const loadTermsData = async () => {
    try {
      const { data, error } = await supabase
        .from('terms_of_service')
        .select('content')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (data?.content) {
        setTermsData(data.content as unknown as TermsData);
      }
    } catch (error) {
      console.error('Error loading terms:', error);
      // Fallback to hardcoded terms
      setTermsData({
        sections: [
          {
            title: "Acceptance of Terms",
            content: "By accessing and using Mēl Milaap, you accept and agree to be bound by these terms."
          },
          {
            title: "Service Description", 
            content: "Mēl Milaap is a matrimonial platform designed to help individuals find compatible life partners."
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAcceptanceStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_terms_acceptance')
        .select('*')
        .eq('user_id', user.id)
        .eq('terms_version', '2.0')
        .single();

      if (data) {
        setHasAccepted(true);
      }
    } catch (error) {
      // User hasn't accepted terms yet
    }
  };

  const handleAcceptTerms = async () => {
    if (!user || !accepted) return;

    try {
      const { error } = await supabase
        .from('user_terms_acceptance')
        .insert({
          user_id: user.id,
          terms_version: '2.0',
          ip_address: '0.0.0.0', // Would be actual IP in production
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      setHasAccepted(true);
      toast({
        title: "Terms Accepted",
        description: "Thank you for accepting our Terms of Service.",
      });
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast({
        title: "Error",
        description: "Failed to record acceptance. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading Terms of Service...</p>
        </div>
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
            className="text-center max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                Terms of Service
              </h1>
            </motion.div>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-4"
              variants={fadeInUp}
            >
              Comprehensive terms governing your use of Mēl Milaap matrimonial platform
            </motion.p>
            <motion.p 
              className="text-sm text-muted-foreground"
              variants={fadeInUp}
            >
              Last updated: January 2024 • Version 2.0
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Key Highlights */}
            <motion.div variants={fadeInUp} className="mb-12">
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-6 flex items-center">
                    <Shield className="h-6 w-6 text-primary mr-2" />
                    Key Highlights
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-red-500 mt-1" />
                        <div>
                          <h3 className="font-semibold">Matrimonial Focus</h3>
                          <p className="text-sm text-muted-foreground">Platform dedicated to finding life partners</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Camera className="h-5 w-5 text-blue-500 mt-1" />
                        <div>
                          <h3 className="font-semibold">Photo Protection</h3>
                          <p className="text-sm text-muted-foreground">Advanced photo security and privacy controls</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-green-500 mt-1" />
                        <div>
                          <h3 className="font-semibold">Family Access</h3>
                          <p className="text-sm text-muted-foreground">Secure family member involvement system</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-purple-500 mt-1" />
                        <div>
                          <h3 className="font-semibold">Enterprise Security</h3>
                          <p className="text-sm text-muted-foreground">Bank-grade security and data protection</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {termsData?.sections.map((section, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="luxury-card">
                    <CardContent className="p-8">
                      <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {section.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Acceptance Section for Logged-in Users */}
            {user && !hasAccepted && (
              <motion.div variants={fadeInUp} className="mt-12">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-4">Accept Terms of Service</h3>
                    <div className="flex items-start space-x-3 mb-6">
                      <Checkbox
                        id="accept-terms"
                        checked={accepted}
                        onCheckedChange={(checked) => setAccepted(checked === true)}
                      />
                      <label
                        htmlFor="accept-terms"
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        I have read, understood, and agree to be bound by these Terms of Service. 
                        I understand that this is a matrimonial platform focused on helping me find a life partner.
                      </label>
                    </div>
                    <Button
                      onClick={handleAcceptTerms}
                      disabled={!accepted}
                      className="w-full md:w-auto"
                    >
                      Accept Terms and Continue
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Contact Information */}
            <motion.div variants={fadeInUp} className="mt-12">
              <Card className="bg-muted/50">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold mb-4">Questions About These Terms?</h3>
                  <p className="text-muted-foreground mb-6">
                    Our legal team is here to help clarify any questions you may have about our Terms of Service.
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Button variant="outline" asChild>
                      <a href="mailto:legal@melmilaap.com">
                        Email Legal Team
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/contact">
                        Contact Support
                      </a>
                    </Button>
                  </div>
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

export default TermsOfService;