import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FloralAccentProps {
  svgSrc: string;
  position: string;
  size: string;
  opacity?: number;
  scrollParallax?: boolean;
  hoverEffect?: boolean;
  className?: string;
}

export const FloralAccent: React.FC<FloralAccentProps> = ({
  svgSrc,
  position,
  size,
  opacity = 0.2,
  scrollParallax = false,
  hoverEffect = false,
  className = ""
}) => {
  const { scrollYProgress } = useScroll();
  
  // Parallax transform - moves slower than scroll for depth effect  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const parallaxStyle = scrollParallax ? { y } : {};
  
  // Hover animation variants
  const hoverVariants = hoverEffect ? {
    hover: {
      scale: 1.05,
      filter: 'drop-shadow(0 0 20px hsl(var(--lux-champagne) / 0.3))',
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    }
  } : {};

  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${position} ${size} ${className}`}
      style={{
        opacity,
        zIndex: 0,
        ...parallaxStyle
      }}
      variants={hoverVariants}
      whileHover={hoverEffect ? "hover" : undefined}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity,
        scale: 1,
        transition: {
          duration: 1.2,
          ease: [0.4, 0, 0.2, 1]
        }
      }}
    >
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `url(${svgSrc})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          color: 'hsl(var(--lux-champagne))', // Default color for SVG currentColor
          filter: 'blur(0.5px)', // Subtle blur for elegance
        }}
      />
    </motion.div>
  );
};