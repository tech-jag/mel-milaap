import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Shield, Eye, EyeOff, Users, Crown } from 'lucide-react';

const PrivacySettings = () => {
  const { user } = useAuth();
  const [visibility, setVisibility] = useState<string>('community');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('visibility')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data?.visibility) {
        setVisibility(data.visibility);
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load privacy settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          visibility,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Settings Updated',
        description: 'Your privacy settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save privacy settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Profile Privacy Settings
        </CardTitle>
        <CardDescription>
          Control who can view your profile and contact you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={visibility} onValueChange={setVisibility}>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="public" id="public" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="public" className="flex items-center gap-2 font-medium">
                  <Eye className="h-4 w-4" />
                  Public
                </Label>
                <p className="text-sm text-muted-foreground">
                  Anyone can view your profile, including non-registered users
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="community" id="community" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="community" className="flex items-center gap-2 font-medium">
                  <Users className="h-4 w-4" />
                  Community Only
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only registered members can view your profile
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="premium" id="premium" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="premium" className="flex items-center gap-2 font-medium">
                  <Crown className="h-4 w-4" />
                  Premium Members Only
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only premium subscribers and mutual connections can view your profile
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="private" id="private" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="private" className="flex items-center gap-2 font-medium">
                  <EyeOff className="h-4 w-4" />
                  Private
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only users with mutual accepted interests can view your profile
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>

        <div className="pt-4 border-t">
          <Button 
            onClick={savePrivacySettings} 
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Privacy Settings'}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Note:</strong> Changing your privacy settings will take effect immediately.</p>
          <p>Your photos will follow the same visibility rules as your profile.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;