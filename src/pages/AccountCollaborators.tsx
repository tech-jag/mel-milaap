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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users,
  UserPlus,
  Mail,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCollaborators, inviteCollaborator } from "@/lib/planning";
import { Helmet } from "react-helmet-async";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Collaborator {
  id: string;
  invitee_email: string;
  role: string;
  status: string;
  created_at: string;
  invitation_token?: string;
}

const AccountCollaborators = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);
  const [isInviting, setIsInviting] = React.useState(false);
  const [inviteForm, setInviteForm] = React.useState({
    email: '',
    role: 'sibling'
  });

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }
      
      setCurrentUser(user);
      await loadCollaborators(user.id);
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

  const loadCollaborators = async (userId: string) => {
    try {
      const collaboratorsData = await getCollaborators(userId);
      setCollaborators(collaboratorsData);
    } catch (error) {
      console.error('Error loading collaborators:', error);
      // Don't show error toast, just handle gracefully
      setCollaborators([]);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsInviting(true);
    
    try {
      await inviteCollaborator(currentUser.id, inviteForm.email, inviteForm.role);
      
      toast({
        title: "Invitation Sent!",
        description: `Invitation sent to ${inviteForm.email}`,
      });
      
      // Reload collaborators
      await loadCollaborators(currentUser.id);
      
      // Reset form
      setInviteForm({ email: '', role: 'sibling' });
    } catch (error: any) {
      toast({
        title: "Error Sending Invitation",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };

  const copyInvitationLink = (token: string) => {
    // Generate invitation link - basic implementation
    const inviteUrl = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    
    toast({
      title: "Link Copied!",
      description: "Invitation link copied to clipboard",
    });
  };

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;
      
      toast({
        title: "Collaborator Removed",
        description: "Collaborator has been removed successfully",
      });
      
      // Reload collaborators
      if (currentUser) {
        await loadCollaborators(currentUser.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove collaborator",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'declined':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading collaborators...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <Helmet>
          <title>Family Collaboration - Mēl Milaap</title>
          <meta name="description" content="Invite family members to collaborate on your wedding planning" />
        </Helmet>

        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="bg-background border-b -mx-4 lg:-mx-8 mb-8">
                <div className="container mx-auto px-4 lg:px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">Collaborators</h1>
                      <p className="text-muted-foreground">Invite family members to help with planning</p>
                    </div>
                    <Link to="/account">
                      <Button variant="outline">
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invite Form */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Invite Family Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="family@example.com"
                        value={inviteForm.email}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={inviteForm.role}
                        onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="friend">Close Friend</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isInviting || !inviteForm.email}
                      className="w-full"
                    >
                      {isInviting ? 'Sending...' : 'Send Invitation'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Permissions Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Permission Levels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium">Parent/Sibling</h4>
                    <p className="text-sm text-muted-foreground">Can view planning tools and add notes/checklist items</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Partner</h4>
                    <p className="text-sm text-muted-foreground">Equal permissions except billing/subscription</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Close Friend</h4>
                    <p className="text-sm text-muted-foreground">Can view and comment on planning progress</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Collaborators */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Current Collaborators ({collaborators.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {collaborators.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No collaborators yet</p>
                      <p className="text-sm text-muted-foreground">
                        Invite family members to help with your wedding planning
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {collaborators.map((collab) => (
                        <div
                          key={collab.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{collab.invitee_email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {collab.role}
                                </Badge>
                                <Badge variant={getStatusColor(collab.status) as any} className="text-xs">
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(collab.status)}
                                    <span className="capitalize">{collab.status}</span>
                                  </div>
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {collab.status === 'pending' && collab.invitation_token && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyInvitationLink(collab.invitation_token!)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCollaborator(collab.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AccountCollaborators;