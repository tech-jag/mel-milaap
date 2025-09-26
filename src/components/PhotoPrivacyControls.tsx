import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Shield, 
  Eye, 
  EyeOff, 
  Crown, 
  Users,
  Lock,
  AlertTriangle,
  CheckCircle,
  Droplets
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PhotoPrivacySettings {
  photo_visibility: 'public' | 'community' | 'premium' | 'private';
  watermark_enabled: boolean;
  blur_for_free_users: boolean;
  family_access_photos: boolean;
  require_interest_for_photos: boolean;
  auto_blur_face: boolean;
}

export const PhotoPrivacyControls: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PhotoPrivacySettings>({
    photo_visibility: 'community',
    watermark_enabled: false,
    blur_for_free_users: true,
    family_access_photos: false,
    require_interest_for_photos: false,
    auto_blur_face: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_tier')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadPrivacySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      // Handle the photo_privacy_settings column safely
      if (data && typeof data === 'object' && 'photo_privacy_settings' in data) {
        const privacySettings = (data as any).photo_privacy_settings;
        if (privacySettings) {
          setSettings(privacySettings as PhotoPrivacySettings);
        }
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ photo_privacy_settings: settings } as any)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your photo privacy settings have been updated.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof PhotoPrivacySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return <Eye className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'Visible to everyone, including non-registered users';
      case 'community': return 'Visible to registered community members only';
      case 'premium': return 'Visible to premium members and those who express interest';
      case 'private': return 'Visible only after mutual interest acceptance';
      default: return '';
    }
  };

  const isPremiumFeature = (feature: string) => {
    const premiumFeatures = ['watermark_enabled', 'auto_blur_face', 'require_interest_for_photos'];
    return premiumFeatures.includes(feature) && userProfile?.subscription_tier === 'free';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Loading privacy settings...
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
            <Camera className="h-5 w-5" />
            Photo Privacy Controls
          </CardTitle>
          <CardDescription>
            Control who can see your photos and how they're protected
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Visibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Photo Visibility
          </CardTitle>
          <CardDescription>
            Choose who can see your profile photos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="photo-visibility">Visibility Level</Label>
            <Select
              value={settings.photo_visibility}
              onValueChange={(value: any) => updateSetting('photo_visibility', value)}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getVisibilityIcon(settings.photo_visibility)}
                    <span className="capitalize">{settings.photo_visibility}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="community">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Community</span>
                  </div>
                </SelectItem>
                <SelectItem value="premium">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    <span>Premium</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {getVisibilityDescription(settings.photo_visibility)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Protection Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Photo Protection
          </CardTitle>
          <CardDescription>
            Advanced features to protect your photos from misuse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Watermark */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="watermark">Photo Watermark</Label>
                {isPremiumFeature('watermark_enabled') && (
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Add transparent watermark to prevent unauthorized use
              </p>
            </div>
            <Switch
              id="watermark"
              checked={settings.watermark_enabled}
              onCheckedChange={(checked) => updateSetting('watermark_enabled', checked)}
              disabled={isPremiumFeature('watermark_enabled')}
            />
          </div>

          {/* Blur for free users */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="blur-free">Blur for Free Users</Label>
              <p className="text-sm text-muted-foreground">
                Automatically blur photos for non-premium viewers
              </p>
            </div>
            <Switch
              id="blur-free"
              checked={settings.blur_for_free_users}
              onCheckedChange={(checked) => updateSetting('blur_for_free_users', checked)}
            />
          </div>

          {/* Auto face blur */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-blur">Auto Face Blur</Label>
                {isPremiumFeature('auto_blur_face') && (
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically blur faces in photos until interest is mutual
              </p>
            </div>
            <Switch
              id="auto-blur"
              checked={settings.auto_blur_face}
              onCheckedChange={(checked) => updateSetting('auto_blur_face', checked)}
              disabled={isPremiumFeature('auto_blur_face')}
            />
          </div>

          {/* Require interest for photos */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="require-interest">Require Interest for Photos</Label>
                {isPremiumFeature('require_interest_for_photos') && (
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Only show full photos after someone expresses interest
              </p>
            </div>
            <Switch
              id="require-interest"
              checked={settings.require_interest_for_photos}
              onCheckedChange={(checked) => updateSetting('require_interest_for_photos', checked)}
              disabled={isPremiumFeature('require_interest_for_photos')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Family Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Access
          </CardTitle>
          <CardDescription>
            Control family member access to your photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="family-access">Allow Family Photo Access</Label>
              <p className="text-sm text-muted-foreground">
                Let approved family members view your profile photos
              </p>
            </div>
            <Switch
              id="family-access"
              checked={settings.family_access_photos}
              onCheckedChange={(checked) => updateSetting('family_access_photos', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">Important Security Notes:</p>
            <ul className="text-sm space-y-1">
              <li>• All photo access is logged and monitored for security</li>
              <li>• Watermarks help protect against unauthorized use</li>
              <li>• Higher privacy settings may reduce profile visibility</li>
              <li>• Report any suspicious activity immediately</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Premium Upgrade Notice */}
      {userProfile?.subscription_tier === 'free' && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Crown className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">Upgrade for Advanced Protection</h3>
                  <p className="text-sm text-orange-700">
                    Get watermarks, auto-blur, and advanced privacy controls with Premium.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <Link to="/premium-plans">
                  Upgrade Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePrivacySettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </div>
    </div>
  );
};