import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProfilePreview } from "@/components/profile/ProfilePreview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";

export default function ProfilePreviewPage() {
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('profileid');
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (profileId) {
      loadPublicProfile(profileId);
    } else {
      setIsLoading(false);
    }
  }, [profileId]);

  const loadPublicProfile = async (id: string) => {
    try {
      // Load user profile by profile_id
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('profile_id', id)
        .single();

      if (profileError) throw profileError;

      // Load partner preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('partner_preferences')
        .select('*')
        .eq('user_id', profileData.user_id)
        .single();

      if (preferencesError) {
        console.warn('No partner preferences found:', preferencesError);
      }

      setProfile(profileData);
      setPreferences(preferencesData);
    } catch (error) {
      console.error('Error loading public profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Profile Link</h1>
          <p className="text-muted-foreground">No profile ID provided in the URL.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist or is not accessible.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ProfilePreview 
      profile={profile} 
      preferences={preferences} 
      isOwnProfile={false}
    />
  );
}