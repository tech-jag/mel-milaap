"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import Wordmark from "@/components/brand/Wordmark";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: '#benefits', label: 'Benefits' },
  { href: '#early-access', label: 'Join Founders Circle' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

return (
  <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group" aria-label="Go to home">
          <motion.div
            className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Heart className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
          </motion.div>
          <div className="hidden md:flex md:flex-col">
            <Wordmark className="h-6 text-foreground group-hover:text-primary transition-colors" />
            <p className="text-xs text-muted-foreground">
              Find &bull; Match &bull; Marry &bull; Celebrate
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <button 
              key={item.href} 
              onClick={() => handleNavClick(item.href)}
              className="px-4 py-2 text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button 
            variant="luxury" 
            size="sm"
            onClick={() => handleNavClick('#early-access')}
          >
            Join Now
          </Button>
        </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 py-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button 
                  key={item.href} 
                  onClick={() => handleNavClick(item.href)}
                  className="px-4 py-2 text-left text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                <Button 
                  variant="luxury" 
                  className="w-full justify-start"
                  onClick={() => handleNavClick('#early-access')}
                >
                  Join Founders Circle
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}