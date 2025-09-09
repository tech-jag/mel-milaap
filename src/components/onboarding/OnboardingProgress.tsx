import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ 
  currentStep, 
  totalSteps = 23 
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            Step {currentStep} of {totalSteps}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};