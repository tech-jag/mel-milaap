import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const OnboardingStep2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    // Check if user is already verified
    if (user?.email_confirmed_at) {
      setEmailVerified(true);
    }
  }, [user]);

  useEffect(() => {
    // Poll for email verification every 3 seconds
    if (user && !emailVerified) {
      const interval = setInterval(async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser?.email_confirmed_at) {
          setEmailVerified(true);
          clearInterval(interval);
          toast({
            title: "Email Verified!",
            description: "Great! Your email has been verified. Let's continue.",
          });
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [user, emailVerified, toast]);

  const handleResendEmail = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "No email address found. Please go back and create your account.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding/2`,
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "We've sent you a new verification email. Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Send Email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleContinue = () => {
    if (emailVerified) {
      navigate('/onboarding/3');
    } else {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email before continuing.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout
      currentStep={2}
      title="Verify Your Email"
      subtitle="We've sent a verification link to your email address"
      hideNavigation={true}
    >
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          {emailVerified ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <Mail className="w-8 h-8 text-primary" />
          )}
        </div>

        {emailVerified ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Email Verified Successfully!</span>
              </div>
              <p className="text-green-600 mt-2">
                Your email has been verified. You can now continue with your profile setup.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2 text-orange-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Email Verification Pending</span>
              </div>
              <p className="text-orange-600 mt-2">
                Please check your email ({user?.email}) and click the verification link.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <p className="text-muted-foreground">
            {emailVerified 
              ? "Perfect! Your email is verified and you're ready to continue."
              : "Can't find the email? Check your spam folder or request a new one."
            }
          </p>

          {!emailVerified && (
            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Sending...' : 'Resend Email'}</span>
            </Button>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/onboarding/1')}
            >
              Back to Account
            </Button>
            <Button
              variant="luxury"
              onClick={handleContinue}
              disabled={!emailVerified}
            >
              Continue to Profile Setup
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingStep2;