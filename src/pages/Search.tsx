"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountHeader } from "@/components/ui/account-header";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search as SearchIcon, 
  Filter, 
  Heart, 
  MessageCircle, 
  MapPin, 
  Briefcase, 
  Shield,
  Eye,
  ChevronDown,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Search = () => {
  const { user } = useAuth();
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("relevance");

  // Load real profiles from database
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('profile_ready', true);
      
      if (!error && data) {
        setAllProfiles(data);
        setDisplayedProfiles(data.slice(0, 20));
      }
    } catch (err) {
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = allProfiles;

    // Apply any filters here based on filter state
    // For now, just using all profiles

    // Sort the results
    if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "age") {
      filtered = [...filtered].sort((a, b) => a.age - b.age);
    }

    setDisplayedProfiles(filtered.slice(0, 20));
  };

  React.useEffect(() => {
    applyFilters();
  }, [sortBy, allProfiles]);

  if (!user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          <AccountSidebar />
          
          <div className="flex-1">
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold mb-4">Please sign in to search profiles</h1>
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          <AccountSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <AccountHeader
            title="Search Profiles"
            description="Find your perfect match"
            icon={SearchIcon}
            backUrl="/account"
            backText="Back to Dashboard"
          >
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </AccountHeader>

          {/* Search Content */}
          <section className="py-4 lg:py-8">
            <div className="container mx-auto px-4 max-w-7xl">
              
              {/* Search Stats */}
              <div className="mb-6 lg:mb-8 p-4 bg-card rounded-lg border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{displayedProfiles.length}</div>
                      <div className="text-sm text-muted-foreground">Profiles Found</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {displayedProfiles.filter(p => p.subscription_tier === 'premium').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Premium</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-background border border-border rounded-md px-3 py-1 text-sm"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="newest">Newest First</option>
                      <option value="age">Age</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleContent>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Age Range</label>
                          <div className="flex gap-2">
                            <input type="number" placeholder="Min" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                            <input type="number" placeholder="Max" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Location</label>
                          <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                            <option>All Locations</option>
                            <option>Sydney, NSW</option>
                            <option>Melbourne, VIC</option>
                            <option>Brisbane, QLD</option>
                            <option>Perth, WA</option>
                            <option>Adelaide, SA</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Religion</label>
                          <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                            <option>All Religions</option>
                            <option>Hindu</option>
                            <option>Muslim</option>
                            <option>Christian</option>
                            <option>Sikh</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Profession</label>
                          <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
                            <option>All Professions</option>
                            <option>Engineer</option>
                            <option>Doctor</option>
                            <option>Teacher</option>
                            <option>Business</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button onClick={applyFilters}>Apply Filters</Button>
                        <Button variant="outline">Clear All</Button>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Search Results Grid */}
              <motion.div
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {displayedProfiles.map((profile) => (
                  <motion.div key={profile.user_id} variants={fadeInUp}>
                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <img 
                          src={profile.photo_primary_url || '/placeholder.svg'} 
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex gap-1">
                          <Badge className="bg-green-500 text-white text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                          {profile.subscription_tier === 'premium' && (
                            <Badge className="bg-purple-500 text-white text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="rounded-full" asChild>
                              <Link to={`/profile/${profile.user_id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="secondary" className="rounded-full">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="rounded-full bg-red-500 hover:bg-red-600">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg truncate">
                              {profile.first_name} {profile.last_name}
                            </h3>
                            <span className="text-sm text-muted-foreground">{profile.age}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{profile.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{profile.profession}</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
                          
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1" asChild>
                              <Link to={`/profile/${profile.user_id}`}>
                                View Profile
                              </Link>
                            </Button>
                            <Button size="sm" className="flex-1">
                              Connect
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Load More */}
              {displayedProfiles.length < allProfiles.length && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const nextBatch = allProfiles.slice(displayedProfiles.length, displayedProfiles.length + 20);
                      setDisplayedProfiles([...displayedProfiles, ...nextBatch]);
                    }}
                  >
                    Load More Profiles
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Search;