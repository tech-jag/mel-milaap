import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useOnboardingState } from '@/hooks/useOnboardingState';

const OnboardingStep3 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile, updateUserProfile, updateOnboardingStep } = useOnboardingState();
  
  const [formData, setFormData] = useState({
    full_name: '',
    gender: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        gender: userProfile.gender || ''
      });
    }
  }, [userProfile]);

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }

    const nameParts = formData.full_name.trim().split(' ');
    if (nameParts.length < 2) {
      toast({
        title: "Full Name Required",
        description: "Please enter your first and last name.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.gender) {
      toast({
        title: "Gender Required",
        description: "Please select your gender.",
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
        full_name: formData.full_name.trim(),
        gender: formData.gender as any
      });

      await updateOnboardingStep.mutateAsync(4);
      
      toast({
        title: "Profile Updated",
        description: "Your identity information has been saved.",
      });

      navigate('/onboarding/4');
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

  const isFormValid = formData.full_name.trim().split(' ').length >= 2 && formData.gender;

  return (
    <OnboardingLayout
      currentStep={3}
      title="Tell Us About Yourself"
      subtitle="Let's start with your basic identity information"
      onNext={handleSubmit}
      isNextDisabled={!isFormValid}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            type="text"
            placeholder="Enter your first and last name"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            required
          />
          <p className="text-xs text-muted-foreground">
            Please use your legal name as it appears on official documents
          </p>
        </div>

        <div className="space-y-3">
          <Label>Gender *</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => setFormData({...formData, gender: value})}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non_binary" id="non_binary" />
              <Label htmlFor="non_binary">Non-binary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prefer_not" id="prefer_not" />
              <Label htmlFor="prefer_not">Prefer not to say</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingStep3;