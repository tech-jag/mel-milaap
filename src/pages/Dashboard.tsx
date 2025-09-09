import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { User, Heart, Settings, Camera } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Welcome back, {profile?.first_name || 'there'}!
          </h1>
          <p className="text-muted-foreground">
            Your journey to find your perfect match continues here.
          </p>
          
          {profile?.managed_by_user_id && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Profile managed by:</strong> {profile.manager_relation || 'Family member'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <User className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile</p>
                <p className="text-2xl font-bold">
                  {profile?.onboarding_completed ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Heart className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Matches</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Camera className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Photos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Settings className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Settings</p>
                <p className="text-2xl font-bold">Basic</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Update your profile information and preferences.
              </p>
              <Button 
                onClick={() => navigate('/account/profile')}
                className="w-full"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Find Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Discover compatible profiles and potential matches.
              </p>
              <Button 
                onClick={() => navigate('/find')}
                className="w-full"
                variant="outline"
              >
                Browse Profiles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Wedding Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Access planning tools for your special day.
              </p>
              <Button 
                onClick={() => navigate('/my/planning')}
                className="w-full"
                variant="outline"
              >
                Planning Tools
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion */}
        {!profile?.onboarding_completed && (
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete your profile to start finding matches and using all platform features.
              </p>
              <Button onClick={() => navigate('/onboarding')}>
                Continue Setup
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}