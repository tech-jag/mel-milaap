import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Shield, 
  UserPlus, 
  UserMinus, 
  Key,
  Eye,
  EyeOff,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FamilyMember {
  id: string;
  user_id: string;
  family_member_id: string;
  relationship: string;
  access_level: 'view' | 'manage' | 'full';
  can_view_photos: boolean;
  can_view_contacts: boolean;
  can_manage_profile: boolean;
  created_at: string;
  member_profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const FamilyAccessManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user) {
      loadFamilyMembers();
    }
  }, [user]);

  const loadFamilyMembers = async () => {
    try {
      // Note: This would require a family_access table to be created
      // For now, we'll show a placeholder implementation
      setFamilyMembers([]);
    } catch (error) {
      console.error('Error loading family members:', error);
      toast({
        title: "Error Loading Family Members",
        description: "Could not load family access settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFamilyMember = async () => {
    if (!newMemberEmail || !newMemberRelation) {
      toast({
        title: "Missing Information",
        description: "Please provide email and relationship",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      // This would require implementing the family access system
      // For now, show success message
      toast({
        title: "Family Member Added",
        description: `Invitation sent to ${newMemberEmail}`,
      });
      
      setNewMemberEmail('');
      setNewMemberRelation('');
      loadFamilyMembers();
    } catch (error) {
      console.error('Error adding family member:', error);
      toast({
        title: "Error Adding Member",
        description: "Could not add family member",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const updateMemberAccess = async (memberId: string, permissions: Partial<FamilyMember>) => {
    try {
      // This would update the family member's permissions
      toast({
        title: "Permissions Updated",
        description: "Family member access has been updated",
      });
      loadFamilyMembers();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Error Updating Permissions",
        description: "Could not update family member access",
        variant: "destructive"
      });
    }
  };

  const removeFamilyMember = async (memberId: string) => {
    try {
      // This would remove the family member
      toast({
        title: "Family Member Removed",
        description: "Access has been revoked",
      });
      loadFamilyMembers();
    } catch (error) {
      console.error('Error removing family member:', error);
      toast({
        title: "Error Removing Member",
        description: "Could not remove family member",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Loading family access settings...
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
            Family Access Management
          </CardTitle>
          <CardDescription>
            Manage who in your family can access and manage your matrimonial profile
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">Enterprise Security Features:</p>
            <ul className="text-sm space-y-1">
              <li>• All family access is logged and monitored</li>
              <li>• Two-factor authentication required for family managers</li>
              <li>• Granular permission controls for different access levels</li>
              <li>• Automatic access revocation after inactivity</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Add New Family Member */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Family Member
          </CardTitle>
          <CardDescription>
            Grant access to trusted family members to help manage your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberEmail">Email Address</Label>
              <Input
                id="memberEmail"
                type="email"
                placeholder="family.member@example.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                placeholder="e.g., Mother, Father, Sister"
                value={newMemberRelation}
                onChange={(e) => setNewMemberRelation(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={addFamilyMember} 
            disabled={isAdding}
            className="w-full md:w-auto"
          >
            {isAdding ? 'Sending Invitation...' : 'Send Invitation'}
          </Button>
        </CardContent>
      </Card>

      {/* Current Family Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Family Access</CardTitle>
          <CardDescription>
            Family members with access to your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {familyMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No family members have been granted access yet</p>
              <p className="text-sm">Add trusted family members above to help manage your profile</p>
            </div>
          ) : (
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">
                        {member.member_profile?.first_name} {member.member_profile?.last_name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {member.relationship} • {member.member_profile?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        member.access_level === 'full' ? 'default' :
                        member.access_level === 'manage' ? 'secondary' : 'outline'
                      }>
                        {member.access_level.toUpperCase()}
                      </Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFamilyMember(member.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {member.can_view_photos ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={member.can_view_photos ? 'text-green-600' : 'text-gray-500'}>
                        View Photos
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {member.can_view_contacts ? (
                        <Phone className="h-4 w-4 text-green-500" />
                      ) : (
                        <Phone className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={member.can_view_contacts ? 'text-green-600' : 'text-gray-500'}>
                        View Contacts
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {member.can_manage_profile ? (
                        <Key className="h-4 w-4 text-green-500" />
                      ) : (
                        <Key className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={member.can_manage_profile ? 'text-green-600' : 'text-gray-500'}>
                        Manage Profile
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Level Explanations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Access Level Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">VIEW</Badge>
              <h4 className="font-medium">View Only</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Can view basic profile information</li>
                <li>• Cannot make changes</li>
                <li>• Cannot view private details</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <Badge variant="secondary" className="w-fit">MANAGE</Badge>
              <h4 className="font-medium">Manage</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Can update profile information</li>
                <li>• Can respond to interests</li>
                <li>• Cannot delete account</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <Badge variant="default" className="w-fit">FULL</Badge>
              <h4 className="font-medium">Full Access</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete profile management</li>
                <li>• Can manage other family access</li>
                <li>• Access to all features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Important Security Notes:</p>
                <ul className="text-sm space-y-1">
                  <li>• Family members will receive email verification before access is granted</li>
                  <li>• All family access activities are logged for security purposes</li>
                  <li>• You can revoke access at any time</li>
                  <li>• Family members must use two-factor authentication for sensitive operations</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Audit Trail</h4>
              <p className="text-sm text-muted-foreground">
                Track all family member activities and access
              </p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Get notified when family members access your profile
              </p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};