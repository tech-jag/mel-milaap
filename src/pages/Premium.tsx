"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Crown, 
  Shield, 
  Heart, 
  Users, 
  MessageCircle, 
  Calendar,
  Check,
  Star,
  Sparkles
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

// Premium packages
const packages = [
  {
    name: "Concierge",
    price: "AUD 2,500",
    duration: "3 months",
    description: "Premium matchmaking with dedicated support",
    features: [
      "Dedicated relationship manager",
      "5 hand-picked matches monthly",
      "Profile optimization & photography guidance",
      "Background verification included",
      "Direct communication facilitation",
      "Cultural compatibility assessment"
    ],
    popular: false
  },
  {
    name: "Executive",
    price: "AUD 5,500",
    duration: "6 months",
    description: "Comprehensive white-glove service for serious professionals",
    features: [
      "Senior relationship manager",
      "8 hand-picked matches monthly",
      "Professional photography session",
      "Enhanced background verification",
      "Family consultation included",
      "Cultural compatibility assessment",
      "Wedding planning introduction",
      "6-month guarantee"
    ],
    popular: true
  },
  {
    name: "Elite",
    price: "AUD 12,000",
    duration: "12 months",
    description: "Ultimate luxury matchmaking experience",
    features: [
      "Executive relationship manager",
      "Unlimited curated matches",
      "Premium photography & styling",
      "Comprehensive background checks",
      "Family introductions & consultations",
      "Relationship coaching sessions",
      "Wedding vendor network access",
      "Success guarantee with refund policy",
      "Exclusive networking events"
    ],
    popular: false
  }
];

const Premium = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    profession: '',
    budget: '',
    timeline: '',
    preferences: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Premium consultation request:', formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6"
              variants={fadeInUp}
            >
              <Crown className="w-5 h-5" />
              White-Glove Matchmaking Service
            </motion.div>
            
            <motion.h1 
              className="text-luxury-xl text-foreground mb-6"
              variants={fadeInUp}
            >
              Premium Matchmaking
            </motion.h1>
            
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Experience the ultimate in personalized matchmaking. Our dedicated relationship managers provide 
              discreet, culturally-aware service for discerning South Asian professionals.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-6 justify-center text-sm"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-success" />
                <span>Cultural Expertise</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-success" />
                <span>Family Integration</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Package Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Choose Your Package
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Each package is tailored to provide exceptional service with the highest standards of discretion and cultural sensitivity.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative"
              >
                <Card className={`luxury-card h-full ${pkg.popular ? 'ring-2 ring-accent' : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className="mb-4">
                      <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
                    </div>
                    <CardTitle className="text-2xl font-heading text-foreground mb-2">
                      {pkg.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {pkg.price}
                    </div>
                    <div className="text-muted-foreground mb-4">
                      {pkg.duration}
                    </div>
                    <p className="text-muted-foreground">
                      {pkg.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant={pkg.popular ? "luxury" : "champagne"} 
                      className="w-full"
                      size="lg"
                    >
                      Book Consultation
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-luxury-lg text-foreground mb-6">
                Book Your Consultation
              </h2>
              <p className="text-body-lg text-muted-foreground">
                Start your journey with a complimentary consultation. We'll discuss your preferences, 
                expectations, and create a personalized matchmaking strategy.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="luxury-card">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number *
                        </label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+61 XXX XXX XXX"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Age
                        </label>
                        <Input
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="Your age"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Profession
                        </label>
                        <Input
                          name="profession"
                          value={formData.profession}
                          onChange={handleInputChange}
                          placeholder="Your profession"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Budget Range
                        </label>
                        <Input
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="Preferred package"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Timeline
                      </label>
                      <Input
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        placeholder="When would you like to start?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tell us about your preferences
                      </label>
                      <Textarea
                        name="preferences"
                        value={formData.preferences}
                        onChange={handleInputChange}
                        placeholder="Share your preferences, expectations, and what you're looking for in a life partner..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="text-center">
                      <Button type="submit" variant="luxury" size="lg" className="px-12">
                        <Calendar className="w-5 h-5 mr-2" />
                        Schedule Consultation
                      </Button>
                      
                      <p className="text-sm text-muted-foreground mt-4">
                        Our team will contact you within 24 hours to schedule your consultation.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                100% Confidential
              </h3>
              <p className="text-muted-foreground text-sm">
                Your privacy is our priority. All interactions remain strictly confidential.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Family-Centric
              </h3>
              <p className="text-muted-foreground text-sm">
                We understand the importance of family approval in South Asian marriages.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <MessageCircle className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                Expert Guidance
              </h3>
              <p className="text-muted-foreground text-sm">
                Cultural experts and relationship coaches guide you through every step.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Premium;