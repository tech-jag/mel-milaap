import React from 'react';
import { FloralAccent } from './FloralAccent';

interface FloralBrandingProps {
  variant?: 'homepage' | 'account' | 'minimal';
  className?: string;
}

export const FloralBranding: React.FC<FloralBrandingProps> = ({ 
  variant = 'minimal',
  className = ""
}) => {
  
  // Homepage has the most elaborate florals
  if (variant === 'homepage') {
    return (
      <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
        <FloralAccent 
          variant="lotus-corner"
          position="top-0 left-0 -ml-12 -mt-12"
          size="w-72 h-72"
          opacity={0.15}
          scrollParallax={true}
          hoverEffect={true}
        />
        
        <FloralAccent 
          variant="peony-bloom"
          position="bottom-0 right-0 -mr-16 -mb-16"
          size="w-80 h-80"
          opacity={0.18}
          scrollParallax={true}
          hoverEffect={true}
        />
        
        <FloralAccent 
          variant="mandala-corner"
          position="top-1/4 right-1/4"
          size="w-32 h-32"
          opacity={0.12}
          scrollParallax={false}
          hoverEffect={true}
        />
      </div>
    );
  }
  
  // Account pages have subtle corner accents
  if (variant === 'account') {
    return (
      <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
        <FloralAccent 
          variant="mandala-corner"
          position="top-0 right-0 -mr-8 -mt-8"
          size="w-24 h-24"
          opacity={0.08}
          scrollParallax={false}
          hoverEffect={false}
        />
        
        <FloralAccent 
          variant="jasmine-spray"
          position="bottom-0 left-0 -ml-4 -mb-12"
          size="w-16 h-32"
          opacity={0.06}
          scrollParallax={false}
          hoverEffect={false}
        />
        
        <FloralAccent 
          variant="lotus-corner"
          position="bottom-0 right-0 -mr-12 -mb-12"
          size="w-32 h-32"
          opacity={0.05}
          scrollParallax={false}
          hoverEffect={false}
        />
      </div>
    );
  }
  
  // Minimal has just corner touches
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
      <FloralAccent 
        variant="mandala-corner"
        position="top-0 right-0 -mr-6 -mt-6"
        size="w-16 h-16"
        opacity={0.05}
        scrollParallax={false}
        hoverEffect={false}
      />
      
      <FloralAccent 
        variant="lotus-corner"
        position="bottom-0 left-0 -ml-6 -mb-6"
        size="w-20 h-20"
        opacity={0.04}
        scrollParallax={false}
        hoverEffect={false}
      />
    </div>
  );
};