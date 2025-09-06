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
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How it Works" },
      { href: "/for/parents", label: "Parents Welcome" },
      { href: "/verification", label: "Verification" },
    ]
  },
  {
    title: "For Suppliers",
    links: [
      { href: "/supplier/signup", label: "Supplier Sign-up" },
      { href: "/supplier/dashboard", label: "Supplier Dashboard" },
      { href: "/suppliers/featured", label: "Featured Listings" },
      { href: "/suppliers/pricing", label: "Supplier Pricing" },
    ]
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faqs", label: "FAQs" },
      { href: "/trust", label: "Trust & Safety" },
      { href: "/help", label: "Help Center" },
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press Kit" },
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
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group mb-6">
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
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Australia & New Zealand's premier South Asian matrimony and wedding platform. 
              Connecting hearts, celebrating traditions, creating memories.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="hover:text-primary">
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-semibold text-foreground mb-4">
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