"use client";

import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart,
  DollarSign,
  Users,
  Calendar,
  CheckSquare,
  Gift,
  BookOpen,
  Globe,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Zap,
  Crown
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";

const PublicPlanning = () => {
  const { user } = useAuth();

  const planningTools = [
    {
      category: "Essential Tools",
      tools: [
        {
          name: "Budget Tracker",
          description: "Track expenses and manage your wedding budget",
          icon: DollarSign,
          tier: "Free",
          features: ["Expense categories", "Spending alerts", "Budget reports"]
        },
        {
          name: "Guest List Manager",
          description: "Organize guests and track RSVPs effortlessly",
          icon: Users,
          tier: "Free", 
          features: ["Contact management", "RSVP tracking", "Guest groups"]
        },
        {
          name: "Wedding Checklist",
          description: "Stay organized with our comprehensive checklist",
          icon: CheckSquare,
          tier: "Free",
          features: ["Timeline-based tasks", "Custom reminders", "Progress tracking"]
        }
      ]
    },
    {
      category: "Premium Tools",
      tools: [
        {
          name: "Timeline Planner",
          description: "Create detailed wedding planning timelines",
          icon: Calendar,
          tier: "Premium",
          features: ["Custom milestones", "Vendor deadlines", "Team collaboration"]
        },
        {
          name: "Seating Planner", 
          description: "Design your reception seating arrangement",
          icon: Globe,
          tier: "Premium",
          features: ["Drag & drop interface", "Table management", "Guest preferences"]
        },
        {
          name: "Vendor CRM",
          description: "Manage supplier relationships and contracts",
          icon: Shield,
          tier: "Premium+",
          features: ["Contract tracking", "Payment schedules", "Communication logs"]
        }
      ]
    },
    {
      category: "Advanced Features",
      tools: [
        {
          name: "Gift Registry",
          description: "Create and share your wedding registry",
          icon: Gift,
          tier: "Premium",
          features: ["Multiple store links", "Guest tracking", "Thank you management"]
        },
        {
          name: "Planning Notes",
          description: "Save inspiration and ideas in one place",
          icon: BookOpen,
          tier: "Free",
          features: ["Photo uploads", "Idea boards", "Vendor notes"]
        },
        {
          name: "Analytics Dashboard",
          description: "Get insights into your planning progress",
          icon: Zap,
          tier: "Premium+",
          features: ["Progress metrics", "Budget analytics", "Guest insights"]
        }
      ]
    }
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with basic planning tools",
      features: [
        "Budget Tracker",
        "Guest List (up to 100 guests)",
        "Wedding Checklist", 
        "Planning Notes",
        "Email support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Premium", 
      price: "$49",
      period: "total",
      description: "Enhanced tools for comprehensive wedding planning",
      features: [
        "Everything in Free",
        "Unlimited guest list",
        "Timeline Planner",
        "Seating Chart Designer",
        "Gift Registry",
        "Priority support"
      ],
      cta: "Get Premium",
      popular: true
    },
    {
      name: "Premium+",
      price: "$79", 
      period: "total",
      description: "Professional-grade planning with advanced features",
      features: [
        "Everything in Premium",
        "Vendor CRM & Contracts",
        "Analytics Dashboard", 
        "Multi-language support",
        "Phone support",
        "Planning consultation"
      ],
      cta: "Go Premium+",
      popular: false
    }
  ];

  const testimonials = [
    {
      quote: "The planning tools made our wedding organization so much easier. Everything in one place!",
      author: "Priya & Raj",
      location: "Sydney, NSW"
    },
    {
      quote: "The seating planner saved us hours of stress. Highly recommend the premium features.",
      author: "Anjali & Dev", 
      location: "Melbourne, VIC"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Wedding Planning Tools | Mēl Milaap - Budget, Guest List, Checklist & More</title>
        <meta 
          name="description" 
          content="Comprehensive wedding planning tools for South Asian couples in Australia & New Zealand. Free budget tracker, guest list manager, timeline planner, and more." 
        />
        <meta name="keywords" content="wedding planning, South Asian weddings, budget tracker, guest list, wedding checklist, Australia, New Zealand" />
        <link rel="canonical" href={`${window.location.origin}/planning`} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Wedding Planning Tools | Mēl Milaap" />
        <meta property="og:description" content="Comprehensive wedding planning tools for South Asian couples. Budget tracking, guest management, timeline planning and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/planning`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wedding Planning Tools | Mēl Milaap" />
        <meta name="twitter:description" content="Comprehensive wedding planning tools for South Asian couples." />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Wedding Planning Tools",
            "description": "Comprehensive wedding planning tools for South Asian couples",
            "url": `${window.location.origin}/planning`,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": window.location.origin
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "Planning Tools",
                  "item": `${window.location.origin}/planning`
                }
              ]
            },
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What planning tools are available for free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our free plan includes a budget tracker, guest list manager for up to 100 guests, wedding checklist, and planning notes."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "How much does Premium planning cost?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Premium planning is $49 total (one-time payment) and includes unlimited guest list, timeline planner, seating chart designer, and more."
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-6">
                  <Heart className="w-4 h-4 mr-2" />
                  Wedding Planning Made Simple
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-6">
                  Plan Your Perfect
                  <span className="text-gradient-primary"> South Asian Wedding</span>
                </h1>
                <p className="text-body-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Everything you need to plan your dream wedding in one place. From budget tracking 
                  to guest management, timeline planning to seating arrangements - we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {user ? (
                    <Link to="/account/planning">
                      <Button size="xl" className="bg-gradient-primary text-primary-foreground hover:scale-105">
                        Go to My Planning Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth/signup?returnTo=/account/planning">
                        <Button size="xl" className="bg-gradient-primary text-primary-foreground hover:scale-105">
                          Start Planning Free
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                      <Link to="/auth/login?returnTo=/account/planning">
                        <Button size="xl" variant="outline">
                          Login to Continue
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Planning Tools Overview */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="text-center mb-16"
                variants={fadeInUp}
                initial="initial" 
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h2 className="text-luxury-lg text-foreground mb-4">
                  Comprehensive Planning Tools
                </h2>
                <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
                  Professional wedding planning tools designed specifically for South Asian celebrations
                </p>
              </motion.div>

              {planningTools.map((category, categoryIndex) => (
                <div key={category.category} className="mb-16">
                  <motion.h3
                    className="text-2xl font-heading font-semibold text-foreground mb-8 text-center"
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    {category.category}
                  </motion.h3>
                  
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {category.tools.map((tool, toolIndex) => (
                      <motion.div
                        key={tool.name}
                        variants={cardHover}
                        whileHover="hover"
                      >
                        <Card className="h-full luxury-card">
                          <CardHeader>
                            <div className="flex items-center justify-between mb-4">
                              <div className="p-3 bg-primary/10 rounded-xl">
                                <tool.icon className="w-6 h-6 text-primary" />
                              </div>
                              <Badge 
                                variant={tool.tier === 'Free' ? 'secondary' : tool.tier === 'Premium' ? 'default' : 'outline'}
                                className={tool.tier === 'Premium+' ? 'border-accent text-accent-foreground' : ''}
                              >
                                {tool.tier === 'Premium+' && <Crown className="w-3 h-3 mr-1" />}
                                {tool.tier}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <p className="text-muted-foreground text-sm">
                              {tool.description}
                            </p>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {tool.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center text-sm">
                                  <CheckSquare className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="text-center mb-16"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate" 
                viewport={{ once: true }}
              >
                <h2 className="text-luxury-lg text-foreground mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose the plan that fits your wedding planning needs. All plans include lifetime access.
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {pricingTiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    variants={cardHover}
                    whileHover="hover"
                    className={tier.popular ? 'md:scale-105 z-10' : ''}
                  >
                    <Card className={`h-full luxury-card relative ${tier.popular ? 'border-primary shadow-luxury' : ''}`}>
                      {tier.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-8">
                        <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-primary">{tier.price}</span>
                          {tier.period && <span className="text-muted-foreground ml-1">/{tier.period}</span>}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {tier.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent>
                        <ul className="space-y-3 mb-8">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-sm">
                              <CheckSquare className="w-4 h-4 text-success mr-3 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        {user ? (
                          <Link to="/account/planning" className="block">
                            <Button 
                              className="w-full" 
                              variant={tier.popular ? "luxury" : "outline"}
                            >
                              Access Tools
                            </Button>
                          </Link>
                        ) : (
                          <Link to="/auth/signup?returnTo=/account/planning" className="block">
                            <Button 
                              className="w-full" 
                              variant={tier.popular ? "luxury" : "outline"}
                            >
                              {tier.cta}
                            </Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h2 className="text-luxury-lg text-foreground mb-4">
                  Trusted by Couples Across Australia & New Zealand
                </h2>
                <p className="text-body-lg text-muted-foreground mb-12">
                  See what couples are saying about our planning tools
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="luxury-card text-left">
                      <CardContent className="p-8">
                        <div className="mb-6">
                          <div className="flex text-accent mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                          </div>
                          <p className="text-foreground italic">
                            "{testimonial.quote}"
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-luxury-lg mb-6">
                Ready to Plan Your Dream Wedding?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of couples who have successfully planned their perfect South Asian wedding with our tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link to="/account/planning">
                    <Button size="xl" variant="hero" className="bg-background text-primary hover:bg-background/90">
                      Access My Planning Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/signup?returnTo=/account/planning">
                      <Button size="xl" variant="hero" className="bg-background text-primary hover:bg-background/90">
                        Start Planning for Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/pricing">
                      <Button size="xl" variant="outline" className="border-background text-background hover:bg-background hover:text-primary">
                        View All Features
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PublicPlanning;