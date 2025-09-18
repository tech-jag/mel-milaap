import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const OnboardingStep2 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContinue = () => {
    navigate('/onboarding/3');
  };

  const handleSkip = () => {
    navigate('/onboarding/3');
  };

  return (
    <OnboardingLayout
      currentStep={2}
      title="Email Verification (Optional)"
      subtitle="You can verify your email now or skip and do it later"
      hideNavigation={true}
    >
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Email Verification Available</span>
            </div>
            <p className="text-blue-600 mt-2">
              We can send a verification email to {user?.email}, but you can also complete your profile first and verify later.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Most successful matches happen when profiles are complete. Let's focus on building your amazing profile first!
          </p>

          <div className="flex flex-col space-y-3">
            <Button
              variant="luxury"
              onClick={handleContinue}
              className="flex items-center justify-center space-x-2"
            >
              <span>Continue Building My Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSkip}
              className="text-sm"
            >
              I'll verify my email later
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            💡 You can verify your email anytime from your account settings
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingStep2;