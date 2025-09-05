"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, Star, TrendingUp } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const plans = [
  {
    name: "Free",
    price: "AUD 0",
    period: "",
    description: "Perfect for getting started",
    features: [
      "Basic profile listing",
      "5 photos maximum",
      "Contact inquiries",
      "Basic analytics",
      "Community directory"
    ],
    limitations: [
      "Limited visibility",
      "No priority placement",
      "Basic support only"
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Featured",
    price: "AUD 149",
    period: "/month", 
    description: "Boost your visibility and leads",
    features: [
      "Featured placement in search",
      "Unlimited photos & videos",
      "Priority customer support",
      "Advanced analytics & insights",
      "Lead management tools",
      "Review management",
      "Social media integration"
    ],
    limitations: [],
    cta: "Start Featured Plan",
    popular: true
  },
  {
    name: "Premium",
    price: "AUD 499",
    period: "/month",
    description: "Maximum exposure and growth",
    features: [
      "All Featured plan benefits",
      "Homepage showcase placement",
      "Priority in all searches",
      "Custom branding options",
      "Dedicated account manager",
      "Marketing campaign support",
      "First priority on new leads",
      "Premium badge & verification"
    ],
    limitations: [],
    cta: "Go Premium",
    popular: false
  }
];

const addOns = [
  {
    name: "Professional Photography",
    price: "AUD 299",
    description: "Professional photos of your venue/services"
  },
  {
    name: "Video Showcase",
    price: "AUD 499", 
    description: "Professional video of your business"
  },
  {
    name: "SEO Optimization",
    price: "AUD 199",
    period: "/month",
    description: "Boost your search engine visibility"
  },
  {
    name: "Social Media Management",
    price: "AUD 399",
    period: "/month",
    description: "Professional social media management"
  }
];

const SuppliersPricing = () => {
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
              Supplier Pricing Plans
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Choose the perfect plan to grow your wedding business and connect with more couples
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
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
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`luxury-card h-full ${plan.popular ? 'ring-2 ring-accent scale-105' : ''}`}>
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center mb-4">
                        {plan.name === "Premium" && <Crown className="w-6 h-6 text-lux-champagne mr-2" />}
                        {plan.name === "Featured" && <Star className="w-6 h-6 text-accent mr-2" />}
                        {plan.name === "Free" && <TrendingUp className="w-6 h-6 text-primary mr-2" />}
                        <h3 className="text-2xl font-heading font-bold text-foreground">
                          {plan.name}
                        </h3>
                      </div>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                        {plan.period && <span className="text-muted-foreground text-lg">{plan.period}</span>}
                      </div>
                      <p className="text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <h4 className="font-semibold text-foreground">What's included:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      variant={plan.popular ? "luxury" : plan.name === "Premium" ? "outline" : "ghost"} 
                      className="w-full mb-4"
                      size="lg"
                      asChild
                    >
                      <a href="/supplier/signup">
                        {plan.cta}
                      </a>
                    </Button>

                    {plan.name === "Free" && (
                      <p className="text-xs text-muted-foreground text-center">
                        No credit card required
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Add-Ons */}
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
              Professional Add-Ons
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Enhance your listing with professional services to attract more couples
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {addOns.map((addOn) => (
              <motion.div
                key={addOn.name}
                variants={fadeInUp}
              >
                <Card className="luxury-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-foreground mb-2">
                          {addOn.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {addOn.description}
                        </p>
                        <div className="text-lg font-bold text-foreground">
                          {addOn.price}
                          {addOn.period && <span className="text-sm text-muted-foreground">{addOn.period}</span>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Add On
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto space-y-6"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                q: "Can I change my plan at any time?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee for all paid plans if you're not satisfied."
              },
              {
                q: "How quickly will I see results?",
                a: "Most suppliers see increased inquiries within the first week of upgrading to a paid plan."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time with no cancellation fees."
              }
            ].map((faq) => (
              <motion.div
                key={faq.q}
                variants={fadeInUp}
              >
                <Card className="luxury-card">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
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
              Ready to Grow Your Business?
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Join hundreds of wedding suppliers already growing their business with our platform
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/supplier/signup">Start Free Trial</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">Contact Sales</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuppliersPricing;