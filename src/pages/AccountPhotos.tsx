"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Plus, X, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function AccountPhotos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  React.useEffect(() => {
    if (user) {
      loadPhotos();
    }
  }, [user]);

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_photos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!file || !user) return;

    try {
      setUploading(true);
      
      // Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('profile_photos')
        .insert({
          user_id: user.id,
          url: publicUrl,
          is_primary: photos.length === 0 // First photo becomes primary
        });

      if (dbError) throw dbError;

      await loadPhotos();
      
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        uploadPhoto(file);
      } else {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadPhoto(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('profile_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      await loadPhotos();
      
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive"
      });
    }
  };

  const setPrimaryPhoto = async (photoId: string) => {
    try {
      // First, set all photos to non-primary
      await supabase
        .from('profile_photos')
        .update({ is_primary: false })
        .eq('user_id', user?.id);

      // Then set the selected photo as primary
      const { error } = await supabase
        .from('profile_photos')
        .update({ is_primary: true })
        .eq('id', photoId);

      if (error) throw error;

      await loadPhotos();
      
      toast({
        title: "Success",
        description: "Primary photo updated",
      });
    } catch (error: any) {
      console.error('Error setting primary photo:', error);
      toast({
        title: "Error",
        description: "Failed to update primary photo",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AccountSidebar />
          
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link to="/account">
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">Photo Management</Badge>
                    <h1 className="text-3xl font-bold text-foreground">My Photos</h1>
                    <p className="text-muted-foreground">Manage your profile photos and gallery</p>
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button asChild disabled={uploading}>
                        <span className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload Photos'}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Profile Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Add Photo Card */}
                      <div 
                        className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                          dragActive 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted-foreground/25 hover:bg-muted/50 hover:border-primary/50'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => document.getElementById('photo-upload')?.click()}
                      >
                        <div className="text-center">
                          <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {dragActive ? 'Drop photo here' : 'Add Photo'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Click or drag & drop
                          </p>
                        </div>
                      </div>
                      
                      {/* Existing Photos */}
                      {photos.map((photo) => (
                        <div key={photo.id} className="aspect-square relative group">
                          <img 
                            src={photo.url} 
                            alt="Profile photo"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          
                          {/* Photo Controls */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="flex gap-2">
                              {!photo.is_primary && (
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => setPrimaryPhoto(photo.id)}
                                >
                                  Set Primary
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deletePhoto(photo.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Primary Badge */}
                          {photo.is_primary && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-primary text-primary-foreground">
                                Primary
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {photos.length === 0 && (
                      <div className="text-center py-12">
                        <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No photos uploaded yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Upload your first photo to get started
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}