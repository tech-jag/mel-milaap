import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

interface ProfilePhoto {
  id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

export const PhotoManager: React.FC = () => {
  const { user } = useAuth();
  const { updateUserProfile } = useOnboardingState();
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const MAX_PHOTOS = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

  useEffect(() => {
    if (user?.id) {
      loadPhotos();
    }
  }, [user?.id]);

  const loadPhotos = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profile_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
      
      // Also update user_profiles.photo_primary_url if we have a primary photo
      const primaryPhoto = (data || []).find(photo => photo.is_primary);
      if (primaryPhoto) {
        await supabase
          .from('user_profiles')
          .update({ photo_primary_url: primaryPhoto.url })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleFileSelect = async (file: File) => {
    const validation = validateFile(file);
    if (validation) {
      toast({
        title: "Upload Error",
        description: validation,
        variant: "destructive",
      });
      return;
    }

    if (photos.length >= MAX_PHOTOS) {
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

      const { data, error } = await supabase
        .from('profile_photos')
        .insert({
          user_id: user.id,
          url: photoUrl,
          is_primary: photos.length === 0
        })
        .select()
        .single();

      if (error) throw error;

      // Set as primary photo if it's the first one
      if (photos.length === 0) {
        await updateUserProfile.mutateAsync({ photo_primary_url: photoUrl });
      }

      await loadPhotos();

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

  const handleSetPrimary = async (photoId: string) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      // Update all photos to not be primary
      await supabase
        .from('profile_photos')
        .update({ is_primary: false })
        .eq('user_id', user?.id);

      // Set selected photo as primary
      await supabase
        .from('profile_photos')
        .update({ is_primary: true })
        .eq('id', photoId);

      // Update user profile
      await updateUserProfile.mutateAsync({ photo_primary_url: photo.url });

      await loadPhotos();

      toast({
        title: "Primary Photo Updated",
        description: "Your profile photo has been updated",
      });
    } catch (error) {
      console.error('Error setting primary photo:', error);
      toast({
        title: "Error",
        description: "Failed to update primary photo",
        variant: "destructive",
      });
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;

      // Delete from storage
      const urlParts = photo.url.split('/');
      const fileName = urlParts.slice(-2).join('/'); // Get userId/filename
      
      await supabase.storage
        .from('profile-photos')
        .remove([fileName]);

      // Delete from database
      await supabase
        .from('profile_photos')
        .delete()
        .eq('id', photoId);

      // If this was the primary photo, set the first remaining photo as primary
      if (photo.is_primary && photos.length > 1) {
        const remainingPhotos = photos.filter(p => p.id !== photoId);
        if (remainingPhotos.length > 0) {
          await handleSetPrimary(remainingPhotos[0].id);
        } else {
          await updateUserProfile.mutateAsync({ photo_primary_url: null });
        }
      }

      await loadPhotos();

      toast({
        title: "Photo Deleted",
        description: "Your photo has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading photos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Profile Photos</h3>
          <p className="text-sm text-muted-foreground">
            Manage your profile photos ({photos.length}/{MAX_PHOTOS})
          </p>
        </div>
        {photos.length < MAX_PHOTOS && (
          <Button onClick={openFileDialog} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Add Photo'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="relative group">
            <div className="aspect-square relative overflow-hidden rounded-t-lg">
              <img 
                src={photo.url} 
                alt="Profile photo"
                className="w-full h-full object-cover"
              />
              {photo.is_primary && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Primary
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-6 w-6 p-0"
                  onClick={() => handleDeletePhoto(photo.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              {!photo.is_primary && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSetPrimary(photo.id)}
                >
                  Set as Primary
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {photos.length === 0 && (
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer" onClick={openFileDialog}>
            <CardHeader className="text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="text-lg">Add Your First Photo</CardTitle>
              <CardDescription>Upload photos to make your profile attractive</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" size="sm" disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg space-y-3">
        <h4 className="font-medium">Photo Guidelines:</h4>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Upload clear, recent photos of yourself</li>
          <li>• Include at least one close-up face photo</li>
          <li>• Photos should be appropriate and family-friendly</li>
          <li>• Maximum file size: 5MB per photo</li>
          <li>• Supported formats: JPEG, PNG, WebP, HEIC</li>
        </ul>
      </div>
    </div>
  );
};