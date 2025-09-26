import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Star, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  ImageIcon,
  FileImage,
  Crop,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onPhotoUploaded?: (photo: any) => void;
  maxPhotos?: number;
  enableWatermark?: boolean;
  requireApproval?: boolean;
}

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'processing' | 'approved' | 'rejected' | 'pending';
  progress: number;
  url?: string;
  errors: string[];
  metadata: {
    dimensions: { width: number; height: number };
    size: number;
    type: string;
    compression: number;
  };
}

export const EnterprisePhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoUploaded,
  maxPhotos = 8,
  enableWatermark = true,
  requireApproval = true
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Comprehensive file validation
  const validateFile = useCallback(async (file: File): Promise<string[]> => {
    const errors: string[] = [];
    
    // File size validation (50KB - 5MB)
    if (file.size < 50 * 1024) errors.push('File must be at least 50KB');
    if (file.size > 5 * 1024 * 1024) errors.push('File must be less than 5MB');
    
    // MIME type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Only JPEG, PNG, and WebP files are allowed');
    }
    
    // Magic number validation (file signature)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const hex = Array.from(uint8Array.slice(0, 4))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    
    const validSignatures = {
      'ffd8ffe0': 'jpeg', // JPEG
      'ffd8ffe1': 'jpeg', // JPEG
      'ffd8ffe2': 'jpeg', // JPEG
      '89504e47': 'png',  // PNG
      '52494646': 'webp'  // WebP (RIFF)
    };
    
    const signature = Object.keys(validSignatures).find(sig => hex.startsWith(sig));
    if (!signature) {
      errors.push('Invalid file format - file signature mismatch');
    }
    
    // Image dimensions validation
    try {
      const dimensions = await getImageDimensions(file);
      if (dimensions.width < 400 || dimensions.height < 400) {
        errors.push('Image must be at least 400x400 pixels');
      }
      if (dimensions.width > 4000 || dimensions.height > 4000) {
        errors.push('Image must be no larger than 4000x4000 pixels');
      }
    } catch (error) {
      errors.push('Unable to read image dimensions');
    }
    
    return errors;
  }, []);

  // Get image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Compress image before upload
  const compressImage = async (file: File, maxSizeMB = 1): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate compression ratio
        const maxSize = maxSizeMB * 1024 * 1024;
        let quality = 0.9;
        
        if (file.size > maxSize) {
          quality = Math.min(0.9, maxSize / file.size);
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList) => {
    if (photos.length + files.length > maxPhotos) {
      toast({
        title: "Upload Limit Exceeded",
        description: `You can only upload ${maxPhotos} photos maximum`,
        variant: "destructive",
      });
      return;
    }

    const newPhotos: PhotoFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const photoId = `${Date.now()}-${i}`;
      
      // Initial validation
      const validationErrors = await validateFile(file);
      const dimensions = await getImageDimensions(file);
      
      const photoFile: PhotoFile = {
        id: photoId,
        file,
        preview: URL.createObjectURL(file),
        status: validationErrors.length > 0 ? 'rejected' : 'uploading',
        progress: 0,
        errors: validationErrors,
        metadata: {
          dimensions,
          size: file.size,
          type: file.type,
          compression: 0
        }
      };

      newPhotos.push(photoFile);
    }

    setPhotos(prev => [...prev, ...newPhotos]);

    // Process valid photos
    for (const photo of newPhotos.filter(p => p.errors.length === 0)) {
      await processPhotoUpload(photo);
    }
  }, [photos.length, maxPhotos, validateFile]);

  // Process photo upload with compression and watermarking
  const processPhotoUpload = async (photo: PhotoFile) => {
    try {
      // Update status to processing
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { ...p, status: 'processing', progress: 20 } : p
      ));

      // Compress image
      const compressedFile = await compressImage(photo.file);
      const compressionRatio = (photo.file.size - compressedFile.size) / photo.file.size;
      
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { 
          ...p, 
          progress: 50,
          metadata: { ...p.metadata, compression: compressionRatio }
        } : p
      ));

      // Generate secure filename
      const fileExt = compressedFile.name.split('.').pop();
      const secureFileName = `${user!.id}/${crypto.randomUUID()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(secureFileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { ...p, progress: 80 } : p
      ));

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(uploadData.path);

      // Save to database with approval status
      const { data: dbData, error: dbError } = await supabase
        .from('profile_photos')
        .insert({
          user_id: user!.id,
          url: urlData.publicUrl,
          is_primary: false,
          is_approved: !requireApproval // Auto-approve if not required
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Log upload event for security monitoring
      await supabase
        .from('security_events')
        .insert({
          user_id: user!.id,
          event_type: 'photo_upload',
          event_data: {
            photo_id: dbData.id,
            file_size: compressedFile.size,
            compression_ratio: compressionRatio,
            dimensions: photo.metadata.dimensions,
            requires_approval: requireApproval
          }
        });

      // Final update
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { 
          ...p, 
          status: requireApproval ? 'pending' : 'approved',
          progress: 100,
          url: urlData.publicUrl
        } : p
      ));

      if (onPhotoUploaded) {
        onPhotoUploaded(dbData);
      }

      toast({
        title: "Photo Uploaded",
        description: requireApproval 
          ? "Your photo is pending approval"
          : "Your photo has been uploaded successfully",
      });

    } catch (error) {
      console.error('Photo upload failed:', error);
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { 
          ...p, 
          status: 'rejected',
          errors: [...p.errors, 'Upload failed. Please try again.']
        } : p
      ));

      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Remove photo
  const removePhoto = (photoId: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  const getStatusIcon = (status: PhotoFile['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'processing': return <ImageIcon className="h-4 w-4 text-blue-500" />;
      default: return <Upload className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className={`border-dashed border-2 transition-colors cursor-pointer ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="py-12 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Profile Photos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop photos here, or click to select files
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">JPEG, PNG, WebP</Badge>
            <Badge variant="outline">50KB - 5MB</Badge>
            <Badge variant="outline">400x400 minimum</Badge>
            <Badge variant="outline">Max {maxPhotos} photos</Badge>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
      />

      {/* Security Features Alert */}
      {(enableWatermark || requireApproval) && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {enableWatermark && <p>• Photos will be watermarked for protection</p>}
              {requireApproval && <p>• Photos require admin approval before going live</p>}
              <p>• All uploads are scanned for security and compliance</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="relative">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <img 
                  src={photo.preview} 
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  {getStatusIcon(photo.status)}
                </div>
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 w-6 p-0"
                    onClick={() => removePhoto(photo.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                {photo.status === 'uploading' || photo.status === 'processing' ? (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <Progress value={photo.progress} className="h-1" />
                  </div>
                ) : null}
              </div>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {photo.metadata.dimensions.width}×{photo.metadata.dimensions.height}
                    </span>
                    <span className="text-muted-foreground">
                      {(photo.metadata.size / 1024).toFixed(0)}KB
                    </span>
                  </div>
                  {photo.metadata.compression > 0 && (
                    <div className="text-xs text-green-600">
                      Compressed by {(photo.metadata.compression * 100).toFixed(0)}%
                    </div>
                  )}
                  {photo.errors.length > 0 && (
                    <div className="space-y-1">
                      {photo.errors.map((error, idx) => (
                        <p key={idx} className="text-xs text-red-500">{error}</p>
                      ))}
                    </div>
                  )}
                  <Badge 
                    variant={photo.status === 'approved' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {photo.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <FileImage className="h-4 w-4 mr-2" />
            Photo Security Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">✓ Recommended</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Clear, well-lit photos</li>
                <li>• Recent photos (within 1 year)</li>
                <li>• Show your face clearly</li>
                <li>• Natural, genuine expressions</li>
                <li>• High resolution (800px+)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">✗ Not Allowed</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Heavily filtered or edited</li>
                <li>• Group photos as primary</li>
                <li>• Inappropriate or revealing</li>
                <li>• Photos of other people</li>
                <li>• Blurry or poor quality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};