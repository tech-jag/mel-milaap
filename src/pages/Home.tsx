"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FloralBranding } from "@/components/ui/FloralBranding";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";

import {
  Heart, Shield, Users, Star, Sparkles, CheckCircle, ArrowRight,
  Globe, Award, MapPin, Camera, Building2, Utensils, Palette,
  Crown, UserCheck, Lock, Phone,
} from "lucide-react";
import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";
import { SEO } from "@/utils/seo";
import heroImage from "@/assets/hero-wedding-couple.jpg";

// Data for all sections, centralized for easier management.
const howItWorksSteps = [
  { number: "01", icon: UserCheck, title: "FIND", subtitle: "Create your profile and browse verified matches", description: "Build a comprehensive profile with photos, preferences, and cultural background. Connect with genuine, quality conscious individuals.", features: ["Profile verification required", "Photo authentication", "Background checks"] },
  { number: "02", icon: Heart, title: "MATCH", subtitle: "Connect with compatible South Asian singles", description: "Our advanced matching algorithm considers cultural compatibility, regional preferences, and family values to suggest the most suitable matches.", features: ["Advanced compatibility", "Cultural alignment", "Regional focus"] },
  { number: "03", icon: Crown, title: "MARRY", subtitle: "Build meaningful connections that lead to marriage", description: "Engage in safe, monitored communication with family involvement. Focus on serious matrimonial intentions and build trust.", features: ["Safe communication", "Family involvement", "Matrimonial focus"] },
  { number: "04", icon: Sparkles, title: "CELEBRATE", subtitle: "Plan your dream wedding with our vendor network", description: "Access our curated network of premium wedding vendors across Australia & New Zealand. Dream, plan, and execute your celebration.", features: ["Premium vendor network", "Wedding planning", "Celebration management"] }
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
      <main className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="Beautiful South Asian wedding couple" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-lux-onyx/70 via-lux-onyx/50 to-transparent" />
          </div>
          <div className="relative z-20 container mx-auto px-4 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-8 px-6 py-2 text-base bg-lux-porcelain/20 text-lux-porcelain border-lux-champagne/30">
                <Heart className="w-4 h-4 mr-2" />
                Australia & New Zealand's #1 South Asian Matrimony Platform
              </Badge>
              <div className="mb-8">
                <h1 className="text-lux-porcelain font-heading font-bold mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.02em', lineHeight: '0.9' }}>
                  Mēl <span className="text-lux-champagne">Milaap</span>
                </h1>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-semibold text-lux-porcelain mb-8 leading-tight">
                Find Your Perfect Match
              </h2>
              <p className="text-xl md:text-2xl text-lux-porcelain/90 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
                Join thousands of verified South Asian singles in Australia & New Zealand. <br className="hidden md:block" />
                Discover meaningful connections with those who share your values and traditions.
              </p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-wrap gap-4 justify-center">
                <Button asChild variant="luxury" size="xl" className="bg-lux-champagne text-lux-onyx hover:bg-lux-champagne/90 shadow-champagne">
                  <Link to="/register">
                    <Heart className="w-5 h-5 mr-2" />
                    Join Now - It's Free
                  </Link>
                </Button>
                <Button asChild variant="glass" size="xl" className="text-lux-porcelain border-lux-porcelain/30 hover:bg-lux-porcelain/10">
                  <Link to="/how-it-works">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    How It Works
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-card">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div className="text-center mb-16" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    <Badge variant="secondary" className="mb-6 px-4 py-2 bg-accent/10 text-accent border-accent/20">
                        <Heart className="w-4 h-4 mr-2" />
                        Your Journey
                    </Badge>
                    <h2 className="text-luxury-lg text-foreground mb-6">How <span className="font-heading">Mēl <span className="text-accent">Milaap</span></span> Works</h2>
                    <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">Your journey from finding your perfect match to celebrating your dream wedding is simplified into four elegant steps.</p>
                </motion.div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    {howItWorksSteps.map((step, index) => (
                        <motion.div key={step.title} variants={{ ...fadeInUp, ...cardHover }} whileHover="hover" className="group relative">
                            <Card className="luxury-card h-full text-center group-hover:shadow-luxury transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-6xl font-bold text-accent/10 group-hover:text-accent/20 transition-colors duration-300">{step.number}</div>
                                <CardContent className="p-8 relative z-10">
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                                        <step.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-heading font-bold text-foreground mb-2 text-xl tracking-wider">{step.title}</h3>
                                    <p className="font-medium text-accent mb-4 text-sm">{step.subtitle}</p>
                                    <p className="text-muted-foreground leading-relaxed text-sm mb-6">{step.description}</p>
                                    <div className="space-y-2">
                                        {step.features.map((feature, i) => (
                                            <div key={i} className="flex items-center justify-center text-xs text-muted-foreground">
                                                <CheckCircle className="w-3 h-3 text-accent mr-2" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            {index < howItWorksSteps.length - 1 && (<div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent/30 transform -translate-y-1/2" />)}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* Perfect Match Features Section */}
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div className="text-center mb-16" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    <h2 className="text-luxury-lg text-foreground mb-6">Why Choose <span className="font-heading">Mēl <span className="text-primary">Milaap</span></span>?</h2>
                    <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">Experience the premium difference in matrimonial matchmaking designed for South Asian communities in Australia & New Zealand.</p>
                </motion.div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    {perfectMatchFeatures.map((feature) => (
                        <motion.div key={feature.title} variants={{ ...fadeInUp, ...cardHover }} whileHover="hover" className="group">
                            <Card className="luxury-card h-full text-center group-hover:shadow-luxury transition-all duration-300">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                                        <feature.icon className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-foreground mb-4 text-lg">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* Safety Section */}
        <section className="py-24 bg-card">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div className="text-center mb-16" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    <Badge variant="secondary" className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
                        <Shield className="w-4 h-4 mr-2" />
                        Security First
                    </Badge>
                    <h2 className="text-luxury-lg text-foreground mb-6">Your Safety is Our <span className="text-primary">Priority</span></h2>
                    <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">Our platform is built on trust. Every profile is verified, communication is monitored, and your privacy is protected with bank-level security.</p>
                </motion.div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    {safetyFeatures.map((feature) => (
                        <motion.div key={feature.title} variants={{ ...fadeInUp, ...cardHover }} whileHover="hover" className="group">
                            <Card className="luxury-card h-full text-center group-hover:shadow-luxury transition-all duration-300">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                                        <feature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-foreground mb-4 text-lg">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm mb-6">{feature.description}</p>
                                    <div className="space-y-2">
                                        {feature.stats.map((stat, i) => (
                                            <div key={i} className="flex items-center justify-center text-xs text-muted-foreground">
                                                <CheckCircle className="w-3 h-3 text-accent mr-2" />
                                                {stat}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
        
        {/* Success Stories Section */}
        <section className="py-24 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div className="text-center mb-16" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    <h2 className="text-luxury-lg text-white mb-6">Over 50,000 Success Stories</h2>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto">Join thousands of couples across Australia & New Zealand who found their perfect match through Mēl Milaap.</p>
                </motion.div>
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    {successStories.map((story, index) => (
                        <motion.div key={index} variants={{ ...fadeInUp, ...cardHover }} whileHover="hover" className="group">
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full group-hover:bg-white/20 transition-all duration-300">
                                <CardContent className="p-8">
                                    <p className="text-white/90 leading-relaxed mb-6 italic">"{story.quote}"</p>
                                    <div className="text-center">
                                        <div className="font-semibold text-lux-champagne mb-1">{story.names}</div>
                                        <div className="text-white/70 text-sm">{story.location}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div className="text-center max-w-4xl mx-auto" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    <h2 className="text-luxury-lg text-foreground mb-6">Ready to Begin Your Journey?</h2>
                    <p className="text-body-lg text-muted-foreground mb-12 max-w-2xl mx-auto">Join 50,000+ South Asian singles across Australia & New Zealand who trust Mēl Milaap as their premier matrimonial platform.</p>
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <Button asChild variant="luxury" size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-luxury">
                            <Link to="/register">
                                <Heart className="w-5 h-5 mr-2" />
                                Join Free Today
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="xl">
                            <Link to="/stories">
                                <Award className="w-5 h-5 mr-2" />
                                See Success Stories
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Home;