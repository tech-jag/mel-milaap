"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import Wordmark from "@/components/brand/Wordmark";

const footerSections = [
  {
    title: "Platform",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/stories", label: "Success Stories" },
      { href: "/verification", label: "Verification" },
      { href: "/trust", label: "Trust & Safety" },
    ]
  },
  {
    title: "For You",
    links: [
      { href: "/for-singles", label: "For Singles" },
      { href: "/for-parents", label: "For Parents" },
      { href: "/for-suppliers", label: "For Suppliers" },
      { href: "/tools", label: "Planning Tools" },
    ]
  },
  {
    title: "Destinations",
    links: [
      { href: "/destinations", label: "All Destinations" },
      { href: "/city/sydney", label: "Sydney" },
      { href: "/city/melbourne", label: "Melbourne" },
      { href: "/city/auckland", label: "Auckland" },
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
    ]
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/faqs", label: "FAQs" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/early-access", label: "Early Access" },
    ]
  }
];

const socialLinks = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mb-0">
      <div className="container mx-auto px-4 lg:px-8 lg:pl-80 py-16">
        {/* Brand Section */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center space-x-3 group mb-6">
            <motion.div 
              className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Heart className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <Wordmark className="h-7 text-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm text-muted-foreground">Find • Match • Marry • Celebrate</p>
            </div>
          </Link>
          
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Australia & New Zealand's premier South Asian matrimony platform. 
            Connecting hearts, celebrating traditions, building futures together.
          </p>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="text-center mb-12">
          <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest updates on new features, success stories, and community events.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-background border border-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="rounded-l-none">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-3 mb-8">
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.label}</span>
              </Button>
            </a>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2025 Mēl Milaap. All rights reserved. Connecting hearts across Australia & New Zealand.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Verified Profiles</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Private & Secure</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Local ANZ Community</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}