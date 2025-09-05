import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Search, Download, Upload, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { fadeInUp, staggerChildren } from "@/lib/motion";

interface Guest {
  id: string;
  full_name: string;
  side: 'bride' | 'groom' | 'both';
  email?: string;
  phone?: string;
  group_name?: string;
  rsvp_status: 'pending' | 'yes' | 'no';
  dietary?: string;
  notes?: string;
  created_at: string;
}

const AccountGuests = () => {
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterRSVP, setFilterRSVP] = React.useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingGuest, setEditingGuest] = React.useState<Guest | null>(null);
  const [formData, setFormData] = React.useState<{
    full_name: string;
    side: 'bride' | 'groom' | 'both';
    email: string;
    phone: string;
    group_name: string;
    rsvp_status: 'pending' | 'yes' | 'no';
    dietary: string;
    notes: string;
  }>({
    full_name: "",
    side: "both" as const,
    email: "",
    phone: "", 
    group_name: "",
    rsvp_status: "pending" as const,
    dietary: "",
    notes: "",
  });
  const { toast } = useToast();

  React.useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('guest_list')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data as Guest[] || []);
    } catch (error: any) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load guest list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (editingGuest) {
        // Update existing guest
        const { error } = await supabase
          .from('guest_list')
          .update(formData)
          .eq('id', editingGuest.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Guest updated successfully",
        });
      } else {
        // Add new guest
        const { error } = await supabase
          .from('guest_list')
          .insert({ ...formData, user_id: user.id });

        if (error) throw error;

        toast({
          title: "Success", 
          description: "Guest added successfully",
        });
      }

      // Reset form and refresh
      setFormData({
        full_name: "",
        side: "both",
        email: "",
        phone: "",
        group_name: "",
        rsvp_status: "pending",
        dietary: "",
        notes: "",
      });
      setIsAddDialogOpen(false);
      setEditingGuest(null);
      fetchGuests();
    } catch (error: any) {
      console.error('Error saving guest:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save guest",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('guest_list')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest deleted successfully",
      });
      fetchGuests();
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete guest",
        variant: "destructive",
      });
    }
  };

  const startEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      full_name: guest.full_name,
      side: guest.side,
      email: guest.email || "",
      phone: guest.phone || "",
      group_name: guest.group_name || "",
      rsvp_status: guest.rsvp_status,
      dietary: guest.dietary || "",
      notes: guest.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.group_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRSVP = filterRSVP === "all" || guest.rsvp_status === filterRSVP;
    return matchesSearch && matchesRSVP;
  });

  const rsvpCounts = {
    yes: guests.filter(g => g.rsvp_status === 'yes').length,
    no: guests.filter(g => g.rsvp_status === 'no').length,
    pending: guests.filter(g => g.rsvp_status === 'pending').length,
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center px-6">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-xl font-semibold">Guest List</h1>
            </div>
          </header>

          <main className="flex-1">
            <div className="container mx-auto px-6 py-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-primary" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
                        <p className="text-2xl font-bold">{guests.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Attending</p>
                        <p className="text-2xl font-bold text-green-600">{rsvpCounts.yes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Not Attending</p>
                        <p className="text-2xl font-bold text-red-600">{rsvpCounts.no}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{rsvpCounts.pending}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search guests..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      
                      <Select value={filterRSVP} onValueChange={setFilterRSVP}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by RSVP" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All RSVPs</SelectItem>
                          <SelectItem value="yes">Attending</SelectItem>
                          <SelectItem value="no">Not Attending</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Guest
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <form onSubmit={handleSubmit}>
                            <DialogHeader>
                              <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
                              <DialogDescription>
                                {editingGuest ? 'Update guest information.' : 'Add a new guest to your wedding list.'}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="full_name" className="text-right">Name</Label>
                                <Input
                                  id="full_name"
                                  value={formData.full_name}
                                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="side" className="text-right">Side</Label>
                                <Select value={formData.side} onValueChange={(value: any) => setFormData({...formData, side: value})}>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bride">Bride's Side</SelectItem>
                                    <SelectItem value="groom">Groom's Side</SelectItem>
                                    <SelectItem value="both">Both/Mutual</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input
                                  id="phone"
                                  value={formData.phone}
                                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="group_name" className="text-right">Group</Label>
                                <Input
                                  id="group_name"
                                  value={formData.group_name}
                                  onChange={(e) => setFormData({...formData, group_name: e.target.value})}
                                  className="col-span-3"
                                  placeholder="e.g. College Friends"
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rsvp_status" className="text-right">RSVP</Label>
                                <Select value={formData.rsvp_status} onValueChange={(value: any) => setFormData({...formData, rsvp_status: value})}>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dietary" className="text-right">Dietary</Label>
                                <Input
                                  id="dietary"
                                  value={formData.dietary}
                                  onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                                  className="col-span-3"
                                  placeholder="e.g. Vegetarian, Gluten-free"
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">Notes</Label>
                                <Textarea
                                  id="notes"
                                  value={formData.notes}
                                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                  className="col-span-3"
                                  rows={2}
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button type="submit">
                                {editingGuest ? 'Update Guest' : 'Add Guest'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Table */}
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">Loading guests...</div>
                    </div>
                  ) : filteredGuests.length === 0 ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No guests found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm || filterRSVP !== "all" 
                            ? "Try adjusting your search or filters"
                            : "Start building your guest list by adding your first guest"
                          }
                        </p>
                        {!searchTerm && filterRSVP === "all" && (
                          <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Guest
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Side</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Group</TableHead>
                          <TableHead>RSVP</TableHead>
                          <TableHead>Dietary</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGuests.map((guest) => (
                          <TableRow key={guest.id}>
                            <TableCell className="font-medium">{guest.full_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {guest.side}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {guest.email && <div>{guest.email}</div>}
                                {guest.phone && <div className="text-muted-foreground">{guest.phone}</div>}
                              </div>
                            </TableCell>
                            <TableCell>{guest.group_name || '-'}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  guest.rsvp_status === 'yes' ? 'default' :
                                  guest.rsvp_status === 'no' ? 'destructive' : 'secondary'
                                }
                              >
                                {guest.rsvp_status === 'yes' ? 'Attending' :
                                 guest.rsvp_status === 'no' ? 'Not Attending' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>{guest.dietary || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEdit(guest)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(guest.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AccountGuests;