import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { ProfilePreview } from "@/components/profile/ProfilePreview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadPublicProfile(userId);
    }
  }, [userId]);

  const loadPublicProfile = async (id: string) => {
    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', id)
        .single();

      if (profileError) throw profileError;

      // Load partner preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('partner_preferences')
        .select('*')
        .eq('user_id', id)
        .single();

      if (preferencesError) throw preferencesError;

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <ProfilePreview 
          profile={profile} 
          preferences={preferences} 
          isOwnProfile={false}
        />
      </main>

      <Footer />
    </div>
  );
}