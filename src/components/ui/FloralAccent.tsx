// src/components/ui/FloralAccent.tsx

"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assuming you have a class merging utility

// This object holds the actual SVG components. No changes needed here.
const FloralSVGs = {
  'lotus-corner': ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 200 200" className={className} style={style} fill="none">
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M100 50 Q120 70 100 90 Q80 70 100 50 Z" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M150 100 Q130 120 110 100 Q130 80 150 100 Z" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M100 150 Q80 130 100 110 Q120 130 100 150 Z" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M50 100 Q70 80 90 100 Q70 120 50 100 Z" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M100 70 Q110 80 100 90 Q90 80 100 70 Z" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M130 100 Q120 110 110 100 Q120 90 130 100 Z" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M100 130 Q90 120 100 110 Q110 120 100 130 Z" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M70 100 Q80 90 90 100 Q80 110 70 100 Z" />
      <circle stroke="currentColor" fill="currentColor" opacity="0.3" cx="100" cy="100" r="8" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M40 40 Q50 30 60 40 Q50 50 40 40" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M160 40 Q150 30 140 40 Q150 50 160 40" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" opacity="0.6" d="M40 160 Q50 170 60 160 Q50 150 40 160" />
    </svg>
  ),
  'rose-border': ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 300 100" className={className} style={style} fill="none">
      <g transform="translate(50, 50)"><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M0 0 Q-10 -5 -15 0 Q-10 5 0 0 Q10 -5 15 0 Q10 5 0 0" /><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M0 0 Q-8 -8 0 -15 Q8 -8 0 0 Q-8 8 0 15 Q8 8 0 0" /><circle fill="currentColor" opacity="0.2" cx="0" cy="0" r="3" /></g><g transform="translate(150, 30)"><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M0 0 Q-12 -6 -18 0 Q-12 6 0 0 Q12 -6 18 0 Q12 6 0 0" /><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M0 0 Q-10 -10 0 -18 Q10 -10 0 0 Q-10 10 0 18 Q10 10 0 0" /><circle fill="currentColor" opacity="0.2" cx="0" cy="0" r="4" /></g><g transform="translate(250, 60)"><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M0 0 Q-8 -4 -12 0 Q-8 4 0 0 Q8 -4 12 0 Q8 4 0 0" /><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M0 0 Q-6 -6 0 -12 Q6 -6 0 0 Q-6 6 0 12 Q6 6 0 0" /><circle fill="currentColor" opacity="0.2" cx="0" cy="0" r="2" /></g><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M65 50 Q100 40 135 30" /><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M165 30 Q200 45 235 60" /><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M80 45 Q85 40 90 45 Q85 50 80 45" /><path stroke="currentColor" fill="none" strokeWidth="1.2" opacity="0.5" d="M200 50 Q205 45 210 50 Q205 55 200 50" /></svg>
  ),
  'jasmine-spray': ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 150 300" className={className} style={style} fill="none"><path stroke="currentColor" fill="none" strokeWidth="1" opacity="0.4" d="M75 10 Q70 50 80 100 Q75 150 70 200 Q75 250 75 290" /><g transform="translate(60, 40)"><path stroke="currentColor" fill="none" strokeWidth="1" opacity="0.4" d="M0 0 L5 -8 L10 -3 L8 5 L0 8 L-8 5 L-10 -3 L-5 -8 Z" /><circle fill="currentColor" opacity="0.15" cx="0" cy="0" r="2" /></g><g transform="translate(90, 70)"><path stroke="currentColor" fill="none" strokeWidth="1" opacity="0.4" d="M0 0 L4 -6 L8 -2 L6 4 L0 6 L-6 4 L-8 -2 L-4 -6 Z" /><circle fill="currentColor" opacity="0.15" cx="0" cy="0" r="1.5" /></g><g transform="translate(50, 120)"><path stroke="currentColor" fill="none" strokeWidth="1" opacity="0.4" d="M0 0 L6 -9 L12 -4 L10 6 L0 9 L-10 6 L-12 -4 L-6 -9 Z" /><circle fill="currentColor" opacity="0.15" cx="0" cy="0" r="2.5" /></g><circle fill="currentColor" opacity="0.15" cx="85" cy="50" r="1" /><circle fill="currentColor" opacity="0.15" cx="55" cy="90" r="1" /></svg>
  ),
  'peony-bloom': ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 180 180" className={className} style={style} fill="none"><path stroke="currentColor" fill="currentColor" strokeWidth="0.8" opacity="0.25" d="M90 20 Q70 40 60 70 Q80 60 90 40 Q100 60 120 70 Q110 40 90 20 Z" /><path stroke="currentColor" fill="currentColor" strokeWidth="0.8" opacity="0.25" d="M160 90 Q140 70 110 60 Q120 80 140 90 Q120 100 110 120 Q140 110 160 90 Z" /><path stroke="currentColor" fill="currentColor" strokeWidth="0.8" opacity="0.25" d="M90 160 Q110 140 120 110 Q100 120 90 140 Q80 120 60 110 Q70 140 90 160 Z" /><path stroke="currentColor" fill="currentColor" strokeWidth="0.8" opacity="0.25" d="M20 90 Q40 110 70 120 Q60 100 40 90 Q60 80 70 60 Q40 70 20 90 Z" /><circle stroke="currentColor" fill="currentColor" opacity="0.25" cx="90" cy="90" r="8" /></svg>
  ),
  'mandala-corner': ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 160 160" className={className} style={style} fill="none"><path stroke="currentColor" fill="none" strokeWidth="0.8" opacity="0.3" d="M10 10 Q30 5 50 10 Q45 30 50 50 Q30 45 10 50 Q15 30 10 10 Z" /><circle stroke="currentColor" fill="none" strokeWidth="0.8" opacity="0.3" cx="30" cy="30" r="15" /><circle stroke="currentColor" fill="none" strokeWidth="0.8" opacity="0.3" cx="30" cy="30" r="10" /><circle stroke="currentColor" fill="none" strokeWidth="0.8" opacity="0.3" cx="30" cy="30" r="5" /><path fill="currentColor" opacity="0.1" d="M30 15 Q35 20 30 25 Q25 20 30 15 Z" /><path fill="currentColor" opacity="0.1" d="M45 30 Q40 35 35 30 Q40 25 45 30 Z" /><circle fill="currentColor" opacity="0.1" cx="10" cy="10" r="2" /></svg>
  )
};

interface FloralAccentProps {
  variant: keyof typeof FloralSVGs;
  position: string;
  size: string;
  opacity?: number;
  scrollParallax?: boolean;
  hoverEffect?: boolean;
  className?: string;
  color?: string;
}

export const FloralAccent: React.FC<FloralAccentProps> = ({
  variant,
  position,
  size,
  opacity = 0.2,
  scrollParallax = false,
  hoverEffect = false,
  className = "",
  color = "hsl(var(--lux-champagne))"
}) => {
  const ref = useRef(null);
  
  // --> IMPROVEMENT 1: Target the parallax effect to this specific element, not the whole window.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, scrollParallax ? -100 : 0]);
  
  const hoverVariants = {
    hover: {
      scale: hoverEffect ? 1.05 : 1,
      filter: hoverEffect ? 'drop-shadow(0 0 12px hsl(var(--lux-champagne) / 0.5))' : 'none',
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
  };

  const SVGComponent = FloralSVGs[variant];

  return (
    <motion.div
      ref={ref}
      // --> FIX: Let the className passed from the page (e.g., z-10) control the layering.
      className={cn(
        "absolute pointer-events-none select-none",
        position,
        size,
        className
      )}
      style={{
        opacity,
        y, // --> Apply the targeted parallax effect here.
        color, // --> Apply color here so the SVG can inherit it.
      }}
      variants={hoverVariants}
      whileHover="hover"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity,
        scale: 1,
        transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
      }}
    >
      <SVGComponent
        className="w-full h-full"
        style={{ filter: 'blur(0.5px)' }}
      />
    </motion.div>
  );
};