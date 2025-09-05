"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Shield,
  Star,
  Verified,
  Eye
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

// Mock profile data
const profiles = [
  {
    id: 1,
    name: "Priya S.",
    age: 28,
    location: "Sydney, NSW",
    education: "Masters in Engineering",
    profession: "Software Engineer",
    religion: "Hindu",
    verified: true,
    premium: true,
    photos: ["/api/placeholder/300/400"],
    managedBy: "Self",
    bio: "Looking for someone who shares my values and dreams...",
  },
  {
    id: 2,
    name: "Arjun K.",
    age: 31,
    location: "Melbourne, VIC",
    education: "MBA",
    profession: "Business Analyst",
    religion: "Sikh",
    verified: true,
    premium: false,
    photos: ["/api/placeholder/300/400"],
    managedBy: "Parent",
    bio: "Family-oriented person seeking life partner...",
  },
  {
    id: 3,
    name: "Aisha R.",
    age: 26,
    location: "Auckland, NZ",
    education: "MBBS",
    profession: "Doctor",
    religion: "Muslim",
    verified: true,
    premium: true,
    photos: ["/api/placeholder/300/400"],
    managedBy: "Self",
    bio: "Passionate about helping others and family values...",
  },
];

const filters = [
  { label: "Age", options: ["22-25", "26-30", "31-35", "36-40"] },
  { label: "Location", options: ["Sydney", "Melbourne", "Brisbane", "Auckland"] },
  { label: "Religion", options: ["Hindu", "Sikh", "Muslim", "Christian"] },
  { label: "Education", options: ["Bachelors", "Masters", "PhD", "Professional"] },
];

const Match = () => {
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-luxury-lg text-foreground mb-6"
              variants={fadeInUp}
            >
              Find Your Perfect Match
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Discover verified profiles of South Asian singles across Australia & New Zealand
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              className="flex gap-4 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by location, profession, or interests..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button 
                variant="champagne" 
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      {showFilters && (
        <motion.section 
          className="py-8 bg-card border-b border-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {filters.map((filter) => (
                <div key={filter.label}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {filter.label}
                  </label>
                  <select 
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => setSelectedFilters({...selectedFilters, [filter.label]: e.target.value})}
                  >
                    <option value="">Select {filter.label}</option>
                    {filter.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {profiles.map((profile) => (
              <motion.div
                key={profile.id}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="luxury-card overflow-hidden">
                  <div className="relative">
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {profile.verified && (
                        <Badge className="bg-success text-success-foreground">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {profile.premium && (
                        <Badge className="bg-accent text-accent-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>

                    {/* Managed By */}
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {profile.managedBy}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-1">
                          {profile.name}, {profile.age}
                        </h3>
                        <p className="text-muted-foreground flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {profile.location}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Education:</span> {profile.education}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Profession:</span> {profile.profession}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Religion:</span> {profile.religion}
                        </p>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {profile.bio}
                      </p>

                      <div className="flex gap-2 pt-4">
                        <Button variant="luxury" size="sm" className="flex-1">
                          <Heart className="w-4 h-4 mr-2" />
                          Interest
                        </Button>
                        <Button variant="premium" size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          <motion.div
            className="text-center mt-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Button variant="champagne" size="lg">
              Load More Profiles
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Match;