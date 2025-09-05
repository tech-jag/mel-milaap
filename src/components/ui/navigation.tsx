"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/match", label: "Find a Match" },
  { href: "/suppliers", label: "Wedding Suppliers" },
  { href: "/planning", label: "Planning Tools" },
  { href: "/premium", label: "Premium Matchmaking" },
  { href: "/stories", label: "Stories" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust", label: "Trust & Safety" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Heart className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div className="hidden md:block">
              <h1 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                Shaadi & Co
              </h1>
              <p className="text-xs text-muted-foreground">Find • Match • Marry • Celebrate</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button variant="luxury" size="sm">
              Sign Up
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
                <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                <Button variant="ghost" className="justify-start">
                  Login
                </Button>
                <Button variant="luxury" className="justify-start">
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}