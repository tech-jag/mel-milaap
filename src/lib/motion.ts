import { Variants } from "framer-motion";

// Luxury motion presets for the matrimony platform
export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 60,
    filter: "blur(6px)"
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const fadeInScale: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9,
    filter: "blur(4px)"
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

export const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export const staggerChildrenFast: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const slideInLeft: Variants = {
  initial: { 
    opacity: 0, 
    x: -100,
    filter: "blur(4px)"
  },
  animate: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const slideInRight: Variants = {
  initial: { 
    opacity: 0, 
    x: 100,
    filter: "blur(4px)"
  },
  animate: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const magneticHover = {
  scale: 1.02,
  y: -2,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20
  }
};

export const luxurySpring = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 0.8
};

export const subtleParallax = (offset: number = 50) => ({
  y: [`${offset}px`, `${-offset}px`],
  transition: {
    y: {
      duration: 20,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "linear"
    }
  }
});

// Hero parallax for video background
export const heroParallax: Variants = {
  initial: { scale: 1.1, y: 0 },
  animate: { 
    scale: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Card hover animations
export const cardHover: Variants = {
  hover: {
    y: -8,
    boxShadow: "var(--shadow-luxury)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Journey step animations
export const journeyStep: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.8,
    rotateY: -15
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1]
    }
  },
  hover: {
    scale: 1.05,
    rotateY: 5,
    boxShadow: "var(--shadow-champagne)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Reduce motion variant for accessibility
export const reduceMotion: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};