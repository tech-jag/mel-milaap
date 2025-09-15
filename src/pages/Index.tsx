"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Shield, 
  Users, 
  Star, 
  Sparkles,
  CheckCircle,
  Crown,
  Gift,
  Calendar,
  Zap
} from "lucide-react";
import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";
import { SEO } from "@/utils/seo";
import { EarlyAccessForm } from "@/components/EarlyAccessForm";
import heroImage from "@/assets/hero-coming-soon.jpg";
import Wordmark from "@/components/brand/Wordmark";

// Founder benefits
const founderBenefits = [
  { 
    icon: Crown, 
    title: "3 Months Premium Free", 
    description: "Full access to all premium features at launch"
  },
  { 
    icon: Gift, 
    title: "Exclusive Features", 
    description: "First access to new features and updates"
  },
  { 
    icon: Calendar, 
    title: "Priority Support", 
    description: "Direct line to our support team"
  },
  { 
    icon: Zap, 
    title: "Early Access", 
    description: "Be the first to use the platform before public launch"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Mēl Milaap - Coming Soon | Join Our Founders Circle"
        description="Be the first to experience Australia & New Zealand's most exclusive South Asian matrimony platform. Join our founders circle for 3 months free premium access."
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Luxury South Asian wedding couple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-lux-onyx/80 via-lux-onyx/60 to-transparent" />
        </div>
        
        {/* Hero Content */}
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
              <Crown className="w-4 h-4 mr-2" />
              Exclusive Founders Circle Now Open
            </Badge>

{/* Centered brand text with proper macron */}
<div className="mb-8 w-full text-center">
  <div className="mb-8 flex justify-center">
    <h1 className="hero-brand-text text-6xl md:text-7xl lg:text-8xl text-lux-porcelain">
      Mēl <span className="text-lux-champagne">Milaap</span>
    </h1>
  </div>
  <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium text-lux-porcelain text-center">
    Coming Soon
  </h2>
</div>


            
            <p className="text-xl md:text-2xl text-lux-porcelain/90 mb-12 mt-8 leading-relaxed max-w-3xl mx-auto font-light">
              Australia & New Zealand's most exclusive South Asian matrimony platform. 
              <br className="hidden md:block" />
              Be among the first to find your perfect match with our founding members.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button 
                variant="luxury" 
                size="xl" 
                className="bg-lux-champagne text-lux-onyx hover:bg-lux-champagne/90 shadow-champagne"
                onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Heart className="w-5 h-5 mr-2" />
                Join Founders Circle
              </Button>
              <Button 
                variant="glass" 
                size="xl" 
                className="text-lux-porcelain border-lux-porcelain/30 hover:bg-lux-porcelain/10"
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Gift className="w-5 h-5 mr-2" />
                Learn More
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

      {/* Founder Benefits Section */}
      <section id="benefits" className="py-24 bg-card">
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
              <Crown className="w-4 h-4 mr-2" />
              Exclusive Founder Benefits
            </Badge>
            <h2 className="text-luxury-lg text-foreground mb-6">
              Join Our Founding Members
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              Be part of an exclusive community of early adopters who will shape the future of South Asian matchmaking in ANZ. 
              Enjoy premium benefits worth $300+ absolutely free.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {founderBenefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={{...fadeInUp, ...cardHover}}
                whileHover="hover"
              >
                <Card className="luxury-card h-full text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <benefit.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-4 text-lg">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 lg:gap-16"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: CheckCircle, text: "Verified Community", color: "text-success" },
              { icon: Shield, text: "Privacy First", color: "text-primary" },
              { icon: Users, text: "South Asian Focus", color: "text-accent" },
              { icon: Sparkles, text: "Premium Experience", color: "text-lux-champagne" },
            ].map((item) => (
              <motion.div
                key={item.text}
                className="flex items-center space-x-3"
                variants={fadeInUp}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="font-medium text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Early Access Form Section */}
      <section id="early-access" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Secure Your Exclusive Access
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands who are already on the waiting list. Limited founding memberships available.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <EarlyAccessForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;