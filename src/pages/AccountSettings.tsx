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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useContactPreferences } from "@/hooks/useContactPreferences";
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
  Settings,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  Building,
  Plus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/utils/seo";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountHeader } from "@/components/ui/account-header";

const AccountSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { preferences: contactPreferences, updatePreferences: updateContactPreferences } = useContactPreferences();
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
  const [newCollaboratorEmail, setNewCollaboratorEmail] = React.useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = React.useState('parent');

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

  const inviteCollaborator = async () => {
    if (!currentUser || !newCollaboratorEmail) return;

    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Type-safe role validation
      const validRoles = ['parent', 'sibling', 'partner', 'close_friend'] as const;
      if (!validRoles.includes(newCollaboratorRole as any)) {
        throw new Error(`Invalid role: ${newCollaboratorRole}`);
      }

      const { error } = await supabase
        .from('collaborators')
        .insert({
          inviter_user_id: currentUser.id,
          invitee_email: newCollaboratorEmail,
          role: newCollaboratorRole as typeof validRoles[number],
          invitation_token: token,
          invitation_expires_at: expiresAt.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      await loadCollaborators(currentUser.id);
      setNewCollaboratorEmail('');
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${newCollaboratorEmail} as ${newCollaboratorRole}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Helper function to get subscription plan display
  const getSubscriptionDisplay = () => {
    const tier = userProfile?.subscription_tier;
    if (!tier || tier === 'free') {
      return {
        label: 'Free Plan',
        variant: 'outline' as const,
        showUpgrade: true
      };
    } else if (tier === 'premium') {
      return {
        label: 'Premium Plan',
        variant: 'default' as const,
        showUpgrade: false
      };
    } else if (tier === 'gold') {
      return {
        label: 'Gold Plan',
        variant: 'default' as const,
        showUpgrade: false
      };
    } else {
      return {
        label: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`,
        variant: 'default' as const,
        showUpgrade: false
      };
    }
  };

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm lg:text-base">Loading settings...</p>
        </div>
      </div>
    );
  }

  const subscriptionInfo = getSubscriptionDisplay();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <SEO 
          title="Account Settings – Mēl Milaap"
          description="Manage your Mēl Milaap account settings, privacy preferences, and security options."
        />
        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          {/* Account Header */}
          <AccountHeader
            title="Settings & Preferences"
            description="Manage your account, privacy, and security settings"
            icon={Settings}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              {subscriptionInfo.showUpgrade ? (
                <Link to="/premium-plans">
                  <Badge 
                    variant="outline" 
                    className="text-primary bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 text-xs lg:text-sm"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade Plan
                  </Badge>
                </Link>
              ) : (
                <Badge 
                  variant={subscriptionInfo.variant}
                  className="bg-green-100 text-green-800 border-green-200 text-xs lg:text-sm"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  {subscriptionInfo.label}
                </Badge>
              )}
            </div>
          </AccountHeader>

          {/* Main Content */}
          <div className="container mx-auto px-4 lg:px-8 py-6">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="profile" className="space-y-6 lg:space-y-8">
                
                {/* Mobile-Responsive Tab List */}
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1">
                  <TabsTrigger value="profile" className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-2 py-2 lg:py-3 text-xs lg:text-sm">
                    <User className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="contact-preferences" className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-2 py-2 lg:py-3 text-xs lg:text-sm">
                    <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">Contact</span>
                    <span className="lg:hidden">Contact</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-2 py-2 lg:py-3 text-xs lg:text-sm">
                    <Shield className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Security</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-2 py-2 lg:py-3 text-xs lg:text-sm">
                    <Bell className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">Notifications</span>
                    <span className="lg:hidden">Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger value="collaborators" className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-2 py-2 lg:py-3 text-xs lg:text-sm">
                    <Users className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Family</span>
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-2 py-2 lg:py-3 text-xs lg:text-sm col-span-2 lg:col-span-1">
                    <CreditCard className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>Billing</span>
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4 lg:space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <User className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm lg:text-base">Full Name</Label>
                          <Input
                            id="name"
                            value={userProfile?.name || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                            onBlur={(e) => updateProfile({ name: e.target.value })}
                            className="text-sm lg:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm lg:text-base">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={currentUser?.email || ''}
                            disabled
                            className="text-sm lg:text-base bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm lg:text-base">Phone Number</Label>
                          <Input
                            id="phone"
                            value={userProfile?.phone || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                            onBlur={(e) => updateProfile({ phone: e.target.value })}
                            className="text-sm lg:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm lg:text-base">City</Label>
                          <Input
                            id="city"
                            value={userProfile?.city || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, city: e.target.value }))}
                            onBlur={(e) => updateProfile({ city: e.target.value })}
                            className="text-sm lg:text-base"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Heart className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Wedding Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="partner" className="text-sm lg:text-base">Partner's Name</Label>
                          <Input
                            id="partner"
                            value={userProfile?.partner_name || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, partner_name: e.target.value }))}
                            onBlur={(e) => updateProfile({ partner_name: e.target.value })}
                            placeholder="Enter partner's name"
                            className="text-sm lg:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wedding-date" className="text-sm lg:text-base">Wedding Date</Label>
                          <Input
                            id="wedding-date"
                            type="date"
                            value={userProfile?.wedding_date || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, wedding_date: e.target.value }))}
                            onBlur={(e) => updateProfile({ wedding_date: e.target.value })}
                            className="text-sm lg:text-base"
                          />
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                          <Label htmlFor="venue" className="text-sm lg:text-base">Venue Location</Label>
                          <Input
                            id="venue"
                            value={userProfile?.venue_location || ''}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, venue_location: e.target.value }))}
                            onBlur={(e) => updateProfile({ venue_location: e.target.value })}
                            placeholder="Enter venue location"
                            className="text-sm lg:text-base"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Contact Preferences Tab */}
                <TabsContent value="contact-preferences" className="space-y-4 lg:space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Heart className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Contact & Privacy Controls
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      
                      {/* Who can contact you */}
                      <div className="space-y-3">
                        <Label className="text-sm lg:text-base font-medium">Who can send you messages?</Label>
                        <RadioGroup 
                          value={contactPreferences.who_can_message} 
                          onValueChange={(value) => updateContactPreferences({ who_can_message: value })}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="anyone" id="anyone" />
                            <Label htmlFor="anyone" className="text-sm lg:text-base">Anyone can contact me</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="premium-only" id="premium-only" />
                            <Label htmlFor="premium-only" className="text-sm lg:text-base">Only Premium Members</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="liked-only" id="liked-only" />
                            <Label htmlFor="liked-only" className="text-sm lg:text-base">Only members I liked</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hidden" id="hidden" />
                            <Label htmlFor="hidden" className="text-sm lg:text-base">No one (Hidden mode)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Phone number sharing */}
                      <div className="space-y-3">
                        <Label className="text-sm lg:text-base font-medium">Phone number visibility</Label>
                        <Select 
                          value={contactPreferences.phone_visibility} 
                          onValueChange={(value) => updateContactPreferences({ phone_visibility: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never">Never show</SelectItem>
                            <SelectItem value="premium-connections">Premium connections only</SelectItem>
                            <SelectItem value="mutual-interest">After mutual interest</SelectItem>
                            <SelectItem value="always">Always visible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Auto-responses */}
                      <div className="space-y-3">
                        <Label htmlFor="auto-response" className="text-sm lg:text-base font-medium">Auto-response message</Label>
                        <Textarea 
                          id="auto-response"
                          placeholder="Thank you for your interest. I will get back to you soon..."
                          value={contactPreferences.auto_response_message || ''}
                          onChange={(e) => updateContactPreferences({ auto_response_message: e.target.value })}
                          className="mt-2 text-sm lg:text-base"
                        />
                        <div className="flex items-center space-x-2 mt-3">
                          <Switch 
                            checked={contactPreferences.auto_response_enabled} 
                            onCheckedChange={(checked) => updateContactPreferences({ auto_response_enabled: checked })}
                          />
                          <Label className="text-sm lg:text-base">Enable auto-response</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4 lg:space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Lock className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Change Password
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-sm lg:text-base">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showPassword ? "text" : "password"}
                            value={passwordData.current}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                            className="text-sm lg:text-base pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 lg:h-8 lg:w-8"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-3 h-3 lg:w-4 lg:h-4" /> : <Eye className="w-3 h-3 lg:w-4 lg:h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-sm lg:text-base">New Password</Label>
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.new}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                          className="text-sm lg:text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm lg:text-base">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                          className="text-sm lg:text-base"
                        />
                      </div>
                      <Button onClick={updatePassword} className="w-full sm:w-auto text-sm lg:text-base">
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Smartphone className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Two-Factor Authentication
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <h4 className="font-medium text-sm lg:text-base">Enable 2FA</h4>
                          <p className="text-xs lg:text-sm text-muted-foreground">
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
                <TabsContent value="notifications" className="space-y-4 lg:space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Bell className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Notification Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <h4 className="font-medium text-sm lg:text-base">Email Notifications</h4>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          checked={settings.email_notifications || false}
                          onCheckedChange={(checked) => updateSettings('email_notifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <h4 className="font-medium text-sm lg:text-base">Match Notifications</h4>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            Get notified when you receive new matches
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <h4 className="font-medium text-sm lg:text-base">Message Notifications</h4>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            Get notified about new messages
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <h4 className="font-medium text-sm lg:text-base">Planning Reminders</h4>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            Receive reminders about wedding planning tasks
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg lg:text-xl">Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <h4 className="font-medium text-sm lg:text-base">Profile Visibility</h4>
                          <p className="text-xs lg:text-sm text-muted-foreground">
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
                <TabsContent value="collaborators" className="space-y-4 lg:space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Family Collaboration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          Invite family members to help with your wedding planning and profile management.
                        </p>
                        
                        {collaborators.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm lg:text-base">Current Collaborators</h4>
                            {collaborators.map((collab) => (
                              <div key={collab.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                                <div className="flex-1">
                                  <p className="font-medium text-sm lg:text-base break-all">{collab.invitee_email}</p>
                                  <p className="text-xs lg:text-sm text-muted-foreground capitalize">
                                    {collab.role} • {collab.status}
                                  </p>
                                </div>
                                <Badge 
                                  variant={collab.status === 'accepted' ? 'default' : 'secondary'}
                                  className="text-xs self-start sm:self-center"
                                >
                                  {collab.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3 text-sm lg:text-base">Invite New Collaborator</h4>
                          <div className="space-y-3">
                            <Input 
                              placeholder="Enter email address" 
                              value={newCollaboratorEmail}
                              onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                              className="text-sm lg:text-base"
                            />
                            <div className="flex flex-col sm:flex-row gap-2">
                              <select 
                                value={newCollaboratorRole}
                                onChange={(e) => setNewCollaboratorRole(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:text-base"
                              >
                                <option value="parent">Parent</option>
                                <option value="sibling">Sibling</option>
                                <option value="partner">Partner</option>
                                <option value="close_friend">Close Friend</option>
                              </select>
                              <Button 
                                onClick={inviteCollaborator}
                                disabled={!newCollaboratorEmail}
                                className="w-full sm:w-auto text-sm lg:text-base"
                              >
                                Send Invite
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="space-y-4 lg:space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <Crown className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Subscription Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm lg:text-base">{subscriptionInfo.label}</h4>
                            <p className="text-xs lg:text-sm text-muted-foreground">
                              {subscriptionInfo.showUpgrade ? "Basic features included" : "Premium features unlocked"}
                            </p>
                          </div>
                          <Badge variant={subscriptionInfo.variant} className="text-xs self-start sm:self-center">
                            Current Plan
                          </Badge>
                        </div>
                      
                        {subscriptionInfo.showUpgrade && (
                          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
                            <Crown className="w-8 h-8 lg:w-12 lg:h-12 text-primary mx-auto mb-3 lg:mb-4" />
                            <h3 className="text-base lg:text-lg font-semibold mb-2">Upgrade to Premium</h3>
                            <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
                              Unlock advanced features, priority support, and more matches
                            </p>
                            <Link to="/premium-plans">
                              <Button className="w-full sm:w-auto text-sm lg:text-base">
                                View Pricing Plans
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg lg:text-xl">
                        <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-4 lg:p-6">
                        <CreditCard className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground mx-auto mb-3 lg:mb-4" />
                        <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
                          No payment method on file
                        </p>
                        <Button variant="outline" className="text-sm lg:text-base">
                          Add Payment Method
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AccountSettings;