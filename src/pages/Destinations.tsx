"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Plane } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const destinations = [
  {
    name: "Bali, Indonesia",
    slug: "bali",
    image: "/api/placeholder/400/300",
    description: "Tropical paradise with stunning venues and rich cultural heritage",
    priceRange: "$15,000 - $35,000",
    rating: 4.8,
    suppliers: 45,
    highlights: ["Beach ceremonies", "Hindu temples", "Luxury resorts", "Cultural experiences"]
  },
  {
    name: "Fiji Islands",
    slug: "fiji", 
    image: "/api/placeholder/400/300",
    description: "Crystal clear waters and pristine beaches for intimate celebrations",
    priceRange: "$20,000 - $45,000",
    rating: 4.9,
    suppliers: 32,
    highlights: ["Private islands", "Traditional ceremonies", "Overwater bungalows", "Coral reefs"]
  },
  {
    name: "Thailand",
    slug: "thailand",
    image: "/api/placeholder/400/300", 
    description: "Exotic temples, luxury resorts, and incredible hospitality",
    priceRange: "$12,000 - $30,000",
    rating: 4.7,
    suppliers: 58,
    highlights: ["Buddhist temples", "Floating markets", "Thai hospitality", "Royal palaces"]
  },
  {
    name: "Sri Lanka",
    slug: "sri-lanka",
    image: "/api/placeholder/400/300",
    description: "Ancient heritage, tea plantations, and coastal beauty",
    priceRange: "$10,000 - $25,000", 
    rating: 4.6,
    suppliers: 28,
    highlights: ["Ancient temples", "Tea estates", "Colonial venues", "Wildlife safaris"]
  },
  {
    name: "India",
    slug: "india",
    image: "/api/placeholder/400/300",
    description: "Royal palaces, heritage hotels, and authentic cultural experiences",
    priceRange: "$8,000 - $40,000",
    rating: 4.8,
    suppliers: 120,
    highlights: ["Palace venues", "Cultural traditions", "Heritage hotels", "Royal experiences"]
  },
  {
    name: "Maldives",
    slug: "maldives",
    image: "/api/placeholder/400/300",
    description: "Luxury overwater villas and pristine tropical paradise",
    priceRange: "$25,000 - $60,000",
    rating: 4.9,
    suppliers: 18,
    highlights: ["Overwater ceremonies", "Private beaches", "Luxury resorts", "Sunset views"]
  }
];

const Destinations = () => {
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
              Destination Weddings
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Create unforgettable memories with a dream destination wedding in exotic locations across Asia-Pacific
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg">
                <Plane className="w-5 h-5 mr-2" />
                Plan Your Destination Wedding
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">Get Expert Consultation</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
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
              Popular Destinations
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Discover stunning venues and trusted suppliers in top wedding destinations
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {destinations.map((destination) => (
              <motion.div
                key={destination.slug}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="luxury-card overflow-hidden h-full cursor-pointer">
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground">
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-lux-champagne fill-current" />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <h3 className="text-xl font-heading font-semibold text-foreground">
                            {destination.name}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {destination.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {destination.suppliers} suppliers
                        </div>
                        <div className="font-medium text-foreground">
                          {destination.priceRange}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {destination.highlights.slice(0, 2).map((highlight) => (
                          <Badge key={highlight} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                        {destination.highlights.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{destination.highlights.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button className="w-full" variant="outline" asChild>
                        <a href={`/destinations/${destination.slug}`}>
                          Explore {destination.name}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              Need Help Planning?
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Our destination wedding experts can help you plan every detail of your dream celebration
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="/contact">Get Free Consultation</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/suppliers">Find Destination Suppliers</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Destinations;