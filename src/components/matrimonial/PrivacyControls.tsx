import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Globe, 
  Users, 
  Crown, 
  Eye, 
  EyeOff,
  Shield,
  Camera,
  Phone,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PrivacySettings {
  visibility: 'public' | 'community' | 'premium' | 'private';
  photo_visibility: 'all' | 'premium' | 'private';
  contact_visibility: 'all' | 'premium' | 'private';
  view_tracking_enabled: boolean;
}

const PrivacyControls: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    visibility: 'community',
    photo_visibility: 'all',
    contact_visibility: 'premium',
    view_tracking_enabled: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('visibility, photo_visibility, contact_visibility, view_tracking_enabled')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setSettings({
          visibility: (data.visibility as 'public' | 'community' | 'premium' | 'private') || 'community',
          photo_visibility: (data.photo_visibility as 'all' | 'premium' | 'private') || 'all',
          contact_visibility: (data.contact_visibility as 'all' | 'premium' | 'private') || 'premium',
          view_tracking_enabled: data.view_tracking_enabled ?? true
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load privacy settings.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          visibility: settings.visibility,
          photo_visibility: settings.photo_visibility,
          contact_visibility: settings.contact_visibility,
          view_tracking_enabled: settings.view_tracking_enabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Log security event
      console.log('🔒 PRIVACY SETTINGS UPDATED:', {
        user_id: user?.id,
        settings,
        timestamp: new Date().toISOString()
      });

      toast({
        title: 'Privacy Settings Updated',
        description: 'Your privacy settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save privacy settings.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Visible to everyone',
      icon: Globe,
      color: 'text-green-500'
    },
    {
      value: 'community',
      label: 'Community',
      description: 'Visible to registered users',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      value: 'premium',
      label: 'Premium Only',
      description: 'Visible to premium members',
      icon: Crown,
      color: 'text-purple-500'
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Only after mutual interest',
      icon: Lock,
      color: 'text-red-500'
    }
  ];

  const photoVisibilityOptions = [
    {
      value: 'all',
      label: 'Everyone',
      description: 'All users can see photos',
      icon: Eye
    },
    {
      value: 'premium',
      label: 'Premium Members',
      description: 'Only premium users can see photos',
      icon: Crown
    },
    {
      value: 'private',
      label: 'Connections Only',
      description: 'Only after mutual interest',
      icon: Lock
    }
  ];

  const contactVisibilityOptions = [
    {
      value: 'all',
      label: 'Everyone',
      description: 'Contact details visible to all',
      icon: Phone
    },
    {
      value: 'premium',
      label: 'Premium Members',
      description: 'Contact visible to premium users',
      icon: Crown
    },
    {
      value: 'private',
      label: 'Connections Only',
      description: 'Contact visible after connection',
      icon: Lock
    }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Loading privacy settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Privacy Controls</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Profile Visibility</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Control who can see your profile information
              </p>
            </div>
            <RadioGroup
              value={settings.visibility}
              onValueChange={(value: any) => setSettings(prev => ({ ...prev, visibility: value }))}
            >
              {visibilityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex items-center gap-2 flex-1">
                    <option.icon className={`h-4 w-4 ${option.color}`} />
                    <div>
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  {option.value === 'premium' && (
                    <Badge variant="outline" className="text-xs">Premium Feature</Badge>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Photo Visibility */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Photo Visibility</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Control who can see your photos
              </p>
            </div>
            <RadioGroup
              value={settings.photo_visibility}
              onValueChange={(value: any) => setSettings(prev => ({ ...prev, photo_visibility: value }))}
            >
              {photoVisibilityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value={option.value} id={`photo_${option.value}`} />
                  <div className="flex items-center gap-2 flex-1">
                    <Camera className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label htmlFor={`photo_${option.value}`} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Contact Visibility */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Control who can see your contact details
              </p>
            </div>
            <RadioGroup
              value={settings.contact_visibility}
              onValueChange={(value: any) => setSettings(prev => ({ ...prev, contact_visibility: value }))}
            >
              {contactVisibilityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value={option.value} id={`contact_${option.value}`} />
                  <div className="flex items-center gap-2 flex-1">
                    <option.icon className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label htmlFor={`contact_${option.value}`} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* View Tracking */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="view-tracking" className="font-medium">View Tracking</Label>
                <p className="text-xs text-muted-foreground">Allow others to see when you viewed their profile</p>
              </div>
            </div>
            <Switch
              id="view-tracking"
              checked={settings.view_tracking_enabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, view_tracking_enabled: checked }))}
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={savePrivacySettings} 
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Save Privacy Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyControls;