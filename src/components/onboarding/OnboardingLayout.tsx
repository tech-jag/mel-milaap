import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingProgress } from './OnboardingProgress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeInUp, staggerChildren } from '@/lib/motion';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <OnboardingProgress currentStep={currentStep} />
      
      <motion.div 
        className="container mx-auto max-w-2xl px-4 py-8"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <motion.div className="text-center mb-8" variants={fadeInUp}>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div 
          className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl p-8 mb-8 shadow-luxury"
          variants={fadeInUp}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {children}
        </motion.div>

        {!hideNavigation && (
          <motion.div 
            className="flex justify-between items-center"
            variants={fadeInUp}
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{previousLabel}</span>
            </Button>

            <Button
              variant="luxury"
              onClick={handleNext}
              disabled={isNextDisabled || isLoading}
              className="flex items-center space-x-2 group"
            >
              <span>{isLoading ? 'Saving...' : nextLabel}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};