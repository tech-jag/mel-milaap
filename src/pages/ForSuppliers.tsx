"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Star, Crown, CheckCircle, DollarSign } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const benefits = [
  {
    icon: TrendingUp,
    title: "Lead Generation",
    description: "Connect with couples actively planning their weddings in your area"
  },
  {
    icon: Users,
    title: "Targeted Audience",
    description: "Reach the South Asian community across Australia & New Zealand"
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description: "Showcase your work and build credibility through reviews and ratings"
  },
  {
    icon: Crown,
    title: "Premium Visibility",
    description: "Get featured placement and priority in search results"
  }
];

const supplierPlans = [
  {
    name: "Free",
    price: "AUD 0",
    features: ["Basic profile", "5 photos", "Contact inquiries", "Basic analytics"]
  },
  {
    name: "Featured",
    price: "AUD 149",
    period: "/month",
    features: ["Featured placement", "Unlimited photos", "Priority support", "Advanced analytics"],
    popular: true
  },
  {
    name: "Premium",
    price: "AUD 499",
    period: "/month", 
    features: ["All Featured benefits", "Homepage showcase", "Lead priority", "Custom branding"]
  }
];

const ForSuppliers = () => {
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
              For Wedding Suppliers
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Grow your wedding business by connecting with couples in the South Asian community
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/supplier/signup">Join as Supplier</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/suppliers">View Directory</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
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
              Why Join Our Platform
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with engaged couples actively seeking wedding services
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
              >
                <Card className="luxury-card h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
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
              Supplier Pricing Plans
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {supplierPlans.map((plan) => (
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
                      <a href="/supplier/signup">
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

      {/* CTA */}
      <section className="py-24">
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
              Ready to Grow Your Business?
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Join hundreds of wedding suppliers already growing their business with us
            </motion.p>
            <motion.div
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/supplier/signup">Start Free Trial</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForSuppliers;