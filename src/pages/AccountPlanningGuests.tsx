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
  Users, 
  PlusCircle, 
  Trash2,
  Download,
  UserCheck,
  UserX,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type GuestRow = Database['public']['Tables']['guest_list_items']['Row'];

interface GuestItem {
  id: string;
  name: string;
  side?: string;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  dietary_requirements?: string;
  notes?: string;
}

function toGuestItem(row: GuestRow): GuestItem {
  return {
    id: row.id,
    name: row.name,
    side: row.side || undefined,
    rsvp_status: (row.rsvp_status as 'pending' | 'confirmed' | 'declined') || 'pending',
    dietary_requirements: row.dietary_requirements || undefined,
    notes: row.notes || undefined,
  };
}

interface GuestList {
  id: string;
  name: string;
  items: GuestItem[];
}

const AccountPlanningGuests = () => {
  const { toast } = useToast();
  const [guestList, setGuestList] = React.useState<GuestList | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [newGuest, setNewGuest] = React.useState({
    name: '',
    side: '',
    dietary_requirements: '',
    notes: ''
  });
  const [showAddForm, setShowAddForm] = React.useState(false);

  React.useEffect(() => {
    checkAuthAndLoadGuestList();
  }, []);

  const checkAuthAndLoadGuestList = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    await loadGuestList(user.id);
  };

  const loadGuestList = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // Get or create guest list
      let { data: guestListData, error: listError } = await supabase
        .from('guest_lists')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (listError && listError.code !== 'PGRST116') throw listError;

      if (!guestListData) {
        // Create new guest list
        const { data: newList, error: createError } = await supabase
          .from('guest_lists')
          .insert({
            user_id: userId,
            name: 'Wedding Guest List'
          })
          .select()
          .single();

        if (createError) throw createError;
        guestListData = newList;
      }

      // Load guest list items
      const { data: itemsData, error: itemsError } = await supabase
        .from('guest_list_items')
        .select('*')
        .eq('guest_list_id', guestListData.id)
        .order('name');

      if (itemsError) throw itemsError;

      setGuestList({
        ...guestListData,
        items: (itemsData || []).map(toGuestItem)
      });
    } catch (error) {
      console.error('Error loading guest list:', error);
      toast({
        title: "Error loading guest list",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addGuest = async () => {
    if (!guestList || !newGuest.name) return;

    try {
      const { data, error } = await supabase
        .from('guest_list_items')
        .insert({
          guest_list_id: guestList.id,
          name: newGuest.name,
          side: newGuest.side || null,
          rsvp_status: 'pending',
          dietary_requirements: newGuest.dietary_requirements || null,
          notes: newGuest.notes || null
        })
        .select()
        .single();

      if (error) throw error;

      setGuestList(prev => prev ? {
        ...prev,
        items: [...prev.items, toGuestItem(data)]
      } : null);

      setNewGuest({ name: '', side: '', dietary_requirements: '', notes: '' });
      setShowAddForm(false);

      toast({
        title: "Guest added",
        description: "Guest has been added to your list.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateGuestStatus = async (guestId: string, status: 'pending' | 'confirmed' | 'declined') => {
    if (!guestList) return;

    try {
      const { error } = await supabase
        .from('guest_list_items')
        .update({ rsvp_status: status })
        .eq('id', guestId);

      if (error) throw error;

      setGuestList(prev => prev ? {
        ...prev,
        items: prev.items.map(item => 
          item.id === guestId ? { ...item, rsvp_status: status } : item
        )
      } : null);

      toast({
        title: "RSVP updated",
        description: `Guest status updated to ${status}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating RSVP",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!guestList) return;

    try {
      const { error } = await supabase
        .from('guest_list_items')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      setGuestList(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.id !== guestId)
      } : null);

      toast({
        title: "Guest removed",
        description: "Guest has been removed from your list.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    if (!guestList) return;

    const headers = ['Name', 'Side', 'RSVP Status', 'Dietary Requirements', 'Notes'];
    const rows = guestList.items.map(item => [
      item.name,
      item.side || '',
      item.rsvp_status,
      item.dietary_requirements || '',
      item.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guest-list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Guest list exported",
      description: "Your guest list has been downloaded as CSV.",
    });
  };

  if (!currentUser || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  if (!guestList) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Error loading guest list</div>
    </div>;
  }

  const totalGuests = guestList.items.length;
  const confirmedGuests = guestList.items.filter(g => g.rsvp_status === 'confirmed').length;
  const pendingGuests = guestList.items.filter(g => g.rsvp_status === 'pending').length;
  const declinedGuests = guestList.items.filter(g => g.rsvp_status === 'declined').length;

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
                  <Users className="w-4 h-4 mr-2" />
                  Guest List Manager
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Wedding Guest List
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Manage your wedding guests and track RSVPs.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Link to="/account">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Guest List Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Guest Summary */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold text-foreground mb-1">
                      {totalGuests}
                    </h3>
                    <p className="text-sm text-muted-foreground">Total Guests</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6 text-center">
                    <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold text-foreground mb-1">
                      {confirmedGuests}
                    </h3>
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold text-foreground mb-1">
                      {pendingGuests}
                    </h3>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-6 text-center">
                    <UserX className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-semibold text-foreground mb-1">
                      {declinedGuests}
                    </h3>
                    <p className="text-sm text-muted-foreground">Declined</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Guest List Management */}
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Guest List</CardTitle>
                  <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </CardHeader>
                <CardContent>
                  
                  {/* Add New Guest Form */}
                  {showAddForm && (
                    <div className="mb-6 p-4 bg-card border border-border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Guest Name *</Label>
                          <Input
                            placeholder="Full name"
                            value={newGuest.name}
                            onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Side</Label>
                          <select 
                            className="w-full p-2 border border-border rounded-md bg-background"
                            value={newGuest.side}
                            onChange={(e) => setNewGuest({...newGuest, side: e.target.value})}
                          >
                            <option value="">Select side</option>
                            <option value="Bride">Bride</option>
                            <option value="Groom">Groom</option>
                            <option value="Both">Both</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Dietary Requirements</Label>
                          <Input
                            placeholder="Allergies, preferences, etc."
                            value={newGuest.dietary_requirements}
                            onChange={(e) => setNewGuest({...newGuest, dietary_requirements: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Input
                            placeholder="Additional notes"
                            value={newGuest.notes}
                            onChange={(e) => setNewGuest({...newGuest, notes: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={addGuest}>Add Guest</Button>
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {/* Guest List */}
                  <div className="space-y-3">
                    {guestList.items.map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{guest.name}</h4>
                            {guest.side && (
                              <Badge variant="secondary">{guest.side}</Badge>
                            )}
                            <Badge 
                              variant={
                                guest.rsvp_status === 'confirmed' ? 'default' :
                                guest.rsvp_status === 'declined' ? 'destructive' : 'secondary'
                              }
                            >
                              {guest.rsvp_status}
                            </Badge>
                          </div>
                          
                          {(guest.dietary_requirements || guest.notes) && (
                            <div className="text-sm text-muted-foreground">
                              {guest.dietary_requirements && (
                                <p>Dietary: {guest.dietary_requirements}</p>
                              )}
                              {guest.notes && (
                                <p>Notes: {guest.notes}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={guest.rsvp_status === 'confirmed' ? 'default' : 'outline'}
                            onClick={() => updateGuestStatus(guest.id, 'confirmed')}
                          >
                            <UserCheck className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={guest.rsvp_status === 'pending' ? 'default' : 'outline'}
                            onClick={() => updateGuestStatus(guest.id, 'pending')}
                          >
                            <Clock className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={guest.rsvp_status === 'declined' ? 'destructive' : 'outline'}
                            onClick={() => updateGuestStatus(guest.id, 'declined')}
                          >
                            <UserX className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteGuest(guest.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {guestList.items.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No guests added yet. Click "Add Guest" to get started.
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

export default AccountPlanningGuests;