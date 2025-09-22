"use client";

import React from 'react';
import { FloralAccent } from './FloralAccent';
import { cn } from "@/lib/utils";

interface FloralBrandingProps {
  variant?: 'homepage' | 'account' | 'minimal';
  className?: string;
}

export const FloralBranding: React.FC<FloralBrandingProps> = ({ 
  variant = 'minimal',
  className = ""
}) => {
  const wrapperClasses = cn("absolute inset-0 pointer-events-none", className);

  if (variant === 'homepage') {
    return (
      <div className={wrapperClasses}>
        <FloralAccent 
          variant="lotus-corner" 
          position="top-0 left-0 ml-8 mt-8" 
          size="w-72 h-72" 
          opacity={0.3} 
          scrollParallax={true} 
        />
        <FloralAccent 
          variant="peony-bloom" 
          position="bottom-0 right-0 mr-8 mb-8" 
          size="w-80 h-80" 
          opacity={0.35} 
          scrollParallax={true} 
        />
      </div>
    );
  }

  if (variant === 'account') {
    return (
      <div className={wrapperClasses}>
        <FloralAccent 
          variant="mandala-corner" 
          position="top-0 right-0 mr-4 mt-4" 
          size="w-24 h-24" 
          opacity={0.2} 
        />
        <FloralAccent 
          variant="jasmine-spray" 
          position="bottom-0 left-0 ml-4 mb-4" 
          size="w-16 h-32" 
          opacity={0.15} 
        />
      </div>
    );
  }
  
  // Minimal variant for other pages
  return (
    <div className={wrapperClasses}>
      <FloralAccent 
        variant="mandala-corner" 
        position="top-0 right-0 mr-4 mt-4" 
        size="w-16 h-16" 
        opacity={0.12} 
      />
    </div>
  );
};