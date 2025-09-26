import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle,
  Clock,
  Heart,
  MessageSquare,
  Settings,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface FamilyMember {
  id: string;
  user_id: string;
  family_member_email: string;
  family_member_name: string;
  relationship: string;
  role: 'parent' | 'sibling' | 'guardian' | 'family_member';
  permissions: {
    view_profile: boolean;
    manage_profile: boolean;
    send_interests: boolean;
    view_messages: boolean;
    manage_photos: boolean;
    receive_notifications: boolean;
  };
  status: 'pending' | 'active' | 'suspended';
  invited_at: string;
  approved_at?: string;
  last_activity?: string;
}

interface FamilyInvitation {
  email: string;
  name: string;
  relationship: string;
  role: 'parent' | 'sibling' | 'guardian' | 'family_member';
  permissions: FamilyMember['permissions'];
  personalMessage?: string;
}

export const FamilyAccessManager: React.FC = () => {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [invitation, setInvitation] = useState<FamilyInvitation>({
    email: '',
    name: '',
    relationship: '',
    role: 'family_member',
    permissions: {
      view_profile: true,
      manage_profile: false,
      send_interests: false,
      view_messages: false,
      manage_photos: false,
      receive_notifications: true
    }
  });

  useEffect(() => {
    if (user) {
      loadFamilyMembers();
    }
  }, [user]);

  const loadFamilyMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user!.id)
        .order('approved_at', { ascending: false });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error loading family members:', error);
      toast({
        title: "Error",
        description: "Failed to load family members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFamilyInvitation = async () => {
    try {
      if (!invitation.email || !invitation.name || !invitation.relationship) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Generate invitation token
      const invitationToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      // Create invitation record
      const { data, error } = await supabase
        .from('family_invitations')
        .insert({
          user_id: user!.id,
          family_member_email: invitation.email,
          family_member_name: invitation.name,
          relationship: invitation.relationship,
          role: invitation.role,
          permissions: invitation.permissions,
          invitation_token: invitationToken,
          expires_at: expiresAt.toISOString(),
          personal_message: invitation.personalMessage,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Send invitation email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-family-invitation', {
        body: {
          to_email: invitation.email,
          to_name: invitation.name,
          from_name: user!.user_metadata?.full_name || 'Family Member',
          relationship: invitation.relationship,
          invitation_token: invitationToken,
          personal_message: invitation.personalMessage,
          platform_url: window.location.origin
        }
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't throw error - invitation is created, email is optional
      }

      // Log security event
      await supabase
        .from('security_events')
        .insert({
          user_id: user!.id,
          event_type: 'family_invitation_sent',
          severity: 'info',
          details: {
            invitee_email: invitation.email,
            relationship: invitation.relationship,
            role: invitation.role,
            permissions: invitation.permissions
          }
        });

      setInviteDialogOpen(false);
      setInvitation({
        email: '',
        name: '',
        relationship: '',
        role: 'family_member',
        permissions: {
          view_profile: true,
          manage_profile: false,
          send_interests: false,
          view_messages: false,
          manage_photos: false,
          receive_notifications: true
        }
      });

      await loadFamilyMembers();

      toast({
        title: "Invitation Sent",
        description: `Family invitation sent to ${invitation.name}`,
      });

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Invitation Failed",
        description: "Failed to send family invitation",
        variant: "destructive",
      });
    }
  };

  const updateMemberPermissions = async (memberId: string, permissions: FamilyMember['permissions']) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ permissions })
        .eq('id', memberId);

      if (error) throw error;

      // Log permission change
      await supabase
        .from('security_events')
        .insert({
          user_id: user!.id,
          event_type: 'family_permissions_updated',
          severity: 'info',
          details: {
            member_id: memberId,
            new_permissions: permissions
          }
        });

      await loadFamilyMembers();

      toast({
        title: "Permissions Updated",
        description: "Family member permissions have been updated",
      });

    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    }
  };

  const suspendFamilyMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ status: 'suspended' })
        .eq('id', memberId);

      if (error) throw error;

      await loadFamilyMembers();

      toast({
        title: "Member Suspended",
        description: "Family member access has been suspended",
      });

    } catch (error) {
      console.error('Error suspending member:', error);
      toast({
        title: "Suspension Failed",
        description: "Failed to suspend family member",
        variant: "destructive",
      });
    }
  };

  const removeFamilyMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      await loadFamilyMembers();

      toast({
        title: "Member Removed",
        description: "Family member has been removed from your profile",
      });

    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove family member",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'parent': return <Heart className="h-4 w-4 text-red-500" />;
      case 'sibling': return <Users className="h-4 w-4 text-blue-500" />;
      case 'guardian': return <Shield className="h-4 w-4 text-green-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="text-xs">Active</Badge>;
      case 'pending': return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case 'suspended': return <Badge variant="destructive" className="text-xs">Suspended</Badge>;
      default: return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading family members...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Family Access Management</h2>
          <p className="text-muted-foreground">
            Manage who can help with your matrimonial profile
          </p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Family Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invite Family Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={invitation.name}
                    onChange={(e) => setInvitation(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={invitation.email}
                    onChange={(e) => setInvitation(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Input
                    id="relationship"
                    value={invitation.relationship}
                    onChange={(e) => setInvitation(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g., Mother, Father, Sister"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={invitation.role}
                    onValueChange={(value: any) => setInvitation(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="family_member">Family Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <Label>Permissions</Label>
                <div className="mt-2 space-y-3">
                  {Object.entries(invitation.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {key === 'view_profile' && <Eye className="h-4 w-4" />}
                        {key === 'manage_profile' && <Edit className="h-4 w-4" />}
                        {key === 'send_interests' && <Heart className="h-4 w-4" />}
                        {key === 'view_messages' && <MessageSquare className="h-4 w-4" />}
                        {key === 'manage_photos' && <Settings className="h-4 w-4" />}
                        {key === 'receive_notifications' && <Mail className="h-4 w-4" />}
                        <span className="text-sm">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setInvitation(prev => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            [key]: e.target.checked
                          }
                        }))}
                        className="h-4 w-4"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={invitation.personalMessage || ''}
                  onChange={(e) => setInvitation(prev => ({ ...prev, personalMessage: e.target.value }))}
                  placeholder="Add a personal message to your invitation..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={sendFamilyInvitation}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Family Members List */}
      {familyMembers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Family Members Yet</h3>
            <p className="text-muted-foreground mb-4">
              Invite family members to help manage your matrimonial profile
            </p>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite First Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {familyMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(member.role)}
                    <div>
                      <CardTitle className="text-lg">{member.family_member_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(member.status)}
                    {member.last_activity && (
                      <Badge variant="outline" className="text-xs">
                        Last active: {new Date(member.last_activity).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{member.family_member_email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Invited {new Date(member.invited_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Permissions Display */}
                  <div>
                    <h4 className="font-medium mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(member.permissions).map(([key, value]) => (
                        value && (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Edit Permissions
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Permissions - {member.family_member_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {Object.entries(member.permissions).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => {
                                  const newPermissions = {
                                    ...member.permissions,
                                    [key]: e.target.checked
                                  };
                                  updateMemberPermissions(member.id, newPermissions);
                                }}
                                className="h-4 w-4"
                              />
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {member.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => suspendFamilyMember(member.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFamilyMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cultural Considerations */}
      <Alert>
        <Heart className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Cultural Considerations for Family Involvement</p>
            <ul className="text-sm space-y-1">
              <li>• Family members can help create introduction letters for potential matches</li>
              <li>• Parents can manage profile on behalf of their children (with consent)</li>
              <li>• Extended family can share family background and values</li>
              <li>• All family actions are logged and child retains ultimate control</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};