"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const Terms = () => {
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
              Terms of Service
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground"
              variants={fadeInUp}
            >
              Last updated: January 2024
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
            <Card className="luxury-card">
              <CardContent className="p-8 space-y-8">
                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using Shaadi & Co's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    2. Use License
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Permission is granted to temporarily download one copy of the materials on Shaadi & Co's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    3. User Accounts
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Users are responsible for maintaining the confidentiality of their account information and password. You are responsible for all activities that occur under your account.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    4. Privacy Policy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    5. Prohibited Uses
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You may not use our service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts, to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    6. Contact Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at legal@shaadico.com
                  </p>
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

export default Terms;