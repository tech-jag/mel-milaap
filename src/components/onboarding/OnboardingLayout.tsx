import React from 'react';
import { OnboardingProgress } from './OnboardingProgress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingLayoutProps {
  currentStep: number;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  hideNavigation?: boolean;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  currentStep,
  children,
  title,
  subtitle,
  onNext,
  onPrevious,
  nextLabel = "Save & Continue",
  previousLabel = "Previous",
  isNextDisabled = false,
  isLoading = false,
  hideNavigation = false,
}) => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (currentStep > 1) {
      navigate(`/onboarding/${currentStep - 1}`);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (currentStep < 23) {
      navigate(`/onboarding/${currentStep + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OnboardingProgress currentStep={currentStep} />
      
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          {children}
        </div>

        {!hideNavigation && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{previousLabel}</span>
            </Button>

            <Button
              variant="luxury"
              onClick={handleNext}
              disabled={isNextDisabled || isLoading}
              className="flex items-center space-x-2"
            >
              <span>{isLoading ? 'Saving...' : nextLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};