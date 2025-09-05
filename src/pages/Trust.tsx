"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Phone,
  Mail
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const trustFeatures = [
  {
    icon: Shield,
    title: "ID Verification",
    description: "All members undergo thorough identity verification with government-issued documents.",
    status: "mandatory"
  },
  {
    icon: Eye,
    title: "Profile Privacy",
    description: "Control who sees your photos and personal details. Full privacy until mutual interest.",
    status: "controlled"
  },
  {
    icon: Lock,
    title: "Secure Messaging",
    description: "End-to-end encrypted conversations with built-in reporting and blocking features.",
    status: "encrypted"
  },
  {
    icon: Users,
    title: "Community Guidelines",
    description: "Zero tolerance for inappropriate behavior. 24/7 moderation and support team.",
    status: "moderated"
  }
];

const safetyTips = [
  "Meet in public places for initial meetings",
  "Never share financial information",
  "Take your time getting to know someone",
  "Trust your instincts - report suspicious behavior",
  "Use our platform's messaging until you're comfortable",
  "Inform friends/family about your plans"
];

const Trust = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6">
                Trust & Safety
              </Badge>
              <h1 className="text-luxury-xl text-foreground mb-6">
                Your Safety is Our Priority
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We've built comprehensive safety measures to create a secure, trusted environment 
                for meaningful connections in the South Asian community.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              How We Keep You Safe
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Multi-layered security measures designed specifically for the matrimony journey
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {trustFeatures.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="luxury-card h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-success" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-heading font-semibold text-foreground">
                            {feature.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {feature.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-luxury-lg text-foreground mb-6">
                Safety Guidelines
              </h2>
              <p className="text-body-lg text-muted-foreground mb-8">
                Follow these essential safety tips for a secure matrimony experience
              </p>
              
              <div className="space-y-4">
                {safetyTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    variants={fadeInUp}
                    custom={index}
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="luxury-card">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <AlertTriangle className="w-6 h-6 text-accent" />
                    <h3 className="font-heading font-semibold text-foreground">
                      Report & Block
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    If you encounter any inappropriate behavior or feel unsafe, 
                    use our instant reporting tools or contact our support team.
                  </p>
                  
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-3" />
                      Report a User
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-3" />
                      24/7 Support: 1800-SHAADI
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-3" />
                      support@shaadi.co
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Privacy Commitment
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8">
              Your personal information is protected by industry-leading security measures. 
              We never share your data with third parties without your explicit consent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="luxury" size="lg">
                View Privacy Policy
              </Button>
              <Button variant="outline" size="lg">
                Data Protection Rights
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Trust;