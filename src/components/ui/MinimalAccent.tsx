// File to Create: src/components/ui/MinimalAccent.tsx
"use client";
import React from 'react';

export function MinimalAccent({ className }: { className?: string }) {
  // We will use a direct path to an SVG that Lovable previously created.
  // This SVG is known to exist in the project.
  const svgSrc = "/florals/lotus-corner.svg";

  return (
    <div className={className} aria-hidden="true">
      <img
        src={svgSrc}
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
}
