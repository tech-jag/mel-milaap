// src/components/ui/FloralBranding.tsx

import React from 'react';
import { FloralAccent } from './FloralAccent';
import { cn } from "@/lib/utils"; // Assuming you have a class merging utility

interface FloralBrandingProps {
  variant?: 'homepage' | 'account' | 'minimal';
  className?: string;
}

export const FloralBranding: React.FC<FloralBrandingProps> = ({
  variant = 'minimal',
  className = ""
}) => {
  // --> CRITICAL FIX: The wrapper is now `absolute` with `z-0` (or a low z-index from the className).
  // This makes it render on top of the page background, but behind the main content.
  // The `fixed` and `zIndex: -1` from the old version was hiding it.
  const wrapperClasses = cn(
    "absolute inset-0 pointer-events-none",
    className
  );

  if (variant === 'homepage') {
    return (
      <div className={wrapperClasses}>
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

  if (variant === 'account') {
    return (
      <div className={wrapperClasses}>
        <FloralAccent
          variant="mandala-corner"
          position="top-0 right-0 -mr-8 -mt-8"
          size="w-24 h-24"
          opacity={0.08}
        />
        <FloralAccent
          variant="jasmine-spray"
          position="bottom-0 left-0 -ml-4 -mb-12"
          size="w-16 h-32"
          opacity={0.06}
        />
        <FloralAccent
          variant="lotus-corner"
          position="bottom-0 right-0 -mr-12 -mb-12"
          size="w-32 h-32"
          opacity={0.05}
        />
      </div>
    );
  }

  // Minimal variant
  return (
    <div className={wrapperClasses}>
      <FloralAccent
        variant="mandala-corner"
        position="top-0 right-0 -mr-6 -mt-6"
        size="w-16 h-16"
        opacity={0.05}
      />
      <FloralAccent
        variant="lotus-corner"
        position="bottom-0 left-0 -ml-6 -mb-6"
        size="w-20 h-20"
        opacity={0.04}
      />
    </div>
  );
};