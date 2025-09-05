"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search,
  HelpCircle,
  MessageCircle,
  Shield,
  Heart,
  Users,
  CreditCard
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const faqCategories = [
  {
    icon: Users,
    title: "Getting Started",
    description: "Account setup and first steps"
  },
  {
    icon: Heart,
    title: "Finding Matches",
    description: "Search, filters, and connections"
  },
  {
    icon: Shield,
    title: "Safety & Privacy",
    description: "Verification and security"
  },
  {
    icon: CreditCard,
    title: "Billing & Plans",
    description: "Subscriptions and payments"
  }
];

const faqs = [
  {
    category: "getting-started",
    question: "How do I create an account?",
    answer: "Creating an account is simple! Click 'Sign Up' in the top right corner, fill in your basic details, verify your email, and complete your profile. The entire process takes about 10 minutes."
  },
  {
    category: "getting-started",
    question: "Is Shaadi & Co free to use?",
    answer: "Yes, we offer a free membership that allows you to create a profile, browse matches, and send limited messages. Premium plans offer additional features like unlimited messaging, advanced filters, and priority support."
  },
  {
    category: "getting-started",
    question: "What information do I need to provide?",
    answer: "You'll need basic details like your name, age, location, education, profession, and preferences for a partner. All information is kept private and only shown to verified members based on your privacy settings."
  },
  {
    category: "matches",
    question: "How does the matching algorithm work?",
    answer: "Our algorithm considers multiple factors including your preferences for age, location, education, religion, community, lifestyle choices, and compatibility factors. We also learn from your activity to improve match suggestions."
  },
  {
    category: "matches",
    question: "Can I search for specific criteria?",
    answer: "Absolutely! Use our advanced search filters to find matches based on age range, location, education, profession, religion, community, mother tongue, and many other preferences."
  },
  {
    category: "matches",
    question: "How do I express interest in someone?",
    answer: "You can express interest by clicking the 'Express Interest' button on their profile. If they're also interested, you'll both receive a notification and can start messaging each other."
  },
  {
    category: "matches",
    question: "Why can't I see some profile photos?",
    answer: "Photos are protected until mutual interest is established or one party has a Premium membership. This ensures privacy and encourages meaningful connections rather than superficial judgments."
  },
  {
    category: "safety",
    question: "How do you verify profiles?",
    answer: "All members must upload government-issued ID and a verification selfie. Our team manually reviews each submission to ensure authenticity. Verified members receive a badge on their profile."
  },
  {
    category: "safety",
    question: "What if I encounter inappropriate behavior?",
    answer: "Use our instant report feature on any profile or message. Our 24/7 moderation team investigates all reports promptly. You can also block users to prevent further contact."
  },
  {
    category: "safety",
    question: "How is my personal information protected?",
    answer: "We use industry-leading encryption and security measures. Your contact details are never shared without your permission, and you control what information is visible to other members."
  },
  {
    category: "safety",
    question: "Are there safety tips for meeting in person?",
    answer: "Always meet in public places, inform friends/family of your plans, drive yourself or arrange your own transport, and trust your instincts. Take time to get to know someone through our platform first."
  },
  {
    category: "billing",
    question: "What are the Premium plan benefits?",
    answer: "Premium members get unlimited messaging, see who viewed their profile, access advanced search filters, get priority customer support, and can view photos before mutual interest."
  },
  {
    category: "billing",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time through your account settings or by contacting our support team. Your premium features will continue until the end of your billing period."
  },
  {
    category: "billing",
    question: "Do you offer refunds?",
    answer: "We offer a 7-day money-back guarantee for first-time Premium subscribers. Refunds are evaluated on a case-by-case basis for longer subscriptions. Contact our support team for assistance."
  },
  {
    category: "billing",
    question: "Are there family/parent accounts?",
    answer: "Yes, we offer family plans where parents can create and manage profiles for their children (with consent). This includes special privacy settings and communication preferences."
  }
];

const Faqs = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
                <HelpCircle className="w-4 h-4 mr-2" />
                Frequently Asked Questions
              </Badge>
              <h1 className="text-luxury-xl text-foreground mb-6">
                How Can We Help You?
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Find answers to common questions about using Shaadi & Co, 
                from account setup to finding your perfect match.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Button
                variant={selectedCategory === "all" ? "luxury" : "outline"}
                className="w-full h-auto p-4 flex-col space-y-2"
                onClick={() => setSelectedCategory("all")}
              >
                <HelpCircle className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">All Topics</div>
                  <div className="text-xs opacity-70">View everything</div>
                </div>
              </Button>
            </motion.div>
            
            {faqCategories.map((category, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Button
                  variant={selectedCategory === category.title.toLowerCase().replace(' ', '-').replace('&', '').replace(' ', '') ? "luxury" : "outline"}
                  className="w-full h-auto p-4 flex-col space-y-2"
                  onClick={() => setSelectedCategory(category.title.toLowerCase().replace(' ', '-').replace('&', '').replace(' ', ''))}
                >
                  <category.icon className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-semibold">{category.title}</div>
                    <div className="text-xs opacity-70">{category.description}</div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {filteredFaqs.length > 0 ? (
                <Card className="luxury-card">
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0">
                          <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                            <span className="font-heading font-semibold">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-8 pb-6">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    No results found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try searching with different keywords or browse all topics.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-md text-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8">
              Our friendly support team is here to help you every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="luxury" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Faqs;