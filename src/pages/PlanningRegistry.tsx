"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Gift,
  PlusCircle, 
  Trash2,
  ExternalLink,
  DollarSign,
  Share2,
  Copy,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getGiftRegistries, addGiftRegistryItem } from "@/lib/planning";
import type { GiftRegistry } from "@/lib/planning";
import { Helmet } from "react-helmet-async";

// Australian Popular Stores Configuration
const AUSTRALIAN_STORES = [
  {
    name: "Myer",
    icon: "🏬",
    url: "https://www.myer.com.au/gift-registry",
    description: "Premium department store with home & lifestyle",
    category: "Department Store"
  },
  {
    name: "David Jones",
    icon: "✨",
    url: "https://www.davidjones.com/gift-registry",
    description: "Luxury lifestyle and home essentials",
    category: "Luxury"
  },
  {
    name: "Amazon AU",
    icon: "📦",
    url: "https://www.amazon.com.au/wedding/registry",
    description: "Everything from kitchen to tech gadgets",
    category: "Everything"
  },
  {
    name: "Kmart",
    icon: "🏠",
    url: "https://www.kmart.com.au",
    description: "Affordable home essentials and decor",
    category: "Budget-Friendly"
  },
  {
    name: "Harvey Norman",
    icon: "🔌",
    url: "https://www.harveynorman.com.au",
    description: "Electronics, appliances & furniture",
    category: "Electronics"
  },
  {
    name: "IKEA",
    icon: "🛋️",
    url: "https://www.ikea.com/au/en/",
    description: "Modern furniture and home solutions",
    category: "Furniture"
  },
  {
    name: "West Elm",
    icon: "🎨",
    url: "https://www.westelm.com.au",
    description: "Contemporary home decor and furniture",
    category: "Design"
  },
  {
    name: "The Iconic",
    icon: "👗",
    url: "https://www.theiconic.com.au",
    description: "Fashion, beauty and lifestyle brands",
    category: "Lifestyle"
  }
];

const PlanningRegistry = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [registryItems, setRegistryItems] = React.useState<GiftRegistry[]>([]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [showStorePresets, setShowStorePresets] = React.useState(false);
  const [stats, setStats] = React.useState({
    totalItems: 0,
    externalLinks: 0,
    totalValue: 0,
    cashFundTarget: 0
  });

  const [newItem, setNewItem] = React.useState({
    type: 'external' as 'external' | 'cash' | 'physical',
    title: '',
    url: '',
    description: '',
    target_amount: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  React.useEffect(() => {
    checkAuthAndLoadRegistry();
  }, []);

  const checkAuthAndLoadRegistry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }
      
      setCurrentUser(user);
      await loadRegistry(user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        title: "Authentication Error",
        description: "Please sign in to continue.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegistry = async (userId: string) => {
    try {
      const items = await getGiftRegistries(userId);
      setRegistryItems(items);
      
      // Calculate stats
      const totalItems = items.length;
      const externalLinks = items.filter(item => item.type === 'external' && item.url).length;
      const totalValue = items.reduce((sum, item) => sum + (item.target_amount || 0), 0);
      const cashFundTarget = items
        .filter(item => item.type === 'cash')
        .reduce((sum, item) => sum + (item.target_amount || 0), 0);

      setStats({ totalItems, externalLinks, totalValue, cashFundTarget });
    } catch (error) {
      console.error('Error loading registry:', error);
      setRegistryItems([]);
      setStats({ totalItems: 0, externalLinks: 0, totalValue: 0, cashFundTarget: 0 });
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await addGiftRegistryItem(currentUser.id, {
        type: newItem.type,
        title: newItem.title,
        url: newItem.url || undefined,
        description: newItem.description || undefined,
        target_amount: newItem.target_amount ? parseFloat(newItem.target_amount) : undefined
      });

      toast({
        title: "Item Added!",
        description: "Your registry item has been added successfully.",
      });

      // Reset form and reload
      setNewItem({
        type: 'external',
        title: '',
        url: '',
        description: '',
        target_amount: '',
        priority: 'medium'
      });
      setShowAddForm(false);
      await loadRegistry(currentUser.id);
    } catch (error: any) {
      toast({
        title: "Error Adding Item",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddStorePreset = async (store: typeof AUSTRALIAN_STORES[0]) => {
    if (!currentUser) return;

    try {
      await addGiftRegistryItem(currentUser.id, {
        type: 'external',
        title: `${store.name} Registry`,
        url: store.url,
        description: `${store.description} - ${store.category} store`
      });

      toast({
        title: "Store Added!",
        description: `${store.name} has been added to your registry.`,
      });

      setShowStorePresets(false);
      await loadRegistry(currentUser.id);
    } catch (error: any) {
      toast({
        title: "Error Adding Store",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('gift_registries')
        .delete()
        .eq('id', itemId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      toast({
        title: "Item Removed",
        description: "Registry item has been deleted.",
      });

      await loadRegistry(currentUser.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item.",
        variant: "destructive"
      });
    }
  };

  const handleShareRegistry = () => {
    const shareUrl = `${window.location.origin}/r/${currentUser?.id}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Registry Link Copied!",
      description: "Share this link with family and friends.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="w-4 h-4 fill-current" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <Gift className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Gift Registry - Mēl Milaap</title>
        <meta name="description" content="Create and share your wedding gift registry with family and friends" />
      </Helmet>

      <Navigation />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center space-x-3">
              <Link to="/planning">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Planning
                </Button>
              </Link>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Gift Registry
                </h1>
                <p className="text-muted-foreground">
                  Share your wish list with family and friends
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleShareRegistry}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Registry
              </Button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6 text-center">
                  <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{stats.totalItems}</h3>
                  <p className="text-sm text-muted-foreground">Registry Items</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6 text-center">
                  <ExternalLink className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{stats.externalLinks}</h3>
                  <p className="text-sm text-muted-foreground">External Links</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</h3>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">${stats.cashFundTarget.toLocaleString()}</h3>
                  <p className="text-sm text-muted-foreground">Cash Fund Target</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="flex flex-wrap gap-4 mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Registry Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      className="w-full p-2 border rounded-md"
                      value={newItem.type}
                      onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
                    >
                      <option value="external">External Link</option>
                      <option value="physical">Physical Item</option>
                      <option value="cash">Cash Fund</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Item name or purpose..."
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  {newItem.type === 'external' && (
                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://..."
                        value={newItem.url}
                        onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Optional description..."
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="target_amount">Amount (AUD)</Label>
                    <Input
                      id="target_amount"
                      type="number"
                      placeholder="0.00"
                      value={newItem.target_amount}
                      onChange={(e) => setNewItem(prev => ({ ...prev, target_amount: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Item</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showStorePresets} onOpenChange={setShowStorePresets}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Popular Australian Stores
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Popular Australian Stores</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {AUSTRALIAN_STORES.map((store) => (
                    <Card key={store.name} className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleAddStorePreset(store)}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{store.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{store.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{store.description}</p>
                            <Badge variant="secondary" className="text-xs">{store.category}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Registry Items */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {registryItems.length === 0 ? (
              <motion.div
                className="text-center py-12"
                variants={fadeInUp}
              >
                <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No registry items yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your registry with items you'd love to receive
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setShowAddForm(true)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Your First Item
                  </Button>
                  <Button variant="outline" onClick={() => setShowStorePresets(true)}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse Stores
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registryItems.map((item) => (
                  <motion.div key={item.id} variants={fadeInUp}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2 mb-2">{item.title}</CardTitle>
                            <Badge variant="outline" className="mb-2">
                              {item.type === 'external' ? 'External Link' : 
                               item.type === 'cash' ? 'Cash Fund' : 'Physical Item'}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {item.description && (
                            <p className="text-muted-foreground text-sm line-clamp-3">
                              {item.description}
                            </p>
                          )}
                          
                          {item.target_amount && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="font-medium">${item.target_amount.toLocaleString()}</span>
                            </div>
                          )}
                          
                          {item.url && (
                            <div className="flex items-center justify-between">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-primary hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-sm">Visit Store</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlanningRegistry;