"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Users, 
  Globe, 
  Award,
  TrendingUp,
  MapPin,
  Calendar,
  Shield
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const stats = [
  { icon: Users, value: "15,000+", label: "Active Members" },
  { icon: Heart, value: "2,500+", label: "Success Stories" },
  { icon: MapPin, value: "50+", label: "Cities Covered" },
  { icon: Calendar, value: "5+", label: "Years of Trust" }
];

const values = [
  {
    icon: Heart,
    title: "Authentic Connections",
    description: "We believe in genuine relationships built on shared values, traditions, and aspirations."
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Your security is paramount. We maintain the highest standards of privacy and verification."
  },
  {
    icon: Globe,
    title: "Cultural Celebration",
    description: "Honoring South Asian traditions while embracing modern relationship dynamics."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to providing the finest matrimony experience with premium service quality."
  }
];

const team = [
  {
    name: "Priya Sharma",
    role: "Founder & CEO",
    bio: "Former McKinsey consultant with 15 years in technology and community building.",
    image: "/api/placeholder/300/300"
  },
  {
    name: "Rajesh Patel",
    role: "Chief Technology Officer",
    bio: "Ex-Google engineer passionate about creating secure, scalable platforms for meaningful connections.",
    image: "/api/placeholder/300/300"
  },
  {
    name: "Anita Singh",
    role: "Head of Community",
    bio: "Relationship counselor and community advocate ensuring positive member experiences.",
    image: "/api/placeholder/300/300"
  }
];

const About = () => {
  return (
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
                About Us
              </Badge>
              <h1 className="text-luxury-xl text-foreground mb-6">
                Connecting Hearts, Celebrating Traditions
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Founded in 2019, Mēl Milaap has become Australia and New Zealand's most trusted 
                South Asian matrimony platform, helping thousands find their perfect match.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl lg:text-4xl font-heading font-bold text-gradient-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-luxury-lg text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Mēl Milaap was born from a simple observation: traditional matrimony processes 
                  needed to evolve for the modern South Asian diaspora. Our founders, themselves 
                  navigating the complexities of finding life partners while maintaining cultural 
                  values, saw an opportunity to create something better.
                </p>
                <p>
                  What started as a vision to bridge traditional matchmaking with modern technology 
                  has grown into Australia and New Zealand's most trusted matrimony platform. 
                  We've facilitated over 2,500 successful marriages while maintaining the highest 
                  standards of safety, privacy, and cultural sensitivity.
                </p>
                <p>
                  Today, we're proud to serve a vibrant community of South Asian singles and 
                  families across 50+ cities, offering not just matchmaking but comprehensive 
                  wedding planning services through our trusted vendor network.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="order-first lg:order-last"
            >
              <div className="relative">
                <div className="w-full h-96 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Heart className="w-24 h-24 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
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
              Our Values
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="luxury-card h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-foreground mb-3">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leadership Team */}
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
              Leadership Team
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate team behind Mēl Milaap
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="luxury-card text-center">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      {member.name}
                    </h3>
                    <p className="text-accent font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
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
            className="max-w-4xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8">
              Join thousands of members who have found their perfect match through our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="luxury" size="lg">
                Start Your Journey
              </Button>
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;