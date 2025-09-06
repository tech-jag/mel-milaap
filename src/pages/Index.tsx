"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { VideoHero } from "@/components/ui/video-hero";
import { JourneySteps } from "@/components/ui/journey-steps";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Shield, 
  Users, 
  Star, 
  MapPin, 
  Camera, 
  Utensils, 
  Music,
  Sparkles,
  CheckCircle,
  Quote
} from "lucide-react";
import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";

// Metrics data
const metrics = [
  { value: "15,000+", label: "Verified Profiles" },
  { value: "2,500+", label: "Successful Matches" },
  { value: "800+", label: "Trusted Suppliers" },
  { value: "50+", label: "Cities Covered" },
];

// Featured categories
const categories = [
  { name: "Wedding Venues", icon: MapPin, count: "120+ venues" },
  { name: "Photographers", icon: Camera, count: "200+ professionals" },
  { name: "Catering Services", icon: Utensils, count: "150+ caterers" },
  { name: "Entertainment", icon: Music, count: "80+ artists" },
];

// Testimonials
const testimonials = [
  {
    quote: "Found my soulmate through Mēl Milaap. The platform made everything so easy and secure.",
    author: "Priya & Rahul",
    location: "Sydney, NSW",
    image: "/api/placeholder/60/60"
  },
  {
    quote: "As wedding suppliers, we've connected with amazing couples. Highly recommend!",
    author: "Golden Palace Venues",
    location: "Melbourne, VIC",
    image: "/api/placeholder/60/60"
  },
  {
    quote: "The verification process gave us confidence. Found our perfect match within 3 months.",
    author: "Aisha & Dev",
    location: "Auckland, NZ",
    image: "/api/placeholder/60/60"
  },
];

const Index = () => {
  const [stickyVisible, setStickyVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.4;
      setStickyVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <VideoHero
        title="Find your person. Plan a wedding worthy of forever."
        subtitle="Australia & New Zealand's premier South Asian matrimony platform. Connecting hearts, celebrating traditions, creating lifelong memories."
        primaryCTA={{ text: "Find a Match", href: "/match" }}
        secondaryCTA={{ text: "Find Suppliers", href: "/suppliers" }}
      />

      {/* Journey Steps */}
      <JourneySteps />

      {/* Metrics Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {metrics.map((metric) => (
              <motion.div
                key={metric.label}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="text-4xl lg:text-5xl font-heading font-bold text-gradient-primary mb-2">
                  {metric.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Top Wedding Categories
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Discover premium wedding suppliers across Australia & New Zealand
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.name}
                variants={{...fadeInUp, ...cardHover}}
                whileHover="hover"
              >
                <Card className="luxury-card cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <category.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p>
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
              <Button variant="luxury" size="lg" asChild>
                <a href="/suppliers">Explore All Categories</a>
              </Button>
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
            <h2 className="text-luxury-lg text-foreground mb-6">
              Love Stories & Success Stories
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from couples and suppliers in our community
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={{...fadeInUp, ...cardHover}}
                whileHover="hover"
              >
                <Card className="luxury-card h-full">
                  <CardContent className="p-8">
                    <Quote className="w-8 h-8 text-accent mb-6" />
                    <p className="text-foreground leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 lg:gap-16"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: CheckCircle, text: "Verified Profiles", color: "text-success" },
              { icon: Shield, text: "Private & Secure", color: "text-primary" },
              { icon: Users, text: "Local ANZ Community", color: "text-accent" },
              { icon: Star, text: "Reviewed Suppliers", color: "text-lux-champagne" },
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

      {/* Sticky CTA */}
      {stickyVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Button variant="luxury" size="lg" className="shadow-luxury" asChild>
            <a href="/auth/signup">
              <Heart className="w-5 h-5 mr-2" />
              Start Your Journey
            </a>
          </Button>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default Index;
