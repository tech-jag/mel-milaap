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
import { AccountHeader } from "@/components/ui/account-header";
import { 
  Heart, 
  X, 
  Star, 
  MapPin, 
  Briefcase, 
  Shield,
  MessageCircle,
  Eye,
  Filter,
  Users,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";

const Matches = () => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Mock data for matches
  const matches = [
    {
      id: 1,
      name: "Priya S.",
      age: 28,
      location: "Sydney, NSW",
      profession: "Software Engineer",
      education: "Master's in Computer Science",
      photos: ["/api/placeholder/400/600"],
      verified: true,
      lastSeen: "2 hours ago",
      bio: "Looking for a life partner who shares similar values and dreams.",
      interests: ["Travel", "Photography", "Cooking", "Reading"],
      compatibility: 92
    },
    {
      id: 2,
      name: "Anjali K.",
      age: 26,
      location: "Melbourne, VIC",
      profession: "Doctor",
      education: "MBBS",
      photos: ["/api/placeholder/400/600"],
      verified: true,
      lastSeen: "1 day ago",
      bio: "Family-oriented person seeking meaningful connections.",
      interests: ["Music", "Dancing", "Yoga", "Volunteering"],
      compatibility: 88
    },
    {
      id: 3,
      name: "Shreya M.",
      age: 30,
      location: "Brisbane, QLD",
      profession: "Marketing Manager",
      education: "MBA",
      photos: ["/api/placeholder/400/600"],
      verified: false,
      lastSeen: "3 hours ago",
      bio: "Adventurous spirit looking for someone to explore life with.",
      interests: ["Hiking", "Movies", "Art", "Fitness"],
      compatibility: 85
    }
  ];

  const handleLike = () => {
    console.log("Liked profile:", matches[currentIndex]);
    setCurrentIndex((prev) => (prev + 1) % matches.length);
  };

  const handlePass = () => {
    console.log("Passed profile:", matches[currentIndex]);
    setCurrentIndex((prev) => (prev + 1) % matches.length);
  };

  const currentMatch = matches[currentIndex];

  if (!user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          <AccountSidebar />
          
          <div className="flex-1">
            <Navigation />
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold mb-4">Please sign in to view matches</h1>
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
      
<AccountHeader
  title="Your Matches"
  description="Discover your compatible matches"
  icon={Heart}
  backUrl="/account"
  backText="Back to Dashboard"
>
  <Button variant="outline" size="sm">Advanced</Button>
  <Button size="sm">Refine</Button>
</AccountHeader>

          {/* Matches Content */}
          <section className="py-4 lg:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="w-full">
            
            {/* Stats Bar */}
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 lg:mb-8 p-3 lg:p-4 bg-card rounded-lg border gap-3 lg:gap-4"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-6 overflow-x-auto">
                <div className="text-center flex-shrink-0">
                  <div className="text-xl lg:text-2xl font-bold text-primary">{matches.length}</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">New Matches</div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="text-xl lg:text-2xl font-bold text-green-600">5</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Mutual Interests</div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Profile Views</div>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Refine Preferences</span>
                  <span className="sm:hidden">Refine</span>
                </Button>
                <Button asChild className="flex-1 sm:flex-none">
                  <Link to="/search">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Advanced Search</span>
                    <span className="sm:hidden">Search</span>
                  </Link>
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Main Match Card */}
              <div className="lg:col-span-2">
                <motion.div
                  key={currentMatch.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  className="relative"
                >
                  <Card className="overflow-hidden shadow-xl">
                    <div className="relative">
                      <img 
                        src={currentMatch.photos[0]} 
                        alt={currentMatch.name}
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                      />
                      
                      {/* Overlay Info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {currentMatch.verified && (
                          <Badge className="bg-green-500 text-white">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge className="bg-purple-500 text-white">
                          {currentMatch.compatibility}% Match
                        </Badge>
                      </div>
                      
                      {/* Bottom Info */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-2xl font-bold">{currentMatch.name}, {currentMatch.age}</h2>
                        <p className="flex items-center gap-1 text-sm">
                          <MapPin className="w-4 h-4" />
                          {currentMatch.location}
                        </p>
                        <p className="flex items-center gap-1 text-sm">
                          <Briefcase className="w-4 h-4" />
                          {currentMatch.profession}
                        </p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">About</h3>
                          <p className="text-muted-foreground">{currentMatch.bio}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Interests</h3>
                          <div className="flex flex-wrap gap-2">
                            {currentMatch.interests.map((interest) => (
                              <Badge key={interest} variant="secondary">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold mb-2">Education</h3>
                          <p className="text-muted-foreground">{currentMatch.education}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center gap-3 sm:gap-4 mt-4 lg:mt-6 px-4">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0"
                      onClick={handlePass}
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0"
                    >
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                    
                    <Button 
                      size="lg" 
                      className="rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0 bg-red-500 hover:bg-red-600"
                      onClick={handleLike}
                    >
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                  </div>
                </motion.div>
              </div>
              
              {/* Sidebar - Recently Viewed */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Recently Viewed</h3>
                    <div className="space-y-3">
                      {matches.slice(0, 3).map((match) => (
                        <div key={match.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <img 
                            src={match.photos[0]} 
                            alt={match.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{match.name}</p>
                            <p className="text-xs text-muted-foreground">{match.location}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {match.compatibility}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Premium Upgrade */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Unlock Premium</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      See who liked you and get unlimited matches
                    </p>
                    <Button className="w-full" asChild>
                      <Link to="/premium-plans">Upgrade Now</Link>
                    </Button>
                  </CardContent>
                </Card>
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

export default Matches;