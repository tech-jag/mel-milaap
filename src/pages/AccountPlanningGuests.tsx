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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  PlusCircle, 
  Trash2,
  Download,
  UserCheck,
  UserX,
  Clock,
  Upload,
  Filter,
  Search,
  ArrowLeft,
  Mail,
  Phone
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getGuests, addGuest } from "@/lib/planning";
import { Helmet } from "react-helmet-async";

interface Guest {
  id: string;
  full_name: string;
  side?: string;
  rsvp_status: 'unknown' | 'yes' | 'no' | 'maybe';
  email?: string;
  phone?: string;
  group_name?: string;
  notes?: string;
  created_at?: string;
}

interface GuestStats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  byCategory: Record<string, number>;
  bySide: { self: number; partner: number; both: number };
}

const GUEST_CATEGORIES = [
  'Family',
  'Friends', 
  'Work',
  'Neighbors',
  'Wedding Party',
  'Plus Ones',
  'Children',
  'Other'
];

const AccountPlanningGuests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = React.useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [filterSide, setFilterSide] = React.useState('all');
  const [filterRSVP, setFilterRSVP] = React.useState('all');
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [stats, setStats] = React.useState<GuestStats>({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    byCategory: {},
    bySide: { self: 0, partner: 0, both: 0 }
  });

  const [newGuest, setNewGuest] = React.useState({
    full_name: '',
    side: 'self',
    group_name: '',
    email: '',
    phone: '',
    notes: ''
  });

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  React.useEffect(() => {
    applyFilters();
  }, [guests, searchTerm, filterCategory, filterSide, filterRSVP]);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }
      
      setCurrentUser(user);
      await loadGuests(user.id);
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

  const loadGuests = async (userId: string) => {
    try {
      const guestsData = await getGuests(userId);
      // Type-safe mapping to ensure proper RSVP status
      const typedGuests: Guest[] = guestsData.map(guest => ({
        ...guest,
        rsvp_status: (guest.rsvp_status as Guest['rsvp_status']) || 'unknown'
      }));
      setGuests(typedGuests);
      calculateStats(typedGuests);
    } catch (error) {
      console.error('Error loading guests:', error);
      setGuests([]);
      setStats({
        total: 0,
        confirmed: 0,
        declined: 0,
        pending: 0,
        byCategory: {},
        bySide: { self: 0, partner: 0, both: 0 }
      });
    }
  };

  const calculateStats = (guestsData: Guest[]) => {
    const total = guestsData.length;
    const confirmed = guestsData.filter(g => g.rsvp_status === 'yes').length;
    const declined = guestsData.filter(g => g.rsvp_status === 'no').length;
    const pending = guestsData.filter(g => g.rsvp_status === 'unknown' || g.rsvp_status === 'maybe').length;

    const byCategory: Record<string, number> = {};
    const bySide = { self: 0, partner: 0, both: 0 };

    guestsData.forEach(guest => {
      // Count by category (using group_name as category)
      const category = guest.group_name || 'Other';
      byCategory[category] = (byCategory[category] || 0) + 1;

      // Count by side
      switch (guest.side) {
        case 'self':
          bySide.self++;
          break;
        case 'partner':
          bySide.partner++;
          break;
        default:
          bySide.both++;
      }
    });

    setStats({ total, confirmed, declined, pending, byCategory, bySide });
  };

  const applyFilters = () => {
    let filtered = guests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(guest =>
        guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.group_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(guest => guest.group_name === filterCategory);
    }

    // Side filter
    if (filterSide !== 'all') {
      filtered = filtered.filter(guest => guest.side === filterSide);
    }

    // RSVP filter
    if (filterRSVP !== 'all') {
      filtered = filtered.filter(guest => guest.rsvp_status === filterRSVP);
    }

    setFilteredGuests(filtered);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await addGuest(currentUser.id, {
        full_name: newGuest.full_name,
        side: newGuest.side,
        group_name: newGuest.group_name || undefined,
        email: newGuest.email || undefined,
        phone: newGuest.phone || undefined
      });

      toast({
        title: "Guest Added!",
        description: `${newGuest.full_name} has been added to your guest list.`,
      });

      // Reset form and reload
      setNewGuest({
        full_name: '',
        side: 'self',
        group_name: '',
        email: '',
        phone: '',
        notes: ''
      });
      setShowAddForm(false);
      await loadGuests(currentUser.id);
    } catch (error: any) {
      toast({
        title: "Error Adding Guest",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRSVP = async (guestId: string, newStatus: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('guests')
        .update({ rsvp_status: newStatus })
        .eq('id', guestId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      toast({
        title: "RSVP Updated",
        description: "Guest RSVP status has been updated.",
      });

      await loadGuests(currentUser.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update RSVP.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveGuest = async (guestId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      toast({
        title: "Guest Removed",
        description: "Guest has been removed from your list.",
      });

      await loadGuests(currentUser.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove guest.",
        variant: "destructive"
      });
    }
  };

  const getRSVPIcon = (status: string) => {
    switch (status) {
      case 'yes':
        return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'no':
        return <UserX className="w-4 h-4 text-red-500" />;
      case 'maybe':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRSVPColor = (status: string) => {
    switch (status) {
      case 'yes':
        return 'default';
      case 'no':
        return 'destructive';
      case 'maybe':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your guest list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Guest List - Mēl Milaap</title>
        <meta name="description" content="Manage your wedding guest list and track RSVPs" />
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
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Guest List
                </h1>
                <p className="text-muted-foreground">
                  Manage your wedding guests and track RSVPs
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Guest</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddGuest} className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        placeholder="Guest full name..."
                        value={newGuest.full_name}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, full_name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="side">Side</Label>
                      <Select
                        value={newGuest.side}
                        onValueChange={(value) => setNewGuest(prev => ({ ...prev, side: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Your Side</SelectItem>
                          <SelectItem value="partner">Partner's Side</SelectItem>
                          <SelectItem value="both">Both Sides</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="group_name">Category</Label>
                      <Select
                        value={newGuest.group_name}
                        onValueChange={(value) => setNewGuest(prev => ({ ...prev, group_name: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {GUEST_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="guest@example.com"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        placeholder="+61 xxx xxx xxx"
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Guest</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
                  <p className="text-sm text-muted-foreground">Total Guests</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6 text-center">
                  <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{stats.confirmed}</h3>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{stats.pending}</h3>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6 text-center">
                  <UserX className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">{stats.declined}</h3>
                  <p className="text-sm text-muted-foreground">Declined</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-4 mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {GUEST_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterSide} onValueChange={setFilterSide}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sides</SelectItem>
                <SelectItem value="self">Your Side</SelectItem>
                <SelectItem value="partner">Partner's Side</SelectItem>
                <SelectItem value="both">Both Sides</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterRSVP} onValueChange={setFilterRSVP}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="RSVP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RSVPs</SelectItem>
                <SelectItem value="yes">Confirmed</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="no">Declined</SelectItem>
                <SelectItem value="unknown">Pending</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Guest List */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {filteredGuests.length === 0 ? (
              <motion.div
                className="text-center py-12"
                variants={fadeInUp}
              >
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {guests.length === 0 ? 'No guests yet' : 'No guests match your filters'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {guests.length === 0 
                    ? 'Start building your guest list for the big day'
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {guests.length === 0 && (
                  <Button onClick={() => setShowAddForm(true)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Your First Guest
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredGuests.map((guest) => (
                  <motion.div key={guest.id} variants={fadeInUp}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getRSVPIcon(guest.rsvp_status)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{guest.full_name}</h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {guest.side === 'self' ? 'Your Side' : 
                                   guest.side === 'partner' ? "Partner's Side" : 'Both Sides'}
                                </Badge>
                                {guest.group_name && (
                                  <Badge variant="secondary" className="text-xs">
                                    {guest.group_name}
                                  </Badge>
                                )}
                                <Badge variant={getRSVPColor(guest.rsvp_status) as any} className="text-xs">
                                  {guest.rsvp_status === 'yes' ? 'Confirmed' :
                                   guest.rsvp_status === 'no' ? 'Declined' :
                                   guest.rsvp_status === 'maybe' ? 'Maybe' : 'Pending'}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                {guest.email && (
                                  <div className="flex items-center space-x-1">
                                    <Mail className="w-3 h-3" />
                                    <span>{guest.email}</span>
                                  </div>
                                )}
                                {guest.phone && (
                                  <div className="flex items-center space-x-1">
                                    <Phone className="w-3 h-3" />
                                    <span>{guest.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Select
                              value={guest.rsvp_status}
                              onValueChange={(value) => handleUpdateRSVP(guest.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Confirmed</SelectItem>
                                <SelectItem value="maybe">Maybe</SelectItem>
                                <SelectItem value="no">Declined</SelectItem>
                                <SelectItem value="unknown">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveGuest(guest.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
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

export default AccountPlanningGuests;