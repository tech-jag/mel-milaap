"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MapPin, 
  Star,
  Shield,
  Trash2,
  Eye,
  MessageCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProtectedImage from "@/components/ui/protected-image";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountHeader } from "@/components/ui/account-header";

interface Favorite {
  id: string;
  subject_type: 'profile' | 'supplier';
  subject_id: string;
  created_at: string;
  profile?: {
    name: string;
    age: number;
    location: string;
    profession: string;
    verified: boolean;
    photos: string[];
  };
  supplier?: {
    business_name: string;
    city: string;
    categories: string[];
    verified: boolean;
    photos: string[];
  };
}

const AccountFavorites = () => {
  const { toast } = useToast();
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    checkAuthAndLoadFavorites();
  }, []);

  const checkAuthAndLoadFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    await loadFavorites(user.id);
  };

  const loadFavorites = async (userId: string) => {
    setIsLoading(true);
    
    try {
      const { data: favoritesData, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mock profile and supplier data for favorites
      const enrichedFavorites = favoritesData?.map((fav: any) => ({
        ...fav,
        profile: fav.subject_type === 'profile' ? {
          name: "Priya S.",
          age: 28,
          location: "Sydney, NSW",
          profession: "Software Engineer",
          verified: true,
          photos: ["/api/placeholder/300/400"]
        } : undefined,
        supplier: fav.subject_type === 'supplier' ? {
          business_name: "Elegant Weddings",
          city: "Melbourne",
          categories: ["Photography", "Videography"],
          verified: true,
          photos: ["/api/placeholder/300/400"]
        } : undefined
      })) || [];

      setFavorites(enrichedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      
      toast({
        title: "Removed from Favorites",
        description: "Item removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const profileFavorites = favorites.filter(f => f.subject_type === 'profile');
  const supplierFavorites = favorites.filter(f => f.subject_type === 'supplier');

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          {/* REPLACED INLINE HEADER WITH ACCOUNTHEADER */}
          <AccountHeader
            title="Favorites"
            description="Your saved profiles and suppliers"
            icon={Heart}
            backUrl="/account"
            backText="Back to Dashboard"
          />

          {/* Favorites Content - Mobile Optimized */}
          <section className="py-4 lg:py-8 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                
                {/* Mobile-Responsive Tabs */}
                <Tabs defaultValue="profiles" className="space-y-6 lg:space-y-8">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profiles" className="text-sm">
                      <span className="hidden sm:inline">Profiles</span>
                      <span className="sm:hidden">Profiles</span>
                      <span className="ml-1">({profileFavorites.length})</span>
                    </TabsTrigger>
                    <TabsTrigger value="suppliers" className="text-sm">
                      <span className="hidden sm:inline">Suppliers</span>
                      <span className="sm:hidden">Suppliers</span>
                      <span className="ml-1">({supplierFavorites.length})</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Profile Favorites - Mobile Responsive Grid */}
                  <TabsContent value="profiles">
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                      variants={staggerChildren}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {profileFavorites.map((favorite) => (
                        <motion.div key={favorite.id} variants={fadeInUp}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                              <ProtectedImage
                                src={favorite.profile?.photos[0] || '/api/placeholder/300/400'}
                                profileId={favorite.subject_id}
                                alt={favorite.profile?.name || 'Profile'}
                                className="w-full h-40 sm:h-48 object-cover"
                              />
                              
                              {favorite.profile?.verified && (
                                <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Verified</span>
                                  <span className="sm:hidden">✓</span>
                                </Badge>
                              )}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="absolute top-2 right-2 bg-white/90 h-8 w-8"
                                onClick={() => removeFavorite(favorite.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <CardContent className="p-3 sm:p-4">
                              <div className="space-y-2 sm:space-y-3">
                                <div>
                                  <h3 className="font-semibold text-sm sm:text-base truncate">
                                    {favorite.profile?.name}, {favorite.profile?.age}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center truncate">
                                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                    {favorite.profile?.location}
                                  </p>
                                </div>
                                
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                  {favorite.profile?.profession}
                                </p>
                                
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                                    <Eye className="w-3 h-3 mr-1" />
                                    <span className="hidden sm:inline">View</span>
                                    <span className="sm:hidden">View</span>
                                  </Button>
                                  <Button size="sm" className="flex-1 text-xs">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    <span className="hidden sm:inline">Message</span>
                                    <span className="sm:hidden">Msg</span>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                      
                      {profileFavorites.length === 0 && (
                        <div className="col-span-full text-center py-8 lg:py-12">
                          <Heart className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground text-sm lg:text-base">No favorite profiles yet</p>
                          <Link to="/matches">
                            <Button className="mt-4" size="sm">
                              <span className="hidden sm:inline">Find Matches</span>
                              <span className="sm:hidden">Find Matches</span>
                            </Button>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>

                  {/* Supplier Favorites - Mobile Responsive Grid */}
                  <TabsContent value="suppliers">
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                      variants={staggerChildren}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {supplierFavorites.map((favorite) => (
                        <motion.div key={favorite.id} variants={fadeInUp}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                              <img
                                src={favorite.supplier?.photos[0] || '/api/placeholder/300/400'}
                                alt={favorite.supplier?.business_name}
                                className="w-full h-40 sm:h-48 object-cover"
                              />
                              
                              {favorite.supplier?.verified && (
                                <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Verified</span>
                                  <span className="sm:hidden">✓</span>
                                </Badge>
                              )}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="absolute top-2 right-2 bg-white/90 h-8 w-8"
                                onClick={() => removeFavorite(favorite.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <CardContent className="p-3 sm:p-4">
                              <div className="space-y-2 sm:space-y-3">
                                <div>
                                  <h3 className="font-semibold text-sm sm:text-base truncate">
                                    {favorite.supplier?.business_name}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center truncate">
                                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                    {favorite.supplier?.city}
                                  </p>
                                </div>
                                
                                <div className="flex flex-wrap gap-1">
                                  {favorite.supplier?.categories.slice(0, 2).map((category) => (
                                    <Badge key={category} variant="secondary" className="text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                  {favorite.supplier?.categories.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{favorite.supplier.categories.length - 2}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                                    <Eye className="w-3 h-3 mr-1" />
                                    <span className="hidden sm:inline">View</span>
                                    <span className="sm:hidden">View</span>
                                  </Button>
                                  <Button size="sm" className="flex-1 text-xs">
                                    <span className="hidden sm:inline">Contact</span>
                                    <span className="sm:hidden">Contact</span>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                      
                      {supplierFavorites.length === 0 && (
                        <div className="col-span-full text-center py-8 lg:py-12">
                          <Star className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground text-sm lg:text-base">No favorite suppliers yet</p>
                          <Link to="/suppliers">
                            <Button className="mt-4" size="sm">
                              <span className="hidden sm:inline">Browse Suppliers</span>
                              <span className="sm:hidden">Browse</span>
                            </Button>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>
                </Tabs>
                
              </div>
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AccountFavorites;