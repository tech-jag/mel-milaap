"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Star, 
  Camera, 
  Utensils, 
  Music, 
  Palette,
  Crown,
  Mic,
  Sparkles,
  Calendar,
  Heart,
  Phone,
  Mail
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const categories = [
  { id: "venues", name: "Venues", icon: MapPin, count: 120 },
  { id: "catering", name: "Catering", icon: Utensils, count: 150 },
  { id: "photography", name: "Photography", icon: Camera, count: 200 },
  { id: "entertainment", name: "Entertainment", icon: Music, count: 80 },
  { id: "decor", name: "Decor & Mandaps", icon: Palette, count: 90 },
  { id: "fashion", name: "Fashion & Jewelry", icon: Crown, count: 160 },
  { id: "officiants", name: "Priests & Officiants", icon: Mic, count: 45 },
  { id: "beauty", name: "Beauty & Mehendi", icon: Sparkles, count: 110 },
];

const featuredSuppliers = [
  {
    id: 1,
    name: "Golden Palace Events",
    category: "Venues",
    location: "Sydney, NSW",
    rating: 4.9,
    reviews: 127,
    priceRange: "$$$",
    capacity: "50-500 guests",
    featured: true,
    image: "/api/placeholder/400/300",
    services: ["Indoor & Outdoor", "Catering Available", "Parking"],
  },
  {
    id: 2,
    name: "Spice & Stories Catering",
    category: "Catering",
    location: "Melbourne, VIC",
    rating: 4.8,
    reviews: 89,
    priceRange: "$$",
    capacity: "50-1000 guests",
    featured: true,
    image: "/api/placeholder/400/300",
    services: ["Vegetarian Specialist", "Live Counters", "Custom Menus"],
  },
  {
    id: 3,
    name: "Eternal Moments Photography",
    category: "Photography",
    location: "Auckland, NZ",
    rating: 5.0,
    reviews: 156,
    priceRange: "$$$",
    capacity: "All Events",
    featured: false,
    image: "/api/placeholder/400/300",
    services: ["Cinematic Videos", "Same Day Edit", "Drone Coverage"],
  },
];

const Suppliers = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

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
              Wedding Suppliers
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Find trusted wedding professionals for your special day across Australia & New Zealand
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-md text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground">
              Explore our curated selection of wedding professionals
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full p-4 rounded-xl text-center transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "bg-background hover:bg-secondary"
                  }`}
                >
                  <category.icon className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm font-medium mb-1">{category.name}</div>
                  <div className="text-xs opacity-75">{category.count}+</div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-md text-foreground mb-4">
              Featured Suppliers
            </h2>
            <p className="text-muted-foreground">
              Premium verified suppliers recommended by couples
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
                key={supplier.id}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="luxury-card overflow-hidden">
                  <div className="relative">
                    <img
                      src={supplier.image}
                      alt={supplier.name}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Featured Badge */}
                    {supplier.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-accent-foreground">
                          <Crown className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm font-medium">{supplier.rating}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-1">
                          {supplier.name}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {supplier.location}
                          </span>
                          <span>{supplier.priceRange}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="secondary">{supplier.category}</Badge>
                        <span className="text-muted-foreground">
                          {supplier.reviews} reviews
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Capacity:</span> {supplier.capacity}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {supplier.services.slice(0, 3).map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button variant="luxury" size="sm" className="flex-1">
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="premium" size="sm" className="flex-1">
                          <Mail className="w-4 h-4 mr-2" />
                          Quote
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div
            className="text-center mt-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Button variant="champagne" size="lg">
              View All Suppliers
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            className="max-w-2xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-luxury-md text-primary-foreground mb-6"
              variants={fadeInUp}
            >
              Join Our Supplier Network
            </motion.h2>
            <motion.p 
              className="text-body-lg text-primary-foreground/90 mb-8"
              variants={fadeInUp}
            >
              Connect with couples planning their dream weddings across Australia & New Zealand
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button variant="glass" size="xl" className="text-primary-foreground border-primary-foreground/30">
                Become a Supplier
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Suppliers;