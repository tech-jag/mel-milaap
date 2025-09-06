"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [user, setUser] = React.useState<any>(null);
  const [userPlan, setUserPlan] = React.useState('free');

  React.useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserPlan(session.user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserPlan(session.user.id);
        } else {
          setUserPlan('free');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserPlan = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single();
    
    if (data?.plan) {
      setUserPlan(data.plan);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

return (
  <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group" aria-label="Mel Milaap home">
          <motion.div
            className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Heart className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
          </motion.div>
          <div className="hidden md:block">
            {/* Use HTML entity so the accent always renders */}
            <h1 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
              M&eacute;l Milaap
            </h1>
            <p className="text-xs text-muted-foreground">
              Find &bull; Match &bull; Marry &bull; Celebrate
            </p>
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
            {user ? (
              <>
                <Link to="/account">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="space-x-2">
                      <User className="w-4 h-4" />
                      <span>{user.user_metadata?.name || 'My Account'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="w-full cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/profile" className="w-full cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="luxury" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive" 
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth/signup" onClick={() => setIsOpen(false)}>
                      <Button variant="luxury" className="w-full justify-start">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}