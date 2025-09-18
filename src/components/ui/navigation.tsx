"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Wordmark from "@/components/brand/Wordmark";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { 
    label: 'How It Works', 
    href: '/how-it-works' 
  },
  { 
    label: 'Features', 
    dropdown: [
      { href: '/tools', label: 'Planning Tools' },
      { href: '/planning', label: 'Wedding Planning' },
      { href: '/stories', label: 'Success Stories' },
      { href: '/verification', label: 'Verification' },
    ]
  },
  { 
    label: 'For You', 
    dropdown: [
      { href: '/for-singles', label: 'For Singles' },
      { href: '/for-parents', label: 'For Parents' },
      { href: '/for-suppliers', label: 'For Suppliers' },
    ]
  },
  { 
    label: 'Destinations', 
    dropdown: [
      { href: '/destinations', label: 'All Destinations' },
      { href: '/city/sydney', label: 'Sydney' },
      { href: '/city/melbourne', label: 'Melbourne' },
      { href: '/city/auckland', label: 'Auckland' },
    ]
  },
  { 
    label: 'Pricing', 
    href: '/pricing' 
  },
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
            item.dropdown ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2 text-foreground hover:text-primary transition-colors text-sm font-medium">
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {item.dropdown.map((subItem) => (
                    <DropdownMenuItem key={subItem.href} asChild>
                      <Link to={subItem.href} className="cursor-pointer">
                        {subItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button key={item.label} variant="ghost" asChild className="px-4 py-2 text-foreground hover:text-primary transition-colors text-sm font-medium">
                <Link to={item.href}>
                  {item.label}
                </Link>
              </Button>
            )
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">
              Sign In
            </Link>
          </Button>
          <Button variant="luxury" size="sm" asChild>
            <Link to="/register">
              Join Free
            </Link>
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
                item.dropdown ? (
                  <div key={item.label} className="space-y-1">
                    <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                      {item.label}
                    </div>
                    {item.dropdown.map((subItem) => (
                      <Link 
                        key={subItem.href}
                        to={subItem.href}
                        className="block px-6 py-2 text-sm text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link 
                    key={item.label}
                    to={item.href}
                    className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button variant="luxury" className="w-full justify-start" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Join Free
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}