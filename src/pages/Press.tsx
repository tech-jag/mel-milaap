"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Calendar } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const pressReleases = [
  {
    title: "Shaadi & Co Launches Revolutionary Matrimony Platform for ANZ South Asian Community",
    date: "January 15, 2024",
    excerpt: "New platform combines traditional matchmaking with modern technology, serving Australia and New Zealand's growing South Asian population."
  },
  {
    title: "Platform Celebrates 1000+ Successful Matches in First Year",
    date: "December 10, 2023",
    excerpt: "Milestone achievement demonstrates growing trust and success in connecting South Asian singles across Australia and New Zealand."
  },
  {
    title: "Wedding Supplier Network Expands to 500+ Verified Vendors",
    date: "November 5, 2023",
    excerpt: "Comprehensive directory now includes venues, photographers, caterers, and more across major ANZ cities."
  }
];

const mediaKit = [
  {
    title: "Company Logo Pack",
    description: "High-resolution logos in various formats",
    type: "ZIP (2.3 MB)"
  },
  {
    title: "Brand Guidelines",
    description: "Complete brand identity and usage guidelines",
    type: "PDF (1.8 MB)"
  },
  {
    title: "Product Screenshots",
    description: "Platform screenshots and feature images",
    type: "ZIP (5.2 MB)"
  },
  {
    title: "Executive Headshots",
    description: "High-resolution photos of leadership team",
    type: "ZIP (3.1 MB)"
  }
];

const Press = () => {
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
              Press Kit
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Media resources, press releases, and company information for journalists and media partners
            </motion.p>
            <motion.div
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="mailto:press@shaadico.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Press Team
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
            >
              <h2 className="text-luxury-md text-foreground mb-6">
                About Shaadi & Co
              </h2>
            </motion.div>

            <Card className="luxury-card">
              <CardContent className="p-8">
                <motion.div variants={fadeInUp}>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Shaadi & Co is Australia and New Zealand's premier South Asian matrimony and wedding platform, 
                    connecting singles with compatible life partners while honoring cultural traditions and family values. 
                    Founded in 2023, the platform serves the growing South Asian diaspora across major ANZ cities.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    The platform combines traditional matchmaking principles with modern technology, offering verified 
                    profiles, advanced filtering, and comprehensive wedding planning tools. With over 15,000 verified 
                    profiles and 800+ wedding suppliers, Shaadi & Co has facilitated over 2,500 successful matches.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">15,000+</div>
                      <div className="text-sm text-muted-foreground">Verified Profiles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">2,500+</div>
                      <div className="text-sm text-muted-foreground">Successful Matches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">800+</div>
                      <div className="text-sm text-muted-foreground">Wedding Suppliers</div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
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
              Latest Press Releases
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Recent news and announcements from Shaadi & Co
            </p>
          </motion.div>

          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {pressReleases.map((release) => (
              <motion.div
                key={release.title}
                variants={fadeInUp}
              >
                <Card className="luxury-card">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                      {release.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {release.excerpt}
                    </p>
                    <Button variant="ghost" size="sm">
                      Read Full Release →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Media Kit */}
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
              Media Kit Downloads
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Download high-resolution assets and brand materials
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {mediaKit.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
              >
                <Card className="luxury-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-foreground mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {item.type}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Press;