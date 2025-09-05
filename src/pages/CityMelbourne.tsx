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

const CityMelbourne = () => {
  const featuredSuppliers = [
    {
      id: '1',
      name: 'Yarra Valley Estates',
      category: 'Venue',
      location: 'Yarra Valley',
      rating: 4.9,
      reviews: 203,
      image: '/placeholder.svg',
      description: 'Luxury vineyard weddings with stunning valley views',
      price: '$$$$',
      verified: true
    },
    {
      id: '2',
      name: 'Melbourne Wedding Films',
      category: 'Videography',
      location: 'South Melbourne',
      rating: 4.8,
      reviews: 156,
      image: '/placeholder.svg',
      description: 'Cinematic wedding videography',
      price: '$$$',
      verified: true
    },
    {
      id: '3',
      name: 'Gardens by Design',
      category: 'Florist',
      location: 'Prahran',
      rating: 4.7,
      reviews: 89,
      image: '/placeholder.svg',
      description: 'Contemporary floral design',
      price: '$$',
      verified: true
    }
  ];

  const categories = [
    { name: 'Venues', icon: MapPin, count: 52 },
    { name: 'Photography', icon: Camera, count: 89 },
    { name: 'Catering', icon: Utensils, count: 67 },
    { name: 'Music & Entertainment', icon: Music, count: 41 }
  ];

  const cityData = {
    name: 'Melbourne',
    state: 'Victoria',
    country: 'Australia',
    description: 'Cultural capital with diverse venues from urban rooftops to vineyard estates',
    supplierCount: 249,
    venueCount: 52,
    avgCost: 'AUD $32,000',
    popularAreas: ['CBD', 'South Melbourne', 'Yarra Valley', 'Mornington Peninsula']
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Wedding Suppliers in Melbourne",
    "description": cityData.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityData.name,
      "addressRegion": cityData.state,
      "addressCountry": cityData.country
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "ratingCount": "692"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "AUD",
      "lowPrice": "4500",
      "highPrice": "75000"
    }
  };

  return (
    <>
      <Helmet>
        <title>Melbourne Wedding Suppliers | Find Your Perfect Wedding Vendors</title>
        <meta name="description" content="Discover Melbourne's best wedding suppliers, from Yarra Valley venues to CBD photographers. Plan your perfect Melbourne wedding with verified vendors." />
        <meta name="keywords" content="Melbourne wedding suppliers, wedding venues Melbourne, Melbourne wedding photographers, wedding planning Melbourne" />
        <link rel="canonical" href="https://yoursite.com/city/melbourne" />
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
                  Melbourne Wedding Directory
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-6">
                  Melbourne Wedding Suppliers
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
                    4.7 Average Rating
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
                  Wedding Categories in Melbourne
                </h2>
                <p className="text-body-lg text-muted-foreground">
                  Explore Melbourne's top wedding service categories
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
                  Featured Melbourne Suppliers
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
                    View All Melbourne Suppliers
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
                  Melbourne Wedding Areas
                </h2>
                <p className="text-body-lg text-muted-foreground">
                  Popular wedding locations across Melbourne
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

export default CityMelbourne;