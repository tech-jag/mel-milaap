import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';

export default function OnboardingStep22() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/onboarding/23');
  };

  return (
    <OnboardingLayout
      currentStep={22}
      title="Add Your Photos"
      subtitle="Upload photos to make your profile more attractive to potential matches"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="text-lg">Profile Photo</CardTitle>
              <CardDescription>Your main profile picture</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" size="sm" disabled>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="text-lg">Additional Photo</CardTitle>
              <CardDescription>Show more of your personality</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" size="sm" disabled>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="text-lg">Additional Photo</CardTitle>
              <CardDescription>Add variety to your gallery</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" size="sm" disabled>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium">Photo Guidelines:</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Upload clear, recent photos of yourself</li>
            <li>• Include at least one close-up face photo</li>
            <li>• Photos should be appropriate and family-friendly</li>
            <li>• Avoid group photos as your main profile picture</li>
            <li>• You can upload up to 5 photos total</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Photo upload functionality will be enabled after completing your profile setup. 
            You can add photos later from your account settings.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/onboarding/21')}>
            Previous
          </Button>
          <Button onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}