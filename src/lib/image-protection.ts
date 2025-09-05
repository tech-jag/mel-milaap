import { supabase } from "@/integrations/supabase/client";

export interface ImageAccessOptions {
  profileId: string;
  viewerId?: string;
  isPremium?: boolean;
}

export async function getProtectedImageUrl(
  imagePath: string,
  options: ImageAccessOptions
): Promise<{ url: string; shouldBlur: boolean; canAccess: boolean }> {
  const { profileId, viewerId, isPremium = false } = options;
  
  try {
    // If no viewer (logged out), always blur
    if (!viewerId) {
      return {
        url: imagePath,
        shouldBlur: true,
        canAccess: false
      };
    }

    // If viewing own profile, no blur
    if (viewerId === profileId) {
      const { data } = await supabase.storage
        .from('profile-photos')
        .createSignedUrl(`${profileId}/${imagePath}`, 3600);
      
      return {
        url: data?.signedUrl || imagePath,
        shouldBlur: false,
        canAccess: true
      };
    }

    // If premium user, no blur
    if (isPremium) {
      const { data } = await supabase.storage
        .from('profile-photos')
        .createSignedUrl(`${profileId}/${imagePath}`, 3600);
      
      return {
        url: data?.signedUrl || imagePath,
        shouldBlur: false,
        canAccess: true
      };
    }

    // Check for mutual connection
    const { data: mutualConnection } = await supabase
      .from('interests')
      .select('id')
      .or(`
        and(from_user_id.eq.${viewerId},to_user_id.eq.${profileId},status.eq.accepted),
        and(from_user_id.eq.${profileId},to_user_id.eq.${viewerId},status.eq.accepted)
      `);

    const isConnected = mutualConnection && mutualConnection.length >= 2;

    if (isConnected) {
      const { data } = await supabase.storage
        .from('profile-photos')
        .createSignedUrl(`${profileId}/${imagePath}`, 3600);
      
      return {
        url: data?.signedUrl || imagePath,
        shouldBlur: false,
        canAccess: true
      };
    }

    // Default: blur the image
    return {
      url: imagePath,
      shouldBlur: true,
      canAccess: false
    };
    
  } catch (error) {
    console.error('Error in getProtectedImageUrl:', error);
    return {
      url: imagePath,
      shouldBlur: true,
      canAccess: false
    };
  }
}

export function createImageBlurFilter() {
  return "blur(10px) brightness(0.7)";
}

export function getWatermarkStyle() {
  return {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    textAlign: 'center' as const,
    maxWidth: '80%',
    zIndex: 10,
  };
}