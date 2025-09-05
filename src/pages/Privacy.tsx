"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const Privacy = () => {
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
              Privacy Policy
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

      {/* Privacy Content */}
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
                    Information We Collect
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support. This may include your name, email address, phone number, photos, and other profile information.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and events.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Information Sharing
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted partners who assist us in operating our website and conducting our business.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Data Security
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Your Rights
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. To exercise these rights, please contact us using the information provided below.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at privacy@shaadico.com
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

export default Privacy;