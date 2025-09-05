"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
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
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProtectedImage from "@/components/ui/protected-image";

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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Heart className="w-4 h-4 mr-2" />
                  My Favorites
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Saved Profiles & Suppliers
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Keep track of your favorite matches and wedding suppliers.
                </p>
              </div>
              <Link to="/account">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            <Tabs defaultValue="profiles" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profiles">
                  Profiles ({profileFavorites.length})
                </TabsTrigger>
                <TabsTrigger value="suppliers">
                  Suppliers ({supplierFavorites.length})
                </TabsTrigger>
              </TabsList>

              {/* Profile Favorites */}
              <TabsContent value="profiles">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {profileFavorites.map((favorite) => (
                    <motion.div key={favorite.id} variants={fadeInUp}>
                      <Card className="luxury-card overflow-hidden">
                        <div className="relative">
                          <ProtectedImage
                            src={favorite.profile?.photos[0] || '/api/placeholder/300/400'}
                            profileId={favorite.subject_id}
                            alt={favorite.profile?.name || 'Profile'}
                            className="w-full h-48"
                          />
                          
                          {favorite.profile?.verified && (
                            <Badge className="absolute top-3 left-3 bg-success text-success-foreground">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-3 right-3 bg-white/90"
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {favorite.profile?.name}, {favorite.profile?.age}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {favorite.profile?.location}
                              </p>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {favorite.profile?.profession}
                            </p>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="premium" className="flex-1">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {profileFavorites.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No favorite profiles yet</p>
                      <Link to="/match">
                        <Button className="mt-4">Find Matches</Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Supplier Favorites */}
              <TabsContent value="suppliers">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {supplierFavorites.map((favorite) => (
                    <motion.div key={favorite.id} variants={fadeInUp}>
                      <Card className="luxury-card overflow-hidden">
                        <div className="relative">
                          <img
                            src={favorite.supplier?.photos[0] || '/api/placeholder/300/400'}
                            alt={favorite.supplier?.business_name}
                            className="w-full h-48 object-cover"
                          />
                          
                          {favorite.supplier?.verified && (
                            <Badge className="absolute top-3 left-3 bg-success text-success-foreground">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-3 right-3 bg-white/90"
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {favorite.supplier?.business_name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {favorite.supplier?.city}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {favorite.supplier?.categories.map((category) => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="premium" className="flex-1">
                                Contact
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {supplierFavorites.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No favorite suppliers yet</p>
                      <Link to="/suppliers">
                        <Button className="mt-4">Browse Suppliers</Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
            
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccountFavorites;