import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingState } from '@/hooks/useOnboardingState';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { userProfile, isLoading: onboardingLoading } = useOnboardingState();
  const location = useLocation();

  // Show loading while checking auth and onboarding state for authenticated users only
  if (user && (authLoading || onboardingLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to auth (only for protected routes that require OnboardingGuard)
  if (!user) {
    return <Navigate to="/auth?tab=login" state={{ from: location }} replace />;
  }

  const isOnboardingRoute = location.pathname.startsWith('/onboarding');
  const isAccountSecurityRoute = location.pathname === '/account/security';
  const isAuthRoute = location.pathname.startsWith('/auth');
  const isLogoutRoute = location.pathname === '/logout';

  // Allow these routes during onboarding
  const allowedDuringOnboarding = isOnboardingRoute || isAccountSecurityRoute || isAuthRoute || isLogoutRoute;

  // Check if profile is ready (onboarding complete)
  const profileReady = userProfile?.profile_ready === true;

  // If onboarding not complete and trying to access restricted routes
  if (!profileReady && !allowedDuringOnboarding) {
    return <Navigate to="/onboarding/1" replace />;
  }

  // If onboarding complete and trying to access onboarding routes
  if (profileReady && isOnboardingRoute) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
};