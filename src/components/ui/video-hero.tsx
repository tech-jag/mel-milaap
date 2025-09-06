"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { fadeInUp, heroParallax } from "@/lib/motion";
import heroImage from "@/assets/hero-wedding-couple.jpg";

interface VideoHeroProps {
  title: string;
  subtitle?: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
  videoSrc?: string;
  overlayOpacity?: number;
}

export function VideoHero({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  videoSrc,
  overlayOpacity = 0.4,
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {videoSrc && (
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none"
          variants={heroParallax}
          initial="initial"
          animate="animate"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/60 pointer-events-none"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>
      )}

      {/* Fallback Background */}
      {!videoSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/30 to-primary/70 pointer-events-none" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Main Headline */}
          <h1 className="text-luxury-xl text-white leading-none">
            <span className="block">{title}</span>
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="text-body-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
          >
            <Button
              asChild
              variant="hero"
              size="xl"
              className="text-primary-foreground bg-primary hover:bg-primary/90 border-primary-foreground/20"
            >
              <Link to={primaryCTA.href} aria-label={primaryCTA.text}>
                {primaryCTA.text}
              </Link>
            </Button>

            <Button
              asChild
              variant="glass"
              size="xl"
              className="text-white border-white/30 hover:bg-white/20"
            >
              <Link to={secondaryCTA.href} aria-label={secondaryCTA.text}>
                {secondaryCTA.text}
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 pt-8 text-white/80"
            variants={fadeInUp}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-sm font-medium">10,000+ Verified Profiles</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm font-medium">Private & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm font-medium">Australia &amp; NZ Community</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Controls */}
      {videoSrc && (
        <motion.button
          className="absolute bottom-8 right-8 z-20 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-colors"
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </motion.button>
      )}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-0.5 h-16 bg-white/50 rounded-full relative">
          <motion.div
            className="w-full bg-white rounded-full"
            animate={{ height: ["20%", "80%", "20%"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
