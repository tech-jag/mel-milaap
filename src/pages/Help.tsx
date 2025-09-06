"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, Clock } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn how to create your profile and start matching",
    link: "/faqs#getting-started"
  },
  {
    title: "Account & Profile",
    description: "Manage your account settings and profile information",
    link: "/faqs#account"
  },
  {
    title: "Matching & Messaging",
    description: "How to find matches and communicate effectively",
    link: "/faqs#matching"
  },
  {
    title: "Safety & Security",
    description: "Stay safe and protect your privacy",
    link: "/trust"
  },
  {
    title: "Subscription & Billing",
    description: "Manage your subscription and payment options",
    link: "/faqs#billing"
  },
  {
    title: "Wedding Planning",
    description: "Use our planning tools and find suppliers",
    link: "/planning"
  }
];

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "Start Chat",
    available: "9 AM - 6 PM AEST"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email",
    action: "support@melmilaap.com",
    available: "We reply within 24 hours"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us directly",
    action: "+61 2 1234 5678",
    available: "9 AM - 6 PM AEST, Mon-Fri"
  }
];

const Help = () => {
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
              Help Center
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Get help with your account, find answers to common questions, or contact our support team
            </motion.p>
            <motion.div
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/faqs">View FAQs</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
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
              Browse Help Topics
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions organized by category
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {helpCategories.map((category) => (
              <motion.div
                key={category.title}
                variants={fadeInUp}
              >
                <Card className="luxury-card h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={category.link}>
                        Learn More →
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
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
              Contact Support
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {contactOptions.map((option) => (
              <motion.div
                key={option.title}
                variants={fadeInUp}
              >
                <Card className="luxury-card text-center h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <option.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {option.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {option.description}
                    </p>
                    <Button variant="outline" className="mb-4">
                      {option.action}
                    </Button>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {option.available}
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

export default Help;