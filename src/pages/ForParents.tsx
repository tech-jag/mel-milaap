"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Heart, CheckCircle, Star, UserCheck } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All profiles are verified with ID and background checks for your peace of mind"
  },
  {
    icon: Users,
    title: "Parent-Managed Profiles",
    description: "Create and manage your child's profile with their consent and involvement"
  },
  {
    icon: Heart,
    title: "Traditional Values",
    description: "Respecting cultural traditions while embracing modern matchmaking"
  },
  {
    icon: UserCheck,
    title: "Family Involvement",
    description: "Involve family in the matching process while respecting your child's preferences"
  }
];

const testimonials = [
  {
    quote: "We found the perfect match for our daughter. The platform made it easy to connect with like-minded families.",
    author: "Mrs. Sharma",
    location: "Sydney, NSW"
  },
  {
    quote: "The verification process gave us confidence. Our son met his wife through this platform.",
    author: "Mr. Patel",
    location: "Melbourne, VIC"
  }
];

const ForParents = () => {
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
              Parents Welcome
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Help your children find meaningful connections while honoring family values and traditions
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/auth/signup">Create Family Profile</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/about">Learn More</a>
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
              Why Parents Choose Us
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              We understand the importance of family involvement in finding the right life partner
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

      {/* Testimonials */}
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
              Success Stories from Parents
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <Card className="luxury-card h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-lux-champagne fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
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

export default ForParents;