"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard,
  CheckCircle,
  Camera,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  Users,
  Crown,
  Calendar,
  MapPin,
  Heart,
  Settings
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/utils/seo";

const AccountSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [settings, setSettings] = React.useState<any>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordData, setPasswordData] = React.useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [collaborators, setCollaborators] = React.useState<any[]>([]);

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    setCurrentUser(user);
    await Promise.all([
      loadUserProfile(user.id),
      loadUserSettings(user.id),
      loadCollaborators(user.id)
    ]);
    setIsLoading(false);
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadUserSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Create default settings
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            email_notifications: true,
            two_factor_enabled: false,
            profile_visibility: 'public'
          })
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const loadCollaborators = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .or(`inviter_user_id.eq.${userId},invitee_user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollaborators(data || []);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', currentUser.id);

      if (error) throw error;

      setUserProfile(prev => ({ ...prev, ...updates }));
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateSettings = async (key: string, value: any) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ [key]: value })
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      toast({
        title: "Settings updated",
        description: "Your settings have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updatePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new
      });

      if (error) throw error;

      setPasswordData({ current: '', new: '', confirm: '' });
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const inviteCollaborator = async (email: string, role: string) => {
    if (!currentUser) return;

    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase
        .from('collaborators')
        .insert({
          inviter_user_id: currentUser.id,
          invitee_email: email,
          role: role as 'parent' | 'sibling' | 'partner' | 'close_friend',
          invitation_token: token,
          invitation_expires_at: expiresAt.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      await loadCollaborators(currentUser.id);
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${email} as ${role}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Account Settings – Mēl Milaap"
        description="Manage your Mēl Milaap account settings, privacy preferences, and security options."
      />
      <Navigation />
      
      {/* Header */}
      <section className="py-8 bg-gradient-hero">
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
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Badge>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                  Settings & Preferences
                </h1>
                <p className="text-muted-foreground">
                  Manage your account, privacy, and security settings
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={userProfile?.subscription_tier === 'free' ? 'secondary' : 'default'}>
                  {userProfile?.subscription_tier === 'free' ? 'Free Plan' : 'Premium Plan'}
                </Badge>
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

      {/* Settings Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="hidden md:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="collaborators" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline">Family</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden md:inline">Billing</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userProfile?.name || ''}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                          onBlur={(e) => updateProfile({ name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={currentUser?.email || ''}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userProfile?.phone || ''}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                          onBlur={(e) => updateProfile({ phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={userProfile?.city || ''}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, city: e.target.value }))}
                          onBlur={(e) => updateProfile({ city: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Wedding Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="partner">Partner's Name</Label>
                        <Input
                          id="partner"
                          value={userProfile?.partner_name || ''}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, partner_name: e.target.value }))}
                          onBlur={(e) => updateProfile({ partner_name: e.target.value })}
                          placeholder="Enter partner's name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wedding-date">Wedding Date</Label>
                        <Input
                          id="wedding-date"
                          type="date"
                          value={userProfile?.wedding_date || ''}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, wedding_date: e.target.value }))}
                          onBlur={(e) => updateProfile({ wedding_date: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="venue">Venue Location</Label>
                        <Input
                          id="venue"
                          value={userProfile?.venue_location || ''}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, venue_location: e.target.value }))}
                          onBlur={(e) => updateProfile({ venue_location: e.target.value })}
                          placeholder="Enter venue location"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.current}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.new}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                      />
                    </div>
                    <Button onClick={updatePassword}>
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smartphone className="w-5 h-5 mr-2" />
                      Two-Factor Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable 2FA</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.two_factor_enabled || false}
                        onCheckedChange={(checked) => updateSettings('two_factor_enabled', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={settings.email_notifications || false}
                        onCheckedChange={(checked) => updateSettings('email_notifications', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Match Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you receive new matches
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Message Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new messages
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Planning Reminders</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders about wedding planning tasks
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-muted-foreground">
                          Control who can see your profile
                        </p>
                      </div>
                      <Switch
                        checked={settings.profile_visibility === 'public'}
                        onCheckedChange={(checked) => 
                          updateSettings('profile_visibility', checked ? 'public' : 'private')
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Collaborators Tab */}
              <TabsContent value="collaborators" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Family Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Invite family members to help with your wedding planning and profile management.
                      </p>
                      
                      {collaborators.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Current Collaborators</h4>
                          {collaborators.map((collab) => (
                            <div key={collab.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{collab.invitee_email}</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {collab.role} • {collab.status}
                                </p>
                              </div>
                              <Badge variant={collab.status === 'accepted' ? 'default' : 'secondary'}>
                                {collab.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Invite New Collaborator</h4>
                        <div className="flex space-x-2">
                          <Input placeholder="Enter email address" className="flex-1" />
                          <Button onClick={() => inviteCollaborator('example@email.com', 'parent')}>
                            Invite
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Crown className="w-5 h-5 mr-2" />
                      Subscription Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium capitalize">{userProfile?.plan || 'Free'} Plan</h4>
                          <p className="text-sm text-muted-foreground">
                            {userProfile?.plan === 'free' ? 'Basic features included' : 'Full access to premium features'}
                          </p>
                        </div>
                        <Badge variant={userProfile?.plan === 'free' ? 'secondary' : 'default'}>
                          {userProfile?.plan === 'free' ? 'Current Plan' : 'Premium'}
                        </Badge>
                      </div>
                      
                      {userProfile?.plan === 'free' && (
                        <div className="text-center p-6 bg-muted/30 rounded-lg">
                          <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                          <p className="text-muted-foreground mb-4">
                            Unlock advanced features, priority support, and more matches
                          </p>
                          <Link to="/pricing">
                            <Button>
                              View Pricing Plans
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No payment method on file
                      </p>
                      <Button variant="outline" className="mt-4">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccountSettings;