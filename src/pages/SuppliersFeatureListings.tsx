"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, TrendingUp, CheckCircle } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const featuredSuppliers = [
  {
    name: "Royal Palace Events",
    category: "Wedding Venues",
    location: "Sydney, NSW",
    rating: 4.9,
    reviews: 156,
    image: "/api/placeholder/300/200",
    description: "Luxury wedding venues with traditional South Asian elegance",
    features: ["Grand ballrooms", "Cultural ceremonies", "In-house catering", "Bridal suites"]
  },
  {
    name: "Mehndi Magic Artists",
    category: "Bridal Services", 
    location: "Melbourne, VIC",
    rating: 4.8,
    reviews: 203,
    image: "/api/placeholder/300/200",
    description: "Traditional henna artistry for brides and bridal parties",
    features: ["Bridal packages", "Party bookings", "Traditional designs", "Modern styles"]
  },
  {
    name: "Spice Route Catering",
    category: "Catering",
    location: "Brisbane, QLD",
    rating: 4.9,
    reviews: 124,
    image: "/api/placeholder/300/200", 
    description: "Authentic South Asian cuisine for weddings and events",
    features: ["Regional specialties", "Dietary options", "Live cooking", "Custom menus"]
  },
  {
    name: "Golden Memories Photography",
    category: "Photography",
    location: "Perth, WA",
    rating: 4.8,
    reviews: 89,
    image: "/api/placeholder/300/200",
    description: "Capturing precious moments with cultural sensitivity",
    features: ["Wedding albums", "Engagement shoots", "Traditional ceremonies", "Candid photography"]
  },
  {
    name: "Elegant Decorations",
    category: "Decorations",
    location: "Auckland, NZ", 
    rating: 4.7,
    reviews: 167,
    image: "/api/placeholder/300/200",
    description: "Beautiful mandap and venue decorations for South Asian weddings",
    features: ["Mandap designs", "Floral arrangements", "Lighting", "Stage setups"]
  },
  {
    name: "Classical Music Ensemble",
    category: "Entertainment",
    location: "Adelaide, SA",
    rating: 4.9,
    reviews: 78,
    image: "/api/placeholder/300/200",
    description: "Traditional and modern music for wedding celebrations",
    features: ["Live performances", "DJ services", "Traditional instruments", "Modern hits"]
  }
];

const benefits = [
  {
    icon: Crown,
    title: "Premium Placement",
    description: "Get featured at the top of search results and category pages"
  },
  {
    icon: TrendingUp,
    title: "Increased Visibility",
    description: "Reach more couples actively searching for wedding suppliers"
  },
  {
    icon: Star,
    title: "Enhanced Profile",
    description: "Showcase unlimited photos, videos, and detailed service information"
  },
  {
    icon: CheckCircle,
    title: "Trust Indicators",
    description: "Featured badge and verified status build credibility with couples"
  }
];

const SuppliersFeatureListings = () => {
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
              Featured Listings
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Premium wedding suppliers trusted by the South Asian community across Australia & New Zealand
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/supplier/signup">Become Featured</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/suppliers">Browse All Suppliers</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Suppliers */}
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
              Our Featured Partners
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked suppliers who consistently deliver exceptional service to our community
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredSuppliers.map((supplier) => (
              <motion.div
                key={supplier.name}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="luxury-card overflow-hidden h-full cursor-pointer">
                  <div className="relative">
                    <img
                      src={supplier.image}
                      alt={supplier.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-lux-champagne text-lux-champagne-foreground">
                        <Crown className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-lux-champagne fill-current" />
                        <span className="text-sm font-medium">{supplier.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {supplier.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {supplier.reviews} reviews
                          </span>
                        </div>
                        <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                          {supplier.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {supplier.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {supplier.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {supplier.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {supplier.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{supplier.features.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <Button className="w-full" variant="outline">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Benefits of Featured Listings
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Stand out from the competition and attract more couples to your business
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

      {/* CTA Section */}
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
              Ready to Get Featured?
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Join our featured suppliers and grow your wedding business with premium placement
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/supplier/signup">Get Featured Today</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">Learn More</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuppliersFeatureListings;