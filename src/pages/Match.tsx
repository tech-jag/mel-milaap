"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProtectedImage from "@/components/ui/protected-image";
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Shield,
  Star,
  Verified,
  Eye,
  ArrowLeft,
  Send
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

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
  { label: "Age", options: ["22-25", "26-30", "31-35", "36-40", "41-45"] },
  { label: "Location", options: ["Sydney", "Melbourne", "Brisbane", "Auckland", "Perth", "Adelaide"] },
  { label: "Religion", options: ["Hindu", "Sikh", "Muslim", "Christian", "Buddhist", "Jain"] },
  { label: "Education", options: ["Bachelors", "Masters", "PhD", "Professional", "Diploma"] },
  { label: "Profession", options: ["Engineer", "Doctor", "Teacher", "Business", "IT", "Finance", "Other"] },
  { label: "Languages", options: ["English", "Hindi", "Punjabi", "Gujarati", "Tamil", "Telugu", "Urdu"] },
  { label: "Marital Status", options: ["Never Married", "Divorced", "Widowed"] },
  { label: "Community", options: ["Punjabi", "Gujarati", "Tamil", "Telugu", "Bengali", "Marathi", "Other"] }
];

const Match = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('newest');
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [messageCount, setMessageCount] = React.useState(0);
  const [isPremium, setIsPremium] = React.useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = React.useState(false);
  const [selectedProfile, setSelectedProfile] = React.useState<any>(null);
  const [messageText, setMessageText] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth/login');
      return;
    }
    setCurrentUser(user);
    
    // Check premium status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('subject_id', user.id)
      .eq('subject_type', 'user')
      .eq('status', 'active')
      .maybeSingle();
      
    setIsPremium(subscription?.plan === 'premium' || subscription?.plan === 'premium_plus');
    
    // Check daily message count
    const today = new Date().toISOString().split('T')[0];
    const { data: messages } = await supabase
      .from('messages')
      .select('id')
      .eq('sender_id', user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);
      
    setMessageCount(messages?.length || 0);
    setIsLoading(false);
  };

  const handleMessage = async (profileId: string, profileName: string, customMessage?: string) => {
    if (!currentUser) return;
    
    // Check message limits for non-premium users
    if (messageCount >= 5 && !isPremium) {
      toast({
        title: "Message Limit Reached",
        description: "Upgrade to Premium for unlimited messages.",
        variant: "destructive"
      });
      return;
    }

    const messageBody = customMessage || `Hi ${profileName}! I'd love to get to know you better.`;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: profileId,
          body: messageBody
        });

      if (error) throw error;

      setMessageCount(prev => prev + 1);
      setMessageText('');
      setMessageDialogOpen(false);
      setSelectedProfile(null);
      
      toast({
        title: "Message Sent!",
        description: `Your message has been sent to ${profileName}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to send message.",
        variant: "destructive"
      });
    }
  };

  const openCustomMessageDialog = (profile: any) => {
    setSelectedProfile(profile);
    setMessageDialogOpen(true);
  };

  const sendCustomMessage = () => {
    if (selectedProfile && messageText.trim()) {
      handleMessage(selectedProfile.id.toString(), selectedProfile.name, messageText.trim());
    }
  };

  const handleExpressInterest = async (profileId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('interests')
        .insert({
          sender_id: currentUser.id,
          receiver_id: profileId
        });

      if (error) throw error;

      toast({
        title: "Interest Sent!",
        description: "Your interest has been sent successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send interest.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

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
            <motion.div variants={fadeInUp} className="mb-6">
              <Link to="/account">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </motion.div>
            
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            {/* Sort and Filter Options */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-foreground">Sort by:</label>
                <select 
                  className="p-2 rounded-lg border border-border bg-background text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="active">Most Active</option>
                  <option value="verified">Verified Only</option>
                  <option value="premium">Premium Members</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded border-border"
                  />
                  Verified profiles only
                </label>
              </div>
            </div>
            
            {/* Filter Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filters.map((filter) => (
                <div key={filter.label}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {filter.label}
                  </label>
                  <select 
                    className="w-full p-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => setSelectedFilters({...selectedFilters, [filter.label]: e.target.value})}
                    value={selectedFilters[filter.label] || ''}
                  >
                    <option value="">Any</option>
                    {filter.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            {/* Clear Filters */}
            <div className="mt-4 flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedFilters({});
                  setVerifiedOnly(false);
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </Button>
              <p className="text-sm text-muted-foreground">
                {profiles.length} profiles found
              </p>
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
                    <ProtectedImage
                      src={profile.photos[0]}
                      profileId={profile.id.toString()}
                      alt={profile.name}
                      className="w-full h-64"
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
                        <Button 
                          variant="luxury" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleExpressInterest(profile.id.toString())}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Interest
                        </Button>
                        <Button 
                          variant="premium" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => openCustomMessageDialog(profile)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message {!isPremium && messageCount >= 3 ? '(Limit)' : ''}
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

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedProfile?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setMessageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={sendCustomMessage}
                disabled={!messageText.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Match;