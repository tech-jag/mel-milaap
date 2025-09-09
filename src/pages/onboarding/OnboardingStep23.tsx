import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Heart, Users, Star } from 'lucide-react';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

export default function OnboardingStep23() {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboardingState();

  const handleCompleteOnboarding = async () => {
    try {
      await completeOnboarding.mutateAsync();
      toast({
        title: "Profile Complete!",
        description: "Welcome to your matrimonial journey. You can now explore matches and connect with potential partners.",
      });
      navigate('/account');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <OnboardingLayout
      currentStep={23}
      title="Congratulations!"
      subtitle="Your profile is now complete and ready to help you find your perfect match"
      hideNavigation
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Profile Setup Complete!</h2>
          <p className="text-muted-foreground">
            You've successfully created your matrimonial profile. Here's what happens next:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <CardTitle>Find Matches</CardTitle>
              <CardDescription>
                Browse through profiles of potential partners based on your preferences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Connect & Chat</CardTitle>
              <CardDescription>
                Send interests and start conversations with people you'd like to know better
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-yellow-500 mb-2" />
              <CardTitle>Premium Features</CardTitle>
              <CardDescription>
                Upgrade to premium for advanced search filters and enhanced visibility
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Profile Verification</CardTitle>
              <CardDescription>
                Get your profile verified to build trust and increase your match success rate
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg text-center">
          <h3 className="font-semibold mb-2">Ready to Begin Your Journey?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your profile is now live and visible to potential matches. Start exploring and 
            connecting with people who share your values and aspirations.
          </p>
          <Button 
            onClick={handleCompleteOnboarding} 
            size="lg" 
            className="w-full md:w-auto"
            disabled={completeOnboarding.isPending}
          >
            {completeOnboarding.isPending ? 'Setting up...' : 'Enter Your Dashboard'}
          </Button>
        </div>

        <div className="text-center pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/onboarding/22')}
          >
            Previous
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}