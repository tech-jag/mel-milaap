import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOnboardingState } from '@/hooks/useOnboardingState';

const OnboardingStep5 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile, updateUserProfile, updateOnboardingStep } = useOnboardingState();
  
  const [formData, setFormData] = useState({
    height_cm: '',
    body_type: '',
    complexion: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        height_cm: userProfile.height_cm?.toString() || '',
        body_type: userProfile.body_type || '',
        complexion: userProfile.complexion || ''
      });
    }
  }, [userProfile]);

  const validateForm = () => {
    if (!formData.height_cm) {
      toast({
        title: "Height Required",
        description: "Please enter your height.",
        variant: "destructive",
      });
      return false;
    }

    const height = parseInt(formData.height_cm);
    if (height < 120 || height > 220) {
      toast({
        title: "Invalid Height",
        description: "Please enter a valid height between 120-220 cm.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.body_type) {
      toast({
        title: "Body Type Required",
        description: "Please select your body type.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.complexion) {
      toast({
        title: "Complexion Required",
        description: "Please select your complexion.",
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
        height_cm: parseInt(formData.height_cm),
        body_type: formData.body_type as any,
        complexion: formData.complexion as any
      });

      await updateOnboardingStep.mutateAsync(6);
      
      toast({
        title: "Physical Attributes Saved",
        description: "Your physical information has been recorded.",
      });

      navigate('/onboarding/6');
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

  const isFormValid = formData.height_cm && formData.body_type && formData.complexion;

  const generateHeightOptions = () => {
    const options = [];
    for (let cm = 120; cm <= 220; cm++) {
      const feet = Math.floor(cm / 30.48);
      const inches = Math.round((cm % 30.48) / 2.54);
      options.push(
        <SelectItem key={cm} value={cm.toString()}>
          {cm} cm ({feet}'{inches}")
        </SelectItem>
      );
    }
    return options;
  };

  return (
    <OnboardingLayout
      currentStep={5}
      title="Physical Attributes"
      subtitle="Help us provide better matches by sharing your physical characteristics"
      onNext={handleSubmit}
      isNextDisabled={!isFormValid}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="height_cm">Height *</Label>
          <Select value={formData.height_cm} onValueChange={(value) => setFormData({...formData, height_cm: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select your height" />
            </SelectTrigger>
            <SelectContent className="h-48">
              {generateHeightOptions()}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="body_type">Body Type *</Label>
          <Select value={formData.body_type} onValueChange={(value) => setFormData({...formData, body_type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select your body type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slim">Slim</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="athletic">Athletic</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
              <SelectItem value="prefer_not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="complexion">Complexion *</Label>
          <Select value={formData.complexion} onValueChange={(value) => setFormData({...formData, complexion: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select your complexion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very_fair">Very Fair</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="wheatish">Wheatish</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="prefer_not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingStep5;