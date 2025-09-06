"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const Stories = () => {
  const stories = [
    {
      id: 1,
      title: "10 Tips for Planning a South Asian Wedding in Australia & NZ",
      slug: "10-tips-planning-south-asian-wedding-australia-nz",
      excerpt: "Essential advice for couples planning their dream South Asian wedding across Australia and New Zealand.",
      cover_image: "/api/placeholder/600/400",
      author_name: "Wedding Planning Team",
      category: "Planning",
      read_time_minutes: 8,
      published_at: "2024-02-20T10:00:00Z"
    },
    {
      id: 2,
      title: "How to Balance Tradition and Modern Trends in Your Wedding",
      slug: "balance-tradition-modern-trends-wedding",
      excerpt: "Discover how to honor cultural traditions while incorporating contemporary elements in your special day.",
      cover_image: "/api/placeholder/600/400",
      author_name: "Cultural Wedding Expert",
      category: "Culture",
      read_time_minutes: 6,
      published_at: "2024-02-18T14:00:00Z"
    },
    {
      id: 3,
      title: "The Ultimate Checklist for Your Dream Shaadi",
      slug: "ultimate-checklist-dream-shaadi",
      excerpt: "A comprehensive checklist to ensure every detail of your South Asian wedding is perfectly planned.",
      cover_image: "/api/placeholder/600/400",
      author_name: "Shaadi Planning Experts",
      category: "Inspiration",
      read_time_minutes: 10,
      published_at: "2024-02-15T12:00:00Z"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Planning": return "bg-blue-100 text-blue-700";
      case "Culture": return "bg-purple-100 text-purple-700";
      case "Inspiration": return "bg-rose-100 text-rose-700";
      case "Vendors": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

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
              Wedding Stories & Tips
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground"
              variants={fadeInUp}
            >
              Real wedding stories, expert tips, and inspiration for your perfect South Asian celebration
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stories.map((story) => (
              <motion.div
                key={story.id}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link to={`/stories/${story.slug}`}>
                  <Card className="luxury-card overflow-hidden h-full">
                    <div className="relative">
                      <img
                        src={story.cover_image}
                        alt={story.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={getCategoryColor(story.category)}>
                          {story.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-heading font-semibold text-foreground leading-tight">
                          {story.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {story.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {story.read_time_minutes} min read
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(story.published_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stories;