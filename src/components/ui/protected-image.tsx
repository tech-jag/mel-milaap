"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, Lock } from "lucide-react";
import { 
  getProtectedImageUrl, 
  createImageBlurFilter, 
  getWatermarkStyle,
  ImageAccessOptions 
} from "@/lib/image-protection";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  profileId: string;
  fallbackSrc?: string;
  showUnlockHint?: boolean;
  onAccessDenied?: () => void;
}

export function ProtectedImage({
  src,
  profileId,
  fallbackSrc,
  showUnlockHint = true,
  onAccessDenied,
  className,
  ...props
}: ProtectedImageProps) {
  const [imageUrl, setImageUrl] = React.useState<string>(src);
  const [shouldBlur, setShouldBlur] = React.useState(false);
  const [canAccess, setCanAccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isPremium, setIsPremium] = React.useState(false);

  React.useEffect(() => {
    checkImageAccess();
  }, [src, profileId]);

  React.useEffect(() => {
    // Check user auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        // Check if user has premium subscription
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('subject_id', user.id)
          .eq('subject_type', 'user')
          .eq('status', 'active')
          .maybeSingle();
          
        setIsPremium(subscription?.plan === 'premium' || subscription?.plan === 'premium_plus');
      }
    };

    checkAuth();
  }, []);

  const checkImageAccess = async () => {
    setIsLoading(true);
    
    const options: ImageAccessOptions = {
      profileId,
      viewerId: currentUser?.id,
      isPremium,
    };

    const result = await getProtectedImageUrl(src, options);
    
    setImageUrl(result.url);
    setShouldBlur(result.shouldBlur);
    setCanAccess(result.canAccess);
    
    if (!result.canAccess && onAccessDenied) {
      onAccessDenied();
    }
    
    setIsLoading(false);
  };

  const handleImageError = () => {
    if (fallbackSrc) {
      setImageUrl(fallbackSrc);
    }
  };

  const imageStyle = {
    filter: shouldBlur ? createImageBlurFilter() : 'none',
    transition: 'filter 0.3s ease',
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading ? (
        <div className="w-full h-full bg-muted animate-pulse" />
      ) : (
        <>
          <img
            {...props}
            src={imageUrl}
            alt={props.alt || "Profile photo"}
            style={imageStyle}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          
          {shouldBlur && showUnlockHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={getWatermarkStyle()}
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>
                  {!currentUser ? "Login to unlock" : "Connect to view photos"}
                </span>
              </div>
            </motion.div>
          )}
          
          {shouldBlur && showUnlockHint && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-black/50 backdrop-blur-sm rounded-md p-2 text-white text-xs text-center">
                {!currentUser ? (
                  "Sign up to see clear photos"
                ) : isPremium ? (
                  "Premium member - all photos unlocked!"
                ) : (
                  <>
                    <Heart className="w-3 h-3 inline mr-1" />
                    Photos unlock after mutual connection
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Watermark overlay */}
          {shouldBlur && (
            <div className="absolute top-2 right-2 opacity-30">
              <div className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">
                Shaadi & Co
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProtectedImage;