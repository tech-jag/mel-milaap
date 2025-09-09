import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  canProceed: boolean;
  showBack: boolean;
  isLastStep?: boolean;
  loading?: boolean;
}

export function OnboardingLayout({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  onSkip,
  canProceed,
  showBack,
  isLastStep,
  loading
}: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
            {onSkip && (
              <Button variant="ghost" size="sm" onClick={onSkip}>
                Skip for now
              </Button>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl shadow-lg border p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="mb-8">
            {children}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              {showBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            
            <Button
              onClick={onNext}
              disabled={!canProceed || loading}
              className="flex items-center gap-2 min-w-[120px]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              ) : (
                <>
                  {isLastStep ? 'Complete' : 'Continue'}
                  {!isLastStep && <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 md:hidden">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {showBack ? (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={loading}
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <div />
          )}
          
          <Button
            onClick={onNext}
            disabled={!canProceed || loading}
            size="sm"
            className="flex-1 ml-4"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
              isLastStep ? 'Complete' : 'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}