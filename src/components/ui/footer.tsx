"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import Wordmark from "@/components/brand/Wordmark";

const footerSections = [
  {
    title: "Coming Soon",
    links: [
      { href: "#benefits", label: "Founder Benefits" },
      { href: "#early-access", label: "Join Waiting List" },
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
        <div className="text-center mb-12">
          {/* Brand Section */}
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
            Australia & New Zealand's most exclusive South Asian matrimony platform. 
            Join our founders circle for early access and premium benefits.
          </p>

          {/* Footer Links */}
          <div className="flex justify-center space-x-8 mb-8">
            {footerSections[0].links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-3">
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