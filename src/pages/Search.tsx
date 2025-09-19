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
import { AccountHeader } from "@/components/ui/account-header";
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

const Search = () => {
  const { user } = useAuth();
  const [ageRange, setAgeRange] = React.useState([25, 35]);
  const [heightRange, setHeightRange] = React.useState([150, 180]);
  
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
          
          {/* Header */}
<AccountHeader
  title="Find Your Ideal Partner"
  description="Use advanced filters to discover profiles that match your preferences"
  icon={SearchIcon}
  backUrl="/account"
  backText="Back to Dashboard"
/>

          {/* Search Content */}
          <section className="py-8">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-7xl mx-auto">
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Search Filters Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <Card className="sticky top-8">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Filter className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Search Filters</h2>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Profile ID Search */}
                        <div>
                          <Label>Profile ID</Label>
                          <Input placeholder="Enter Profile ID" />
                        </div>
                        
                        {/* Age Range */}
                        <div>
                          <Label>Age: {ageRange[0]} - {ageRange[1]} years</Label>
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
                          <Label>Height: {heightRange[0]} - {heightRange[1]} cm</Label>
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
                          <Label>Marital Status</Label>
                          <Select>
                            <SelectTrigger>
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
                          <Label>Religion</Label>
                          <Select>
                            <SelectTrigger>
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
                          <Label>Mother Tongue</Label>
                          <Select>
                            <SelectTrigger>
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
                          <Label>Country Living In</Label>
                          <Select>
                            <SelectTrigger>
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
                          <Label>Photo Settings</Label>
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
                        
                        {/* Search Button */}
                        <Button className="w-full">
                          <SearchIcon className="w-4 h-4 mr-2" />
                          Search
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
                  {/* Results Header */}
                  <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      {searchResults.length} profiles found • Female, 18 - 35, 5ft 0in - 5ft 11in, 160, Sikh, Never Married
                    </h2>
                    <Select defaultValue="default">
                      <SelectTrigger className="w-48">
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
                  
                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {searchResults.map((profile) => (
                      <motion.div key={profile.id} variants={fadeInUp}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img 
                              src={profile.photos[0]} 
                              alt={profile.name}
                              className="w-full h-64 object-cover"
                            />
                            
                            {/* Premium Badge */}
                            {profile.premium && (
                              <Badge className="absolute top-3 left-3 bg-purple-500 text-white">
                                VIP
                              </Badge>
                            )}
                            
                            {/* Verified Badge */}
                            {profile.verified && (
                              <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            
                            {/* Compatibility Score */}
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-blue-500 text-white">
                                {profile.compatibility}% Match
                              </Badge>
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="absolute bottom-3 right-3 flex gap-1">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90">
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{profile.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-green-600">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Online {profile.lastSeen}
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground">{profile.age} yrs, 5' 2"</p>
                              
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {profile.location}
                              </p>
                              
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {profile.profession}
                              </p>
                              
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Profile
                                </Button>
                                <Button size="sm" className="flex-1">
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
                  <motion.div variants={fadeInUp} className="text-center mt-8">
                    <Button variant="outline" size="lg">
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