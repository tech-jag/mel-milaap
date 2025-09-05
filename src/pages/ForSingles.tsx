"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, MessageCircle, Crown, CheckCircle, Star, MapPin } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const features = [
  {
    icon: Shield,
    title: "Verified Local Matches",
    description: "Connect with verified singles in Australia & New Zealand who share your values"
  },
  {
    icon: MessageCircle,
    title: "Unlimited Messaging",
    description: "Premium members enjoy unlimited messaging with enhanced privacy controls"
  },
  {
    icon: Crown,
    title: "Privacy First",
    description: "Control who can see your profile and photos with advanced privacy settings"
  },
  {
    icon: MapPin,
    title: "Local Community",
    description: "Find matches in your city or explore connections across ANZ"
  }
];

const plans = [
  {
    name: "Free",
    price: "AUD 0",
    features: ["Create profile", "Browse matches", "3 messages/day", "Basic filters"]
  },
  {
    name: "Premium",
    price: "AUD 39",
    period: "/month",
    features: ["Unlimited messaging", "Advanced filters", "See who viewed you", "Priority support"],
    popular: true
  },
  {
    name: "Premium+",
    price: "AUD 99", 
    period: "/month",
    features: ["All Premium features", "Profile boost", "Message read receipts", "Exclusive events"]
  }
];

const ForSingles = () => {
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
              For Singles
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Find meaningful connections with verified local matches who share your values and aspirations
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/auth/signup">Join Now</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/match">Browse Matches</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
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
              Why Singles Love Our Platform
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the South Asian community in Australia & New Zealand
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
              >
                <Card className="luxury-card h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
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
              Choose Your Plan
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade when you're ready for premium features
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`luxury-card h-full ${plan.popular ? 'ring-2 ring-accent' : ''}`}>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-heading font-semibold mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-success mr-3" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={plan.popular ? "luxury" : "outline"} 
                      className="w-full"
                      asChild
                    >
                      <a href="/auth/signup">
                        {plan.name === "Free" ? "Get Started" : "Upgrade Now"}
                      </a>
                    </Button>
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

export default ForSingles;