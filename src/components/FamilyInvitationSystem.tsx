import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Mail, 
  Shield, 
  UserPlus, 
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Settings,
  Phone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FamilyInvitation {
  id: string;
  relationship: string;
  access_level: string;
  invitation_email: string;
  status: string;
  created_at: string;
  family_member_id?: string;
  member_profile?: {
    first_name: string;
    last_name: string;
  };
}

export const FamilyInvitationSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [newInvitation, setNewInvitation] = useState({
    email: '',
    relationship: '',
    access_level: 'view'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (user) {
      loadFamilyInvitations();
    }
  }, [user]);

  const loadFamilyInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match FamilyInvitation interface
      const transformedData = (data || []).map(member => ({
        ...member,
        member_profile: member.family_member_id ? 
          { first_name: 'Loading...', last_name: '' } : 
          null
      }));
      
      setInvitations(transformedData);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast({
        title: "Error Loading Invitations",
        description: "Could not load family invitations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendFamilyInvitation = async () => {
    if (!newInvitation.email || !newInvitation.relationship) {
      toast({
        title: "Missing Information",
        description: "Please provide email and relationship",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      // Generate invitation token
      const invitationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

      // Insert invitation
      const { data, error } = await supabase
        .from('family_members')
        .insert({
          user_id: user?.id,
          relationship: newInvitation.relationship,
          access_level: newInvitation.access_level,
          invitation_email: newInvitation.email,
          invitation_token: invitationToken,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          to_email: newInvitation.email,
          email_type: 'family_invitation',
          user_name: 'Family Member',
          sender_name: user?.user_metadata?.name || 'Someone',
          platform_url: window.location.origin,
          custom_data: {
            relationship: newInvitation.relationship,
            invitation_link: `${window.location.origin}/family-invitation/${invitationToken}`
          }
        }
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the invitation if email fails
      }

      toast({
        title: "Invitation Sent",
        description: `Family invitation sent to ${newInvitation.email}`,
      });

      // Reset form
      setNewInvitation({ email: '', relationship: '', access_level: 'view' });
      
      // Reload invitations
      loadFamilyInvitations();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error Sending Invitation",
        description: "Could not send family invitation",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const revokeInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ status: 'revoked' })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation Revoked",
        description: "Family invitation has been revoked",
      });

      loadFamilyInvitations();
    } catch (error) {
      console.error('Error revoking invitation:', error);
      toast({
        title: "Error",
        description: "Could not revoke invitation",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'revoked': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'manage': return <Settings className="h-4 w-4" />;
      case 'full': return <Shield className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Loading family invitations...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Invitation System
          </CardTitle>
          <CardDescription>
            Invite trusted family members to help manage your matrimonial profile
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Send New Invitation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Send Family Invitation
          </CardTitle>
          <CardDescription>
            Invite a family member to access your profile with specific permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="family.member@example.com"
                value={newInvitation.email}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select
                value={newInvitation.relationship}
                onValueChange={(value) => setNewInvitation(prev => ({ ...prev, relationship: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mother">Mother</SelectItem>
                  <SelectItem value="father">Father</SelectItem>
                  <SelectItem value="sister">Sister</SelectItem>
                  <SelectItem value="brother">Brother</SelectItem>
                  <SelectItem value="aunt">Aunt</SelectItem>
                  <SelectItem value="uncle">Uncle</SelectItem>
                  <SelectItem value="cousin">Cousin</SelectItem>
                  <SelectItem value="grandmother">Grandmother</SelectItem>
                  <SelectItem value="grandfather">Grandfather</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="access-level">Access Level</Label>
            <Select
              value={newInvitation.access_level}
              onValueChange={(value) => setNewInvitation(prev => ({ ...prev, access_level: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <div>
                      <div className="font-medium">View Only</div>
                      <div className="text-xs text-muted-foreground">Can view profile information</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="manage">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Manage</div>
                      <div className="text-xs text-muted-foreground">Can update profile and respond to interests</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="full">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Full Access</div>
                      <div className="text-xs text-muted-foreground">Complete profile management</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={sendFamilyInvitation} 
            disabled={isSending}
            className="w-full md:w-auto"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isSending ? 'Sending Invitation...' : 'Send Invitation'}
          </Button>
        </CardContent>
      </Card>

      {/* Current Invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Family Invitations</CardTitle>
          <CardDescription>
            Track and manage family member invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No family invitations sent yet</p>
              <p className="text-sm">Send your first invitation above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {invitation.member_profile ? 
                            `${invitation.member_profile.first_name} ${invitation.member_profile.last_name}` :
                            invitation.invitation_email
                          }
                        </h4>
                        <Badge className={`text-xs ${getStatusColor(invitation.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(invitation.status)}
                            {invitation.status.toUpperCase()}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invitation.relationship} • {invitation.invitation_email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sent {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getAccessLevelIcon(invitation.access_level)}
                        {invitation.access_level.toUpperCase()}
                      </Badge>
                      {invitation.status === 'pending' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeInvitation(invitation.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">Security & Privacy:</p>
            <ul className="text-sm space-y-1">
              <li>• All family access is logged and monitored</li>
              <li>• Family members must verify their email before gaining access</li>
              <li>• You can revoke access at any time</li>
              <li>• Family members receive separate login credentials</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};