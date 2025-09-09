import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingLayout } from './onboarding/OnboardingLayout';
import { Step0Welcome } from './onboarding/steps/Step0Welcome';
import { Step1Identity } from './onboarding/steps/Step1Identity';
import { toast } from '@/hooks/use-toast';

const TOTAL_STEPS = 23;

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    currentStep,
    data,
    loading,
    updateData,
    saveProgress,
    completeOnboarding,
    setCurrentStep
  } = useOnboarding();

  // Check if user is authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?returnTo=/onboarding" replace />;
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return {
          title: "Welcome to Mēl Milaap",
          subtitle: "Let's create your profile together",
          component: <Step0Welcome data={data} onUpdate={updateData} />,
          canProceed: !!data.profile_manager
        };
      case 1:
        return {
          title: "Tell us about yourself",
          subtitle: "Basic information to get started",
          component: <Step1Identity data={data} onUpdate={updateData} />,
          canProceed: !!(data.first_name && data.last_name && data.gender && data.dob)
        };
      default:
        // Placeholder for remaining steps
        return {
          title: `Step ${currentStep + 1}`,
          subtitle: "Coming soon...",
          component: (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                This step is under construction. For now, you can proceed to the next step.
              </p>
            </div>
          ),
          canProceed: true
        };
    }
  };

  const stepContent = getStepContent();

  const handleNext = async () => {
    if (currentStep === TOTAL_STEPS - 1) {
      // Complete onboarding
      const success = await completeOnboarding();
      if (success) {
        navigate('/dashboard');
      }
    } else {
      // Save progress and move to next step
      await saveProgress(currentStep + 1, data);
    }
  };

  const handleBack = async () => {
    if (currentStep > 0) {
      await saveProgress(currentStep - 1, data);
    }
  };

  const handleSkip = async () => {
    // For steps that can be skipped
    await saveProgress(currentStep + 1, data);
  };

  return (
    <OnboardingLayout
      currentStep={currentStep + 1}
      totalSteps={TOTAL_STEPS}
      title={stepContent.title}
      subtitle={stepContent.subtitle}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={currentStep >= 2 && currentStep !== TOTAL_STEPS - 1 ? handleSkip : undefined}
      canProceed={stepContent.canProceed}
      showBack={currentStep > 0}
      isLastStep={currentStep === TOTAL_STEPS - 1}
      loading={loading}
    >
      {stepContent.component}
    </OnboardingLayout>
  );
}