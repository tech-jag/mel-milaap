import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

interface UploadedPhoto {
  id: string;
  url: string;
  file: File;
  isPrimary?: boolean;
}

export default function OnboardingStep22() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateUserProfile } = useOnboardingState();
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [primaryPhotoId, setPrimaryPhotoId] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const MAX_PHOTOS = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, WebP, and HEIC files are allowed';
    }
    return null;
  };

  const uploadPhotoToStorage = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const savePhotoRecord = async (url: string, isPrimary: boolean = false) => {
    try {
      const { error } = await supabase
        .from('profile_photos')
        .insert({
          user_id: user?.id,
          url: url,
          is_primary: isPrimary
        });

      if (error) {
        console.error('Error saving photo record:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error saving photo record:', error);
      return false;
    }
  };

  const handleFileSelect = async (file: File, slotId: string) => {
    const validation = validateFile(file);
    if (validation) {
      toast({
        title: "Upload Error",
        description: validation,
        variant: "destructive",
      });
      return;
    }

    if (uploadedPhotos.length >= MAX_PHOTOS) {
      toast({
        title: "Upload Limit Reached",
        description: `You can upload a maximum of ${MAX_PHOTOS} photos`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const photoUrl = await uploadPhotoToStorage(file, user.id);
      if (!photoUrl) {
        throw new Error('Failed to upload photo');
      }

      const newPhoto: UploadedPhoto = {
        id: slotId,
        url: photoUrl,
        file: file,
        isPrimary: uploadedPhotos.length === 0 || slotId === 'profile'
      };

      setUploadedPhotos(prev => [...prev, newPhoto]);

      // Set as primary photo if it's the first one or profile slot
      if (uploadedPhotos.length === 0 || slotId === 'profile') {
        setPrimaryPhotoId(slotId);
      }

      // Save photo record
      await savePhotoRecord(photoUrl, newPhoto.isPrimary);

      // Update user profile with primary photo URL if this is the primary photo
      if (newPhoto.isPrimary) {
        await updateUserProfile.mutateAsync({ photo_primary_url: photoUrl });
      }

      toast({
        title: "Photo Uploaded",
        description: "Your photo has been uploaded successfully",
      });

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
    if (primaryPhotoId === photoId) {
      setPrimaryPhotoId(null);
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    const photo = uploadedPhotos.find(p => p.id === photoId);
    if (photo) {
      setPrimaryPhotoId(photoId);
      await updateUserProfile.mutateAsync({ photo_primary_url: photo.url });
      toast({
        title: "Primary Photo Updated",
        description: "Your profile photo has been updated",
      });
    }
  };

  const openFileDialog = (slotId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file, slotId);
      }
    };
    input.click();
  };

  const handleContinue = () => {
    navigate('/onboarding/23');
  };

  const photoSlots = [
    { id: 'profile', title: 'Profile Photo', description: 'Your main profile picture' },
    { id: 'additional1', title: 'Additional Photo', description: 'Show more of your personality' },
    { id: 'additional2', title: 'Additional Photo', description: 'Add variety to your gallery' }
  ];

  return (
    <OnboardingLayout
      currentStep={22}
      title="Add Your Photos"
      subtitle="Upload photos to make your profile more attractive to potential matches"
      hideNavigation={true}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {photoSlots.map((slot) => {
            const uploadedPhoto = uploadedPhotos.find(photo => photo.id === slot.id);
            const isPrimary = primaryPhotoId === slot.id;
            
            return (
              <Card 
                key={slot.id} 
                className={`border-dashed border-2 hover:border-primary/50 transition-colors relative ${
                  isPrimary ? 'ring-2 ring-primary' : ''
                }`}
              >
                {uploadedPhoto && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    {!isPrimary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleSetPrimary(slot.id)}
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      onClick={() => handleRemovePhoto(slot.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  {uploadedPhoto ? (
                    <div className="relative">
                      <img 
                        src={uploadedPhoto.url} 
                        alt={slot.title}
                        className="mx-auto h-24 w-24 object-cover rounded-lg"
                      />
                      {isPrimary && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Primary
                        </div>
                      )}
                    </div>
                  ) : (
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                  )}
                  <CardTitle className="text-lg">{slot.title}</CardTitle>
                  <CardDescription>{slot.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isUploading}
                    onClick={() => openFileDialog(slot.id)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadedPhoto ? 'Replace' : 'Upload'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {uploadedPhotos.length < MAX_PHOTOS && (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => openFileDialog(`additional${uploadedPhotos.length + 1}`)}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Add Another Photo ({uploadedPhotos.length}/{MAX_PHOTOS})
            </Button>
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium">Photo Guidelines:</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Upload clear, recent photos of yourself</li>
            <li>• Include at least one close-up face photo</li>
            <li>• Photos should be appropriate and family-friendly</li>
            <li>• Avoid group photos as your main profile picture</li>
            <li>• You can upload up to {MAX_PHOTOS} photos total</li>
            <li>• Maximum file size: 5MB per photo</li>
            <li>• Supported formats: JPEG, PNG, WebP, HEIC</li>
          </ul>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Privacy & Safety Notice:</strong> Your photos will be visible to other verified members. 
            We implement strict content moderation and all photos are reviewed to ensure they meet our community guidelines. 
            You can manage your photos anytime from your account settings. We never share your photos with third parties 
            without your explicit consent. By uploading photos, you confirm you have the right to use these images and 
            consent to our <a href="/privacy" className="underline">Privacy Policy</a> and 
            <a href="/terms" className="underline ml-1">Terms of Service</a>.
          </AlertDescription>
        </Alert>

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