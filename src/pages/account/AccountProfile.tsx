import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { AccountSidebar } from '@/components/ui/account-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { RELIGIONS, MOTHER_TONGUES, EDUCATION_LEVELS, COUNTRIES, HEIGHTS } from '@/data/onboarding-options';

export default function AccountProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your changes have been saved",
        duration: 3000
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "Please try again",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <AccountSidebar />
          </div>
          
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-heading font-bold">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your personal information</p>
              </div>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.first_name || ''}
                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.last_name || ''}
                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Gender</Label>
                      <Select value={profile.gender || ''} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non_binary">Non-binary</SelectItem>
                          <SelectItem value="prefer_not_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Height</Label>
                      <Select 
                        value={profile.height_cm?.toString() || ''} 
                        onValueChange={(value) => setProfile({ ...profile, height_cm: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select height" />
                        </SelectTrigger>
                        <SelectContent>
                          {HEIGHTS.map((height) => (
                            <SelectItem key={height.value} value={height.value.toString()}>
                              {height.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">About Me</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell others about yourself..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Community & Culture */}
              <Card>
                <CardHeader>
                  <CardTitle>Community & Culture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Religion</Label>
                      <Select value={profile.religion || ''} onValueChange={(value) => setProfile({ ...profile, religion: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select religion" />
                        </SelectTrigger>
                        <SelectContent>
                          {RELIGIONS.map((religion) => (
                            <SelectItem key={religion} value={religion.toLowerCase()}>
                              {religion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Mother Tongue</Label>
                      <Select value={profile.mother_tongue || ''} onValueChange={(value) => setProfile({ ...profile, mother_tongue: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOTHER_TONGUES.map((language) => (
                            <SelectItem key={language} value={language.toLowerCase()}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="caste">Caste/Community (Optional)</Label>
                    <Input
                      id="caste"
                      value={profile.caste_community || ''}
                      onChange={(e) => setProfile({ ...profile, caste_community: e.target.value })}
                      placeholder="Enter your caste or community"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}