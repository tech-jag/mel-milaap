import React from 'react';

interface MelMilaapTextProps {
  className?: string;
  melClassName?: string;
  milaapClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const MelMilaapText: React.FC<MelMilaapTextProps> = ({ 
  className = "", 
  melClassName = "",
  milaapClassName = "",
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl", 
    lg: "text-4xl",
    xl: "text-6xl md:text-7xl lg:text-8xl"
  };

  return (
    <span 
      className={`${sizeClasses[size]} ${className}`}
      style={{
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      <span className={melClassName}>M</span>
      <span style={{ position: 'relative' }} className={melClassName}>
        ē
      </span>
      <span className={melClassName}>l </span>
      <span className={milaapClassName || melClassName}>Milaap</span>
    </span>
  );
};

export default MelMilaapText;