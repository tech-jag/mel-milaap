"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

// Mock blog posts
const blogPosts = [
  {
    id: 1,
    slug: "anz-south-asian-wedding-checklist",
    title: "The Complete ANZ South Asian Wedding Checklist",
    excerpt: "Everything you need to plan the perfect South Asian wedding in Australia and New Zealand.",
    author: "ANZ Matrimony Team",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    category: "Planning",
    featured: true,
    image: "/api/placeholder/600/300"
  },
  {
    id: 2,
    slug: "parents-guide-online-matrimony",
    title: "Parents' Guide to Online Matrimony",
    excerpt: "How parents can navigate modern matchmaking while honoring traditional values.",
    author: "ANZ Matrimony Team",
    publishedAt: "2024-01-10",
    readTime: "6 min read",
    category: "For Parents",
    featured: true,
    image: "/api/placeholder/600/300"
  },
  {
    id: 3,
    slug: "how-verification-works",
    title: "How Our Verification Process Works",
    excerpt: "Understanding our multi-step verification process for safe and secure matchmaking.",
    author: "ANZ Matrimony Team",
    publishedAt: "2024-01-05",
    readTime: "4 min read",
    category: "Trust & Safety",
    featured: false,
    image: "/api/placeholder/600/300"
  },
  {
    id: 4,
    slug: "cultural-wedding-traditions",
    title: "Honoring Cultural Traditions in Modern Weddings",
    excerpt: "Blending traditional South Asian customs with contemporary Australian wedding styles.",
    author: "Cultural Consultant",
    publishedAt: "2023-12-20",
    readTime: "7 min read",
    category: "Culture",
    featured: false,
    image: "/api/placeholder/600/300"
  },
  {
    id: 5,
    slug: "wedding-budget-australia",
    title: "Wedding Budget Guide for Australia & New Zealand",
    excerpt: "Comprehensive breakdown of wedding costs and how to plan your budget effectively.",
    author: "Planning Expert",
    publishedAt: "2023-12-15",
    readTime: "10 min read",
    category: "Planning",
    featured: false,
    image: "/api/placeholder/600/300"
  },
  {
    id: 6,
    slug: "online-dating-safety",
    title: "Staying Safe in Online Matrimony",
    excerpt: "Essential safety tips for meeting people online and protecting your privacy.",
    author: "Safety Team",
    publishedAt: "2023-12-10",
    readTime: "5 min read",
    category: "Trust & Safety",
    featured: false,
    image: "/api/placeholder/600/300"
  }
];

const categories = ["All", "Planning", "For Parents", "Trust & Safety", "Culture"];

const Stories = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  
  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
              Stories & Guides
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Expert advice, cultural insights, and success stories from the South Asian community
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === "All" && featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.h2 
              className="text-luxury-md text-foreground mb-12 text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Featured Stories
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featuredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="luxury-card overflow-hidden h-full">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="secondary">{post.category}</Badge>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-heading font-semibold text-foreground">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            {post.author}
                          </div>
                          <button className="text-primary hover:text-primary/80 font-medium">
                            Read More →
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {selectedCategory !== "All" && (
            <motion.h2 
              className="text-luxury-md text-foreground mb-12 text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {selectedCategory} Articles
            </motion.h2>
          )}
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {(selectedCategory === "All" ? regularPosts : filteredPosts).map((post) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="luxury-card overflow-hidden h-full">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">{post.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-heading font-semibold text-foreground">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <button className="text-primary hover:text-primary/80 font-medium">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stories;