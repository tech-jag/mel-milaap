"use client";

import * as React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Heart, 
  Star,
  Phone,
  Globe,
  Camera,
  Music,
  Utensils
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const CitySydney = () => {
  const featuredSuppliers = [
    {
      id: '1',
      name: 'Sydney Harbour Weddings',
      category: 'Venue',
      location: 'Circular Quay',
      rating: 4.9,
      reviews: 147,
      image: '/placeholder.svg',
      description: 'Stunning harbour views for your perfect day',
      price: '$$$$',
      verified: true
    },
    {
      id: '2', 
      name: 'Luna Photography',
      category: 'Photography',
      location: 'Eastern Suburbs',
      rating: 4.8,
      reviews: 89,
      image: '/placeholder.svg',
      description: 'Award-winning wedding photography',
      price: '$$$',
      verified: true
    },
    {
      id: '3',
      name: 'Blooms & Co',
      category: 'Florist',
      location: 'Paddington',
      rating: 4.7,
      reviews: 123,
      image: '/placeholder.svg',
      description: 'Bespoke floral arrangements',
      price: '$$',
      verified: true
    }
  ];

  const categories = [
    { name: 'Venues', icon: MapPin, count: 45 },
    { name: 'Photography', icon: Camera, count: 78 },
    { name: 'Catering', icon: Utensils, count: 52 },
    { name: 'Music & Entertainment', icon: Music, count: 34 }
  ];

  const cityData = {
    name: 'Sydney',
    state: 'New South Wales',
    country: 'Australia',
    description: 'Australia\'s premier wedding destination with iconic venues and world-class suppliers',
    supplierCount: 209,
    venueCount: 45,
    avgCost: 'AUD $35,000',
    popularAreas: ['CBD', 'Eastern Suburbs', 'Northern Beaches', 'Inner West']
  };

  // Schema.org JSON-LD for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Wedding Suppliers in Sydney",
    "description": cityData.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityData.name,
      "addressRegion": cityData.state,
      "addressCountry": cityData.country
    },
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": "4.8",
      "ratingCount": "847"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "AUD",
      "lowPrice": "5000",
      "highPrice": "80000"
    }
  };

  return (
    <>
      <Helmet>
        <title>Sydney Wedding Suppliers | Find Your Perfect Wedding Vendors</title>
        <meta name="description" content="Discover Sydney's best wedding suppliers, venues, and vendors. From harbour-view venues to award-winning photographers - plan your perfect Sydney wedding." />
        <meta name="keywords" content="Sydney wedding suppliers, wedding venues Sydney, Sydney wedding photographers, wedding planning Sydney" />
        <link rel="canonical" href="https://yoursite.com/city/sydney" />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-6">
                  <MapPin className="w-4 h-4 mr-2" />
                  Sydney Wedding Directory
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-6">
                  Sydney Wedding Suppliers
                </h1>
                <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {cityData.description}. Connect with {cityData.supplierCount}+ verified wedding professionals.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {cityData.supplierCount} Suppliers
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    4.8 Average Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Verified Reviews
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              
              <motion.div
                className="text-center mb-12"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-elegant text-foreground mb-4">
                  Wedding Categories in Sydney
                </h2>
                <p className="text-body-lg text-muted-foreground">
                  Explore Sydney's top wedding service categories
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {categories.map((category, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="luxury-card text-center hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <category.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h3 className="font-medium text-foreground mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count} suppliers
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </section>

        {/* Featured Suppliers */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              
              <motion.div
                className="text-center mb-12"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-elegant text-foreground mb-4">
                  Featured Sydney Suppliers
                </h2>
                <p className="text-body-lg text-muted-foreground">
                  Handpicked professionals for your perfect wedding
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
                  <motion.div key={supplier.id} variants={fadeInUp}>
                    <Card className="luxury-card hover:shadow-lg transition-shadow h-full">
                      <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                        <img 
                          src={supplier.image} 
                          alt={supplier.name}
                          className="w-full h-full object-cover"
                        />
                        {supplier.verified && (
                          <Badge className="absolute top-3 left-3">
                            ✓ Verified
                          </Badge>
                        )}
                        <Badge variant="secondary" className="absolute top-3 right-3">
                          {supplier.price}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {supplier.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {supplier.category} • {supplier.location}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          {supplier.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{supplier.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({supplier.reviews})
                            </span>
                          </div>
                          <Button size="sm">
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="text-center mt-12"
                variants={fadeInUp}
                initial="initial"  
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Link to="/suppliers">
                  <Button size="lg">
                    View All Sydney Suppliers
                  </Button>
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Area Guide */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              
              <motion.div
                className="text-center mb-12"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-elegant text-foreground mb-4">
                  Sydney Wedding Areas
                </h2>
                <p className="text-body-lg text-muted-foreground">
                  Popular wedding locations across Sydney
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {cityData.popularAreas.map((area, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="luxury-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-foreground mb-2">
                              {area}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Multiple venues and suppliers available
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Explore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CitySydney;