"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Download, Trash2, Eye, Mail } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const DataRights = () => {
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
              Your Data Rights
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground"
              variants={fadeInUp}
            >
              Understanding and exercising your privacy rights with Mēl Milaap
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Data Rights Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" variants={fadeInUp}>
              <Card className="luxury-card">
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Access Your Data
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Request a copy of all personal data we have about you, including profile information, messages, and activity logs.
                  </p>
                  <Button variant="luxury" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Request Data Export
                  </Button>
                </CardContent>
              </Card>

              <Card className="luxury-card">
                <CardContent className="p-8 text-center">
                  <Trash2 className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Delete Your Data
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Request permanent deletion of your account and all associated personal data from our systems.
                  </p>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Request Data Deletion
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <Card className="luxury-card">
              <CardContent className="p-8 space-y-8">
                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    <Shield className="w-6 h-6 inline mr-2" />
                    Your Privacy Rights
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Under Australian Privacy Principles and New Zealand Privacy Act, you have the following rights regarding your personal information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Right to Access</h4>
                      <p className="text-sm text-muted-foreground">You can request access to your personal information we hold.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Right to Correction</h4>
                      <p className="text-sm text-muted-foreground">You can request correction of inaccurate personal information.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Right to Deletion</h4>
                      <p className="text-sm text-muted-foreground">You can request deletion of your personal information in certain circumstances.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Right to Portability</h4>
                      <p className="text-sm text-muted-foreground">You can request a copy of your data in a structured format.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    How to Exercise Your Rights
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-accent/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">1. Submit a Request</h4>
                      <p className="text-sm text-muted-foreground">Contact us using the form below or email privacy@melmilaap.com with your request.</p>
                    </div>
                    <div className="bg-accent/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">2. Identity Verification</h4>
                      <p className="text-sm text-muted-foreground">We'll verify your identity to protect your privacy and security.</p>
                    </div>
                    <div className="bg-accent/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">3. Request Processing</h4>
                      <p className="text-sm text-muted-foreground">We'll process your request within 30 days and provide updates as needed.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Contact Our Privacy Team
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    For any privacy-related questions or to exercise your rights, please contact our dedicated privacy team:
                  </p>
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <Mail className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Privacy Team</p>
                        <p className="text-muted-foreground">privacy@melmilaap.com</p>
                        <p className="text-sm text-muted-foreground">Response time: 1-3 business days</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="text-center pt-8 border-t border-border">
                  <Button variant="luxury" size="lg">
                    <Mail className="w-5 h-5 mr-2" />
                    Submit Data Request
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DataRights;