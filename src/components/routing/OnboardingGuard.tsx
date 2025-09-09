import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function OnboardingGuard({ children }: { children: React.ReactElement }) {
  const { user, loading: authLoading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!user || authLoading) return;

    const checkOnboardingStatus = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        setOnboardingCompleted(profile?.onboarding_completed || false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setOnboardingCompleted(false);
      }
    };

    checkOnboardingStatus();
  }, [user, authLoading]);

  // Loading states
  if (authLoading || onboardingCompleted === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return children; // Let PrivateRoute handle auth redirect
  }

  // Check if current route should be protected
  const protectedPaths = [
    '/account',
    '/my/planning',
    '/dashboard',
    '/find',
    '/messages',
    '/match'
  ];

  const isProtectedPath = protectedPaths.some(path => 
    location.pathname.startsWith(path)
  );

  // If onboarding not completed and trying to access protected route
  if (!onboardingCompleted && isProtectedPath) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}