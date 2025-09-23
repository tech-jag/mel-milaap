"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FloralBranding } from "@/components/ui/FloralBranding";

import {
  Heart, Shield, Users, Sparkles, CheckCircle, ArrowRight,
  Globe, Award, MapPin, Camera, Building2, Utensils, Palette,
  Crown, UserCheck, Lock, Phone,
} from "lucide-react";
import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";
import { SEO } from "@/utils/seo";
import heroImage from "@/assets/hero-wedding-couple.jpg";

// Data has been centralized at the top for clarity and easier management.

const howItWorksSteps = [
  {
    number: "01",
    icon: UserCheck,
    title: "FIND",
    subtitle: "Create your profile and browse verified matches",
    description: "Build a comprehensive profile with photos, preferences, and cultural background. Connect with genuine, quality conscious individuals.",
    features: ["Profile verification required", "Photo authentication", "Background checks"]
  },
  {
    number: "02",
    icon: Heart,
    title: "MATCH",
    subtitle: "Connect with compatible South Asian singles",
    description: "Our advanced matching algorithm considers cultural compatibility, regional preferences, and family values to suggest the most suitable matches.",
    features: ["Advanced compatibility", "Cultural alignment", "Regional focus"]
  },
  {
    number: "03",
    icon: Crown,
    title: "MARRY",
    subtitle: "Build meaningful connections that lead to marriage",
    description: "Engage in safe, monitored communication with family involvement. Focus on serious matrimonial intentions and build trust.",
    features: ["Safe communication", "Family involvement", "Matrimonial focus"]
  },
  {
    number: "04",
    icon: Sparkles,
    title: "CELEBRATE",
    subtitle: "Plan your dream wedding with our vendor network",
    description: "Access our curated network of premium wedding vendors across Australia & New Zealand. Dream, plan, and execute your celebration.",
    features: ["Premium vendor network", "Wedding planning", "Celebration management"]
  }
];

const perfectMatchFeatures = [
  { icon: UserCheck, title: "Verified Premium Profiles", description: "Every profile undergoes thorough verification. Connect with genuine individuals who share your values." },
  { icon: Heart, title: "Cultural Compatibility", description: "Deep understanding of South Asian traditions and family values. Find matches who truly understand your heritage." },
  { icon: MapPin, title: "Australia & NZ Expertise", description: "A specialized focus on the unique diaspora dynamics in Australia and New Zealand." },
  { icon: Users, title: "Personalized Matching", description: "Advanced algorithms combined with human insight to ensure meaningful connections." },
  { icon: Shield, title: "Privacy & Safety First", description: "Best-in-class security and complete privacy controls in a family-friendly environment." },
  { icon: Crown, title: "Premium Experience", description: "Quality over quantity, dedicated support, and success stories that speak to our commitment." }
];

const safetyFeatures = [
  { icon: UserCheck, title: "100% Profile Verification", description: "Comprehensive verification process including government ID for authentic connections.", stats: ["ID verification", "Photo authentication", "Background screening"] },
  { icon: Lock, title: "Advanced Privacy Control", description: "You control who sees your photos and personal information with granular privacy settings.", stats: ["Private photo control", "Selective visibility", "Information control"] },
  { icon: Shield, title: "Safe Communication", description: "All communications happen securely within the platform with continuous safety monitoring.", stats: ["Monitored messaging", "Report & block features", "Safe environment"] },
  { icon: Phone, title: "Scam Prevention", description: "Advanced fraud detection and prevention systems help maintain an authentic community.", stats: ["Fraud detection", "Authentic profiles", "Scam prevention"] }
];

const successStories = [
  { quote: "We found each other through Mēl Milaap and couldn't be happier. The platform truly understands our cultural values.", names: "Priya & Arjun", location: "Sydney, Australia" },
  { quote: "The wedding planning tools made our celebration perfect. Everything in one place!", names: "Kavya & Vikram", location: "Melbourne, Australia" },
  { quote: "Our families loved being involved in the process. Mēl Milaap respects our traditions.", names: "Anisha & Raj", location: "Auckland, New Zealand" }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO
        title="Mēl Milaap - Australia & New Zealand's Premier South Asian Matrimony Platform"
        description="Find your perfect match in Australia & New Zealand's most trusted South Asian matrimony platform. Join thousands of verified members today."
      />

      <FloralBranding variant="homepage" className="z-0" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Beautiful South Asian wedding couple"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-lux-onyx/70 via-lux-onyx/50 to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <Badge
                variant="secondary"
                className="mb-8 px-6 py-2 text-base bg-lux-porcelain/20 text-lux-porcelain border-lux-champagne/30"
              >
                <Heart className="w-4 h-4 mr-2" />
                Australia & New Zealand's #1 South Asian Matrimony Platform
              </Badge>

              <div className="mb-8">
                <h1 className="text-lux-porcelain font-heading font-bold mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.02em' }}>
                  Find Your Perfect Match
                </h1>
                <p className="text-xl md:text-2xl text-lux-porcelain/90 font-light max-w-3xl mx-auto leading-relaxed">
                  Connect with verified South Asian singles across Australia & New Zealand. 
                  Where tradition meets modern love.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  size="lg"
                  className="bg-lux-champagne hover:bg-lux-champagne/90 text-lux-onyx font-semibold px-8 py-4 text-lg min-w-[200px]"
                  asChild
                >
                  <Link to="/auth">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-lux-porcelain/30 text-lux-porcelain hover:bg-lux-porcelain/10 font-semibold px-8 py-4 text-lg min-w-[200px]"
                  asChild
                >
                  <Link to="/how-it-works">Learn How It Works</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-lux-porcelain/80">
                <div>
                  <div className="text-3xl font-bold text-lux-champagne mb-2">50,000+</div>
                  <div className="text-sm">Verified Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-lux-champagne mb-2">2,500+</div>
                  <div className="text-sm">Success Stories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-lux-champagne mb-2">98%</div>
                  <div className="text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                How Mēl Milaap Works
              </Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Your Journey to Love
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Four simple steps to finding your perfect match in our trusted community
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  variants={fadeInUp}
                  className="text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{step.subtitle}</p>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Perfect Match Features */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">
                <Heart className="w-4 h-4 mr-2" />
                Why Choose Mēl Milaap
              </Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Your Perfect Match Awaits
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the most trusted matrimony platform designed specifically for South Asian singles
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {perfectMatchFeatures.map((feature, index) => (
                <motion.div key={index} variants={cardHover}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety & Security */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">
                <Shield className="w-4 h-4 mr-2" />
                Safety & Security
              </Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Your Safety is Our Priority
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Advanced security measures ensure a safe and authentic community
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {safetyFeatures.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">{feature.description}</p>
                          <ul className="space-y-2">
                            {feature.stats.map((stat, idx) => (
                              <li key={idx} className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                                {stat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">
                <Heart className="w-4 h-4 mr-2" />
                Success Stories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Love Stories That Inspire
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real couples who found their perfect match through Mēl Milaap
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex text-primary mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Heart key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic">"{story.quote}"</p>
                      </div>
                      <div className="border-t pt-4">
                        <p className="font-semibold text-foreground">{story.names}</p>
                        <p className="text-sm text-muted-foreground">{story.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Ready to Find Your Perfect Match?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Join thousands of South Asian singles who have found love through our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 text-lg"
                  asChild
                >
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4 text-lg"
                  asChild
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;