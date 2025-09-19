"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Search as SearchIcon, 
  Filter,
  MapPin, 
  Briefcase, 
  Shield,
  Heart,
  MessageCircle,
  Eye,
  User,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { AccountHeader } from "@/components/ui/account-header";

const Search = () => {
  const { user } = useAuth();
  const [ageRange, setAgeRange] = React.useState([25, 35]);
  const [heightRange, setHeightRange] = React.useState([150, 180]);
  // ADD MOBILE FILTER TOGGLE STATE
  const [showFilters, setShowFilters] = React.useState(false);
  
  // Mock search results
  const searchResults = [
    {
      id: 1,
      name: "Priya S.",
      age: 28,
      location: "Sydney, NSW",
      profession: "Software Engineer",
      photos: ["/api/placeholder/300/400"],
      verified: true,
      lastSeen: "2 hours ago",
      compatibility: 92,
      premium: true
    },
    {
      id: 2,
      name: "Anjali K.",
      age: 26,
      location: "Melbourne, VIC",
      profession: "Doctor",
      photos: ["/api/placeholder/300/400"],
      verified: true,
      lastSeen: "1 day ago",
      compatibility: 88,
      premium: false
    },
    {
      id: 3,
      name: "Shreya M.",
      age: 30,
      location: "Brisbane, QLD",
      profession: "Marketing Manager",
      photos: ["/api/placeholder/300/400"],
      verified: false,
      lastSeen: "3 hours ago",
      compatibility: 85,
      premium: true
    },
    {
      id: 4,
      name: "Kavya R.",
      age: 27,
      location: "Perth, WA",
      profession: "Teacher",
      photos: ["/api/placeholder/300/400"],
      verified: true,
      lastSeen: "5 hours ago",
      compatibility: 90,
      premium: false
    },
    {
      id: 5,
      name: "Meera T.",
      age: 29,
      location: "Adelaide, SA",
      profession: "Architect",
      photos: ["/api/placeholder/300/400"],
      verified: true,
      lastSeen: "1 hour ago",
      compatibility: 87,
      premium: true
    },
    {
      id: 6,
      name: "Divya P.",
      age: 31,
      location: "Canberra, ACT",
      profession: "Lawyer",
      photos: ["/api/placeholder/300/400"],
      verified: false,
      lastSeen: "6 hours ago",
      compatibility: 83,
      premium: false
    }
  ];

  if (!user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          <AccountSidebar />
          
          <div className="flex-1">
            <Navigation />
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold mb-4">Please sign in to search profiles</h1>
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
            <Footer />
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
          <Navigation />
          
          {/* REPLACE OLD HEADER WITH ACCOUNTHEADER */}
          <AccountHeader
            title="Find Your Ideal Partner"
            description="Use advanced filters to discover profiles that match your preferences"
            icon={SearchIcon}
            backUrl="/account"
            backText="Back to Dashboard"
          >
            {/* MOBILE FILTER TOGGLE BUTTON */}
            <Button 
              variant="outline" 
              size="sm"
              className="lg:hidden w-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </AccountHeader>

          {/* Search Content */}
          <section className="py-4 lg:py-8">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-7xl mx-auto">
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              
                  {/* Search Filters Sidebar - WITH MOBILE TOGGLE VISIBILITY */}
                  <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <motion.div
                      variants={fadeInUp}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      <Card className="lg:sticky lg:top-8">
                        <CardContent className="p-4 lg:p-6">
                          <div className="flex items-center gap-2 mb-4 lg:mb-6">
                            <Filter className="w-5 h-5" />
                            <h2 className="text-lg font-semibold">Search Filters</h2>
                          </div>
                          
                          <div className="space-y-4 lg:space-y-6">
                            {/* Profile ID Search */}
                            <div>
                              <Label className="text-sm">Profile ID</Label>
                              <Input placeholder="Enter Profile ID" className="mt-1" />
                            </div>
                            
                            {/* Age Range */}
                            <div>
                              <Label className="text-sm">Age: {ageRange[0]} - {ageRange[1]} years</Label>
                              <Slider
                                value={ageRange}
                                onValueChange={setAgeRange}
                                max={60}
                                min={18}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                            
                            {/* Height Range */}
                            <div>
                              <Label className="text-sm">Height: {heightRange[0]} - {heightRange[1]} cm</Label>
                              <Slider
                                value={heightRange}
                                onValueChange={setHeightRange}
                                max={200}
                                min={140}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                            
                            {/* Marital Status */}
                            <div>
                              <Label className="text-sm">Marital Status</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="never_married">Never Married</SelectItem>
                                  <SelectItem value="divorced">Divorced</SelectItem>
                                  <SelectItem value="widowed">Widowed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Religion */}
                            <div>
                              <Label className="text-sm">Religion</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select religion" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hindu">Hindu</SelectItem>
                                  <SelectItem value="muslim">Muslim</SelectItem>
                                  <SelectItem value="christian">Christian</SelectItem>
                                  <SelectItem value="sikh">Sikh</SelectItem>
                                  <SelectItem value="buddhist">Buddhist</SelectItem>
                                  <SelectItem value="jain">Jain</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Mother Tongue */}
                            <div>
                              <Label className="text-sm">Mother Tongue</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hindi">Hindi</SelectItem>
                                  <SelectItem value="english">English</SelectItem>
                                  <SelectItem value="punjabi">Punjabi</SelectItem>
                                  <SelectItem value="tamil">Tamil</SelectItem>
                                  <SelectItem value="telugu">Telugu</SelectItem>
                                  <SelectItem value="bengali">Bengali</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Location */}
                            <div>
                              <Label className="text-sm">Country Living In</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="australia">Australia</SelectItem>
                                  <SelectItem value="india">India</SelectItem>
                                  <SelectItem value="usa">USA</SelectItem>
                                  <SelectItem value="uk">UK</SelectItem>
                                  <SelectItem value="canada">Canada</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Photo Settings */}
                            <div>
                              <Label className="text-sm">Photo Settings</Label>
                              <div className="space-y-2 mt-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="visible-to-all" />
                                  <Label htmlFor="visible-to-all" className="text-sm">Visible to all</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="protected-photo" />
                                  <Label htmlFor="protected-photo" className="text-sm">Protected Photo</Label>
                                </div>
                              </div>
                            </div>
                            
                            {/* Search Button - HIDE FILTERS ON MOBILE AFTER SEARCH */}
                            <Button 
                              className="w-full" 
                              onClick={() => setShowFilters(false)}
                            >
                              <SearchIcon className="w-4 h-4 mr-2" />
                              Search Profiles
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                  
                  {/* Search Results */}
                  <div className="lg:col-span-3">
                    <motion.div
                      variants={staggerChildren}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {/* Results Header - MOBILE RESPONSIVE */}
                      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg lg:text-xl font-semibold">
                            {searchResults.length} profiles found
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                            Female, 18 - 35, 5ft 0in - 5ft 11in, 160, Sikh, Never Married
                          </p>
                        </div>
                        <Select defaultValue="default">
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default Order</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="active">Most Active</SelectItem>
                            <SelectItem value="compatibility">Best Match</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      
                      {/* Results Grid - MOBILE RESPONSIVE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                        {searchResults.map((profile) => (
                          <motion.div key={profile.id} variants={fadeInUp}>
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                              <div className="relative">
                                <img 
                                  src={profile.photos[0]} 
                                  alt={profile.name}
                                  className="w-full h-48 sm:h-64 object-cover"
                                />
                                
                                {/* Premium Badge */}
                                {profile.premium && (
                                  <Badge className="absolute top-3 left-3 bg-purple-500 text-white text-xs">
                                    VIP
                                  </Badge>
                                )}
                                
                                {/* Verified Badge */}
                                {profile.verified && (
                                  <Badge className="absolute top-3 right-3 bg-green-500 text-white text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                
                                {/* Compatibility Score */}
                                <div className="absolute bottom-3 left-3">
                                  <Badge className="bg-blue-500 text-white text-xs">
                                    {profile.compatibility}% Match
                                  </Badge>
                                </div>
                                
                                {/* Quick Actions */}
                                <div className="absolute bottom-3 right-3 flex gap-1">
                                  <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-white/90">
                                    <Heart className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-white/90">
                                    <MessageCircle className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <CardContent className="p-3 sm:p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-base lg:text-lg truncate">{profile.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-green-600 flex-shrink-0">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="hidden sm:inline">Online {profile.lastSeen}</span>
                                      <span className="sm:hidden">Online</span>
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground">{profile.age} yrs, 5' 2"</p>
                                  
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    {profile.location}
                                  </p>
                                  
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                                    <Briefcase className="w-3 h-3 flex-shrink-0" />
                                    {profile.profession}
                                  </p>
                                  
                                  <div className="flex gap-2 pt-2">
                                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                                      <Eye className="w-3 h-3 mr-1" />
                                      <span className="hidden sm:inline">View Profile</span>
                                      <span className="sm:hidden">View</span>
                                    </Button>
                                    <Button size="sm" className="flex-1 text-xs">
                                      <MessageCircle className="w-3 h-3 mr-1" />
                                      Connect
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Load More */}
                      <motion.div variants={fadeInUp} className="text-center mt-6 lg:mt-8">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                          Load More Profiles
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Search;