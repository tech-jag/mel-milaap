"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Sparkles, ArrowRight } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const journeySteps = [
  {
    step: "01",
    title: "Meet",
    description: "Create your verified profile and discover compatible matches in our trusted community",
    icon: Users,
    color: "text-primary"
  },
  {
    step: "02", 
    title: "Match",
    description: "Connect with potential life partners through our advanced matching algorithm",
    icon: Heart,
    color: "text-accent"
  },
  {
    step: "03",
    title: "Marry",
    description: "Plan your perfect wedding with our comprehensive planning tools and supplier network",
    icon: Shield,
    color: "text-success"
  },
  {
    step: "04",
    title: "Celebrate",
    description: "Share your story and celebrate your journey with our growing community",
    icon: Sparkles,
    color: "text-lux-champagne"
  }
];

const HowItWorks = () => {
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
              How It Works
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Your journey from meeting your perfect match to celebrating your dream wedding
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="relative"
              >
                <Card className="luxury-card h-full">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <step.icon className={`w-8 h-8 text-primary-foreground`} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-accent-foreground">{step.step}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {index < journeySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
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
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Join thousands of South Asian singles who have found love through our platform
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/auth/signup">Start Matching</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/match">Browse Profiles</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;