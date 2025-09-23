"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FloralBranding } from "@/components/ui/FloralBranding";
import { Navigation } from "@/components/ui/navigation"; // Assuming navigation is in this path
import { Footer } from "@/components/ui/footer"; // Assuming footer is in this path

import {
  Heart, Shield, Users, Sparkles, CheckCircle, ArrowRight,
  Globe, Award, MapPin, Camera, Building2, Utensils, Palette,
  Crown, UserCheck, Lock, Phone,
} from "lucide-react";
import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";
import { SEO } from "@/utils/seo";
import heroImage from "@/assets/hero-wedding-couple.jpg";

// Data has been centralized at the top for clarity and easier management.

const howItWorksSteps = [
  {
    number: "01",
    icon: UserCheck,
    title: "FIND", // CORRECTED: Changed from MEET to FIND
    subtitle: "Create your profile and browse verified matches",
    description: "Build a comprehensive profile with photos, preferences, and cultural background. Connect with genuine, quality conscious individuals.",
    features: ["Profile verification required", "Photo authentication", "Background checks"]
  },
  {
    number: "02",
    icon: Heart,
    title: "MATCH",
    subtitle: "Connect with compatible South Asian singles",
    description: "Our advanced matching algorithm considers cultural compatibility, regional preferences, and family values to suggest the most suitable matches.",
    features: ["Advanced compatibility", "Cultural alignment", "Regional focus"]
  },
  {
    number: "03",
    icon: Crown,
    title: "MARRY",
    subtitle: "Build meaningful connections that lead to marriage",
    description: "Engage in safe, monitored communication with family involvement. Focus on serious matrimonial intentions and build trust.",
    features: ["Safe communication", "Family involvement", "Matrimonial focus"]
  },
  {
    number: "04",
    icon: Sparkles,
    title: "CELEBRATE",
    subtitle: "Plan your dream wedding with our vendor network",
    description: "Access our curated network of premium wedding vendors across Australia & New Zealand. Dream, plan, and execute your celebration.",
    features: ["Premium vendor network", "Wedding planning", "Celebration management"]
  }
];

const perfectMatchFeatures = [
  { icon: UserCheck, title: "Verified Premium Profiles", description: "Every profile undergoes thorough verification. Connect with genuine individuals who share your values." },
  { icon: Heart, title: "Cultural Compatibility", description: "Deep understanding of South Asian traditions and family values. Find matches who truly understand your heritage." },
  { icon: MapPin, title: "Australia & NZ Expertise", description: "A specialized focus on the unique diaspora dynamics in Australia and New Zealand." },
  { icon: Users, title: "Personalized Matching", description: "Advanced algorithms combined with human insight to ensure meaningful connections." },
  { icon: Shield, title: "Privacy & Safety First", description: "Best-in-class security and complete privacy controls in a family-friendly environment." },
  { icon: Crown, title: "Premium Experience", description: "Quality over quantity, dedicated support, and success stories that speak to our commitment." }
];

const safetyFeatures = [
  { icon: UserCheck, title: "100% Profile Verification", description: "Comprehensive verification process including government ID for authentic connections.", stats: ["ID verification", "Photo authentication", "Background screening"] },
  { icon: Lock, title: "Advanced Privacy Control", description: "You control who sees your photos and personal information with granular privacy settings.", stats: ["Private photo control", "Selective visibility", "Information control"] },
  { icon: Shield, title: "Safe Communication", description: "All communications happen securely within the platform with continuous safety monitoring.", stats: ["Monitored messaging", "Report & block features", "Safe environment"] },
  { icon: Phone, title: "Scam Prevention", description: "Advanced fraud detection and prevention systems help maintain an authentic community.", stats: ["Fraud detection", "Authentic profiles", "Scam prevention"] }
];

const successStories = [
  { quote: "We found each other through Mēl Milaap and couldn't be happier. The platform truly understands our cultural values.", names: "Priya & Arjun", location: "Sydney, Australia" },
  { quote: "The wedding planning tools made our celebration perfect. Everything in one place!", names: "Kavya & Vikram", location: "Melbourne, Australia" },
  { quote: "Our families loved being involved in the process. Mēl Milaap respects our traditions.", names: "Anisha & Raj", location: "Auckland, New Zealand" }
];

const Home = () => {
  return (
    // CORRECTED: Added `relative` and `overflow-hidden` for proper layering context.
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO
        title="Mēl Milaap - Australia & New Zealand's Premier South Asian Matrimony Platform"
        description="Find your perfect match in Australia & New Zealand's most trusted South Asian matrimony platform. Join thousands of verified members today."
      />

      <FloralBranding variant="homepage" className="z-0" />

      <main className="relative z-10 flex flex-col min-h-screen">
        <Navigation />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Beautiful South Asian wedding couple"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-lux-onyx/70 via-lux-onyx/50 to-transparent" />
          </div>

          {/* CORRECTED: Added `text-center` to the container and `mx-auto` to the inner div to center all content. */}
          <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <Badge
                variant="secondary"
                className="mb-8 px-6 py-2 text-base bg-lux-porcelain/20 text-lux-porcelain border-lux-champagne/30"
              >
                <Heart className="w-4 h-4 mr-2" />
                Australia & New Zealand's #1 South Asian Matrimony Platform
              </Badge>

              <div className="mb-8">
                {/* CORRECTED: Removed inline style and used consistent `font-heading` from your design system. */}
                <h1 className="text-lux-porcelain font-heading font-bold mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '-0.02