import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOnboardingState } from '@/hooks/useOnboardingState';

const OnboardingStep4 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile, updateUserProfile, updateOnboardingStep } = useOnboardingState();
  
  const [formData, setFormData] = useState({
    birth_date: '',
    birth_time: '',
    birth_city: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        birth_date: userProfile.birth_date || '',
        birth_time: userProfile.birth_time || '',
        birth_city: userProfile.birth_city || ''
      });
    }
  }, [userProfile]);

  const validateForm = () => {
    if (!formData.birth_date) {
      toast({
        title: "Birth Date Required",
        description: "Please enter your date of birth.",
        variant: "destructive",
      });
      return false;
    }

    // Check age (must be 18+)
    const birthDate = new Date(formData.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      toast({
        title: "Age Requirement",
        description: "You must be at least 18 years old to create a profile.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateUserProfile.mutateAsync({
        birth_date: formData.birth_date,
        birth_time: formData.birth_time || null,
        birth_city: formData.birth_city || null
      });

      await updateOnboardingStep.mutateAsync(5);
      
      toast({
        title: "Birth Details Saved",
        description: "Your birth information has been recorded.",
      });

      navigate('/onboarding/5');
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.birth_date;

  return (
    <OnboardingLayout
      currentStep={4}
      title="Birth Details"
      subtitle="Help us understand your background and astrological preferences"
      onNext={handleSubmit}
      isNextDisabled={!isFormValid}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="birth_date">Date of Birth *</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
            required
          />
          <p className="text-xs text-muted-foreground">
            You must be at least 18 years old
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_time">Time of Birth (Optional)</Label>
          <Input
            id="birth_time"
            type="time"
            value={formData.birth_time}
            onChange={(e) => setFormData({...formData, birth_time: e.target.value})}
          />
          <p className="text-xs text-muted-foreground">
            For astrological compatibility calculations
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_city">Place of Birth (Optional)</Label>
          <Input
            id="birth_city"
            type="text"
            placeholder="City, Country"
            value={formData.birth_city}
            onChange={(e) => setFormData({...formData, birth_city: e.target.value})}
          />
          <p className="text-xs text-muted-foreground">
            For astrological chart calculations
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingStep4;