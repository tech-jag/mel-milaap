"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  Crown, 
  Heart, 
  MessageCircle, 
  Search,
  Shield,
  Star,
  Zap,
  TrendingUp
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

// Member pricing plans
const memberPlans = [
  {
    name: "Free",
    price: "AUD 0",
    duration: "forever",
    description: "Start your journey with basic features",
    features: [
      { name: "Browse verified profiles", included: true },
      { name: "3 messages per day", included: true },
      { name: "Basic filters", included: true },
      { name: "Profile creation", included: true },
      { name: "Unlimited messaging", included: false },
      { name: "Advanced filters", included: false },
      { name: "Profile boost", included: false },
      { name: "Read receipts", included: false },
      { name: "Priority support", included: false }
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Premium",
    price: "AUD 39",
    duration: "per month",
    description: "Unlock the full potential of your search",
    features: [
      { name: "Browse verified profiles", included: true },
      { name: "Unlimited messaging", included: true },
      { name: "Advanced filters", included: true },
      { name: "Profile boost (2x visibility)", included: true },
      { name: "Read receipts", included: true },
      { name: "Priority support", included: true },
      { name: "Verification fast-track", included: true },
      { name: "Hide ads", included: true },
      { name: "Super likes (5 per day)", included: true }
    ],
    cta: "Start Premium",
    popular: true
  },
  {
    name: "Premium+",
    price: "AUD 99",
    duration: "per month",
    description: "Ultimate matchmaking experience with exclusive benefits",
    features: [
      { name: "All Premium features", included: true },
      { name: "Unlimited super likes", included: true },
      { name: "Priority profile placement", included: true },
      { name: "Advanced matching algorithm", included: true },
      { name: "Video call features", included: true },
      { name: "Personal matchmaker consultation", included: true },
      { name: "Profile verification badge", included: true },
      { name: "Exclusive events invites", included: true },
      { name: "24/7 concierge support", included: true }
    ],
    cta: "Go Premium+",
    popular: false
  }
];

// Supplier pricing plans
const supplierPlans = [
  {
    name: "Free",
    price: "AUD 0",
    duration: "forever",
    description: "Basic presence in our directory",
    features: [
      { name: "Basic business profile", included: true },
      { name: "5 photos", included: true },
      { name: "Customer inquiries", included: true },
      { name: "Basic contact information", included: true },
      { name: "Featured placement", included: false },
      { name: "Unlimited photos", included: false },
      { name: "Priority support", included: false },
      { name: "Analytics dashboard", included: false },
      { name: "Direct phone display", included: false }
    ],
    cta: "List Your Business",
    popular: false
  },
  {
    name: "Featured",
    price: "AUD 149",
    duration: "per month",
    description: "Stand out with enhanced visibility",
    features: [
      { name: "Enhanced business profile", included: true },
      { name: "Unlimited photos", included: true },
      { name: "Featured in category", included: true },
      { name: "Priority search ranking", included: true },
      { name: "Customer inquiries", included: true },
      { name: "Basic analytics", included: true },
      { name: "Premium badge", included: true },
      { name: "Homepage featuring", included: false },
      { name: "Dedicated account manager", included: false }
    ],
    cta: "Go Featured",
    popular: true
  },
  {
    name: "Premium",
    price: "AUD 499",
    duration: "per month",
    description: "Maximum exposure and premium benefits",
    features: [
      { name: "All Featured plan benefits", included: true },
      { name: "Homepage showcase placement", included: true },
      { name: "Priority in all searches", included: true },
      { name: "Custom branding options", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Marketing campaign support", included: true },
      { name: "First priority on new leads", included: true },
      { name: "Premium badge & verification", included: true },
      { name: "Advanced analytics dashboard", included: true }
    ],
    cta: "Go Premium",
    popular: false
  }
];

const Pricing = () => {
  const [activeTab, setActiveTab] = React.useState<'members' | 'suppliers'>('members');

  const currentPlans = activeTab === 'members' ? memberPlans : supplierPlans;

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
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Choose the plan that fits your needs. All plans include our core features with no hidden fees.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center">
            <div className="flex bg-card rounded-lg p-1 border border-border">
              <button
                onClick={() => setActiveTab('members')}
                className={`px-8 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'members' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className="w-5 h-5" />
                For Members
              </button>
              <button
                onClick={() => setActiveTab('suppliers')}
                className={`px-8 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'suppliers' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Crown className="w-5 h-5" />
                For Suppliers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {currentPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative"
              >
                <Card className={`luxury-card h-full ${plan.popular ? 'ring-2 ring-accent' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-heading text-foreground mb-4">
                      {plan.name}
                    </CardTitle>
                    
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </div>
                      <div className="text-muted-foreground">
                        {plan.duration}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant={plan.popular ? "luxury" : plan.name === "Free" || plan.name === "Free Listing" ? "champagne" : "premium"} 
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Why Choose Premium?
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock advanced features that give you a significant advantage in finding your perfect match or growing your business.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Unlimited Messaging
              </h3>
              <p className="text-muted-foreground text-sm">
                Connect with as many potential matches as you want without daily limits.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Advanced Filters
              </h3>
              <p className="text-muted-foreground text-sm">
                Find exactly what you're looking for with detailed search criteria.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Profile Boost
              </h3>
              <p className="text-muted-foreground text-sm">
                Get 2x more profile views with our visibility enhancement feature.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Verification Fast-Track
              </h3>
              <p className="text-muted-foreground text-sm">
                Get your profile verified quickly with priority processing.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
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
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    Can I cancel my subscription anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    Is there a free trial for premium plans?
                  </h3>
                  <p className="text-muted-foreground">
                    We offer a 7-day free trial for all premium plans. You can explore all premium features before making a commitment.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    How does supplier verification work?
                  </h3>
                  <p className="text-muted-foreground">
                    All suppliers go through a verification process including business registration checks, insurance verification, and customer review validation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;