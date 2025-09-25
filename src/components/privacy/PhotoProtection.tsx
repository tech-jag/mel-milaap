import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Eye } from 'lucide-react';

interface PhotoProtectionProps {
  photoUrl: string;
  profileId: string;
  className?: string;
}

const PhotoProtection: React.FC<PhotoProtectionProps> = ({
  photoUrl,
  profileId,
  className = '',
}) => {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState(false);
  const [shouldBlur, setShouldBlur] = useState(true);
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPhotoAccess();
  }, [user, profileId]);

  const checkPhotoAccess = async () => {
    if (!user || !profileId) {
      setLoading(false);
      return;
    }

    try {
      // Check if this is the user's own photo
      if (user.id === profileId) {
        setCanAccess(true);
        setShouldBlur(false);
        setLoading(false);
        return;
      }

      // Check user's subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('subject_id', user.id)
        .eq('subject_type', 'user')
        .eq('status', 'active')
        .single();

      const isPremium = !!subscription;

      // Check profile visibility settings
      const { data: profile } = await supabase
        .from('profiles')
        .select('visibility')
        .eq('user_id', profileId)
        .single();

      // Check for mutual interests
      const { data: mutualInterest } = await supabase
        .from('interests')
        .select('status')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`)
        .eq('status', 'accepted')
        .single();

      const hasMutualInterest = !!mutualInterest;

      // Determine access based on profile privacy and user status
      let hasAccess = false;
      let shouldBlurPhoto = true;

      if (profile?.visibility === 'public') {
        hasAccess = true;
        shouldBlurPhoto = false;
      } else if (profile?.visibility === 'community') {
        hasAccess = true;
        shouldBlurPhoto = !isPremium && !hasMutualInterest;
      } else if (profile?.visibility === 'premium') {
        hasAccess = isPremium || hasMutualInterest;
        shouldBlurPhoto = !hasAccess;
      } else if (profile?.visibility === 'private') {
        hasAccess = hasMutualInterest;
        shouldBlurPhoto = !hasAccess;
      }

      setCanAccess(hasAccess);
      setShouldBlur(shouldBlurPhoto);
      setUserRole(isPremium ? 'premium' : 'user');
    } catch (error) {
      console.error('Error checking photo access:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="animate-pulse bg-muted rounded-lg aspect-square"></div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <Card className={`relative ${className}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Photo Protected</p>
              <Badge variant="outline" className="text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Premium Required
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={photoUrl}
        alt="Profile"
        className={`w-full h-full object-cover rounded-lg ${
          shouldBlur ? 'filter blur-sm' : ''
        }`}
      />
      {shouldBlur && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="text-center space-y-2">
            <Eye className="h-6 w-6 mx-auto text-white" />
            <Button size="sm" variant="secondary" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Upgrade to View
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoProtection;