"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

import { 
  Heart, 
  Shield, 
  Users, 
  Star, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Globe,
  Award,
  TrendingUp,
  MapPin
} from "lucide-react";
import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";
import { SEO } from "@/utils/seo";
import heroImage from "@/assets/hero-wedding-couple.jpg";

// Key features
const features = [
  { 
    icon: Users, 
    title: "Verified Profiles", 
    description: "All members are verified for authenticity and safety"
  },
  { 
    icon: Shield, 
    title: "Privacy First", 
    description: "Your personal information is protected with highest security"
  },
  { 
    icon: Heart, 
    title: "Smart Matching", 
    description: "Advanced algorithm finds your most compatible matches"
  },
  { 
    icon: Globe, 
    title: "ANZ Community", 
    description: "Focused on Australia & New Zealand South Asian community"
  },
];

// Success stats
const stats = [
  { icon: Users, value: "15,000+", label: "Active Members" },
  { icon: Heart, value: "2,500+", label: "Success Stories" },
  { icon: MapPin, value: "50+", label: "Cities Covered" },
  { icon: Award, value: "5+", label: "Years of Trust" }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Mēl Milaap - Australia & New Zealand's Premier South Asian Matrimony Platform"
        description="Find your perfect match in Australia & New Zealand's most trusted South Asian matrimony platform. Join thousands of verified members today."
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Beautiful South Asian wedding couple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-lux-onyx/70 via-lux-onyx/50 to-transparent" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <Badge 
              variant="secondary" 
              className="mb-8 px-6 py-2 text-base bg-lux-porcelain/20 text-lux-porcelain border-lux-champagne/30"
            >
              <Heart className="w-4 h-4 mr-2" />
              Australia & New Zealand's #1 South Asian Matrimony Platform
            </Badge>

            {/* Brand Logo */}
            <div className="mb-8">
              <h1 
                className="text-lux-porcelain font-bold mb-6"
                style={{ 
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: '0.9'
                }}
              >
                Mēl <span className="text-lux-champagne">Milaap</span>
              </h1>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-lux-porcelain mb-8 leading-tight">
              Find Your Perfect Match
            </h2>
            
            <p className="text-xl md:text-2xl text-lux-porcelain/90 mb-12 leading-relaxed max-w-3xl font-light">
              Join thousands of verified South Asian singles in Australia & New Zealand. 
              <br className="hidden md:block" />
              Discover meaningful connections with those who share your values and traditions.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                asChild
                variant="luxury" 
                size="xl" 
                className="bg-lux-champagne text-lux-onyx hover:bg-lux-champagne/90 shadow-champagne"
              >
                <Link to="/register">
                  <Heart className="w-5 h-5 mr-2" />
                  Join Now - It's Free
                </Link>
              </Button>
              <Button 
                asChild
                variant="glass" 
                size="xl" 
                className="text-lux-porcelain border-lux-porcelain/30 hover:bg-lux-porcelain/10"
              >
                <Link to="/how-it-works">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  How It Works
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="w-6 h-10 border-2 border-lux-porcelain/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-lux-champagne rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-2 bg-accent/10 text-accent border-accent/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Why Choose Mēl Milaap
            </Badge>
            <h2 className="text-luxury-lg text-foreground mb-6">
              Your Journey to Love Starts Here
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              We combine traditional values with modern technology to help you find your life partner 
              in a safe, secure, and authentic environment.
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
                variants={{...fadeInUp, ...cardHover}}
                whileHover="hover"
              >
                <Card className="luxury-card h-full text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-4 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Join Australia & New Zealand's fastest-growing South Asian matrimony community
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Ready to Find Your Life Partner?
            </h2>
            <p className="text-body-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of South Asian singles who have found love through Mēl Milaap. 
              Your perfect match is waiting for you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                asChild
                variant="luxury" 
                size="xl" 
                className="bg-lux-champagne text-lux-onyx hover:bg-lux-champagne/90 shadow-champagne"
              >
                <Link to="/register">
                  <Heart className="w-5 h-5 mr-2" />
                  Start Your Journey Today
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="xl"
              >
                <Link to="/stories">
                  <Star className="w-5 h-5 mr-2" />
                  Read Success Stories
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;