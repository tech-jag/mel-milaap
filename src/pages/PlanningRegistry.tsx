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
import { 
  Gift,
  PlusCircle, 
  Trash2,
  ExternalLink,
  DollarSign,
  Share2,
  Copy,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getGiftRegistries, trackEvent } from "@/lib/planning";
import type { GiftRegistry } from "@/lib/planning";
// Remove SEO imports and components temporarily

const PlanningRegistry = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [registryItems, setRegistryItems] = React.useState<GiftRegistry[]>([]);
  const [newItem, setNewItem] = React.useState({
    type: 'external' as 'external' | 'cash',
    title: '',
    url: '',
    description: '',
    target_amount: ''
  });
  const [showAddForm, setShowAddForm] = React.useState(false);

  React.useEffect(() => {
    checkAuthAndLoadRegistry();
  }, []);

  const checkAuthAndLoadRegistry = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setCurrentUser(user);
    await loadRegistry(user.id);
  };

  const loadRegistry = async (userId: string) => {
    setIsLoading(true);
    
    try {
      const items = await getGiftRegistries(userId);
      setRegistryItems(items);
    } catch (error) {
      console.error('Error loading registry:', error);
      toast({
        title: "Error loading registry",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addRegistryItem = async () => {
    if (!currentUser || !newItem.title) return;

    try {
      const { data, error } = await supabase
        .from('gift_registries')
        .insert({
          user_id: currentUser.id,
          type: newItem.type,
          title: newItem.title,
          url: newItem.type === 'external' ? newItem.url : null,
          description: newItem.description || null,
          target_amount: newItem.type === 'cash' ? parseFloat(newItem.target_amount) || null : null,
          sort_order: registryItems.length
        })
        .select()
        .single();

      if (error) throw error;

      setRegistryItems(prev => [...prev, data]);
      setNewItem({ type: 'external', title: '', url: '', description: '', target_amount: '' });
      setShowAddForm(false);

      await trackEvent('registry_item_added', { type: newItem.type, title: newItem.title });

      toast({
        title: "Registry item added",
        description: "Your gift registry has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteRegistryItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('gift_registries')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setRegistryItems(prev => prev.filter(item => item.id !== itemId));

      toast({
        title: "Registry item deleted",
        description: "Item removed from your registry.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const copyShareLink = async () => {
    if (!currentUser) return;
    
    const shareUrl = `${window.location.origin}/registry/${currentUser.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share this link with your guests to view your registry.",
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      toast({
        title: "Share Link",
        description: shareUrl,
      });
    }
  };

  const popularStores = [
    { name: "Myer", url: "https://www.myer.com.au" },
    { name: "David Jones", url: "https://www.davidjones.com" },
    { name: "Amazon Australia", url: "https://www.amazon.com.au" },
    { name: "Harvey Norman", url: "https://www.harveynorman.com.au" },
    { name: "JB Hi-Fi", url: "https://www.jbhifi.com.au" },
    { name: "Kmart", url: "https://www.kmart.com.au" }
  ];

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading gift registry...</div>
      </div>
    );
  }

  const externalItems = registryItems.filter(item => item.type === 'external');
  const cashItems = registryItems.filter(item => item.type === 'cash');
  const totalCashTarget = cashItems.reduce((sum, item) => sum + (item.target_amount || 0), 0);

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
                  <Gift className="w-4 h-4 mr-2" />
                  Gift Registry
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Wedding Gift Registry
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Share your wish list with family and friends to make gift-giving easy.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={copyShareLink}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Registry
                </Button>
                <Link to="/planning">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Planning
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Registry Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Registry Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Gift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold mb-1">{registryItems.length}</h3>
                    <p className="text-sm text-muted-foreground">Registry Items</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <ExternalLink className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold mb-1">{externalItems.length}</h3>
                    <p className="text-sm text-muted-foreground">External Links</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold mb-1">
                      ${totalCashTarget.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">Cash Fund Target</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Registry Management */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Registry</CardTitle>
                  <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  
                  {/* Add New Item Form */}
                  {showAddForm && (
                    <div className="mb-6 p-4 bg-card border border-border rounded-lg">
                      <div className="space-y-4">
                        {/* Type Selection */}
                        <div>
                          <Label>Item Type</Label>
                          <div className="flex gap-2 mt-1">
                            <Button
                              variant={newItem.type === 'external' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setNewItem({...newItem, type: 'external'})}
                            >
                              External Link
                            </Button>
                            <Button
                              variant={newItem.type === 'cash' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setNewItem({...newItem, type: 'cash'})}
                            >
                              Cash Fund
                            </Button>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Title *</Label>
                            <Input
                              placeholder={newItem.type === 'cash' ? 'Honeymoon Fund' : 'Kitchen Appliances'}
                              value={newItem.title}
                              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                            />
                          </div>
                          
                          {newItem.type === 'external' ? (
                            <div>
                              <Label>Registry URL</Label>
                              <Input
                                placeholder="https://..."
                                value={newItem.url}
                                onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                              />
                            </div>
                          ) : (
                            <div>
                              <Label>Target Amount</Label>
                              <Input
                                type="number"
                                placeholder="5000"
                                value={newItem.target_amount}
                                onChange={(e) => setNewItem({...newItem, target_amount: e.target.value})}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <Label>Description (Optional)</Label>
                          <Textarea
                            placeholder="Add details about this registry item..."
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={addRegistryItem}>Add Item</Button>
                          <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Popular Stores */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Popular Australian Stores</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {popularStores.map((store) => (
                        <Button
                          key={store.name}
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(store.url, '_blank')}
                          className="justify-start"
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          {store.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Registry Items List */}
                  <div className="space-y-6">
                    {/* External Registry Links */}
                    {externalItems.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Registry Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {externalItems.map((item) => (
                            <Card key={item.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium mb-1">{item.title}</h5>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.url && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(item.url, '_blank')}
                                    >
                                      <ExternalLink className="w-3 h-3 mr-2" />
                                      View Registry
                                    </Button>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => deleteRegistryItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cash Funds */}
                    {cashItems.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Cash Funds</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cashItems.map((item) => (
                            <Card key={item.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium">{item.title}</h5>
                                    <Badge variant="secondary">
                                      ${item.target_amount?.toLocaleString()}
                                    </Badge>
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => deleteRegistryItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {registryItems.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No registry items yet. Click "Add Item" to start building your gift registry.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanningRegistry;