// src/pages/Index.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FloralBranding } from "@/components/ui/FloralBranding";
import {
  Heart, Shield, Users, Sparkles, CheckCircle, Crown, Gift, Calendar, Zap
} from "lucide-react";
import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";
import { SEO } from "@/utils/seo";
import { EarlyAccessForm } from "@/components/EarlyAccessForm";
import heroImage from "@/assets/hero-coming-soon.jpg";

const founderBenefits = [
  { icon: Crown, title: "3 Months Premium Free", description: "Full access to all premium features at launch" },
  { icon: Gift, title: "Exclusive Features", description: "First access to new features and updates" },
  { icon: Calendar, title: "Priority Support", description: "Direct line to our support team" },
  { icon: Zap, title: "Early Access", description: "Be the first to use the platform before public launch" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO
        title="Mēl Milaap - Coming Soon | Join Our Founders Circle"
        description="Be the first to experience Australia & New Zealand's most exclusive South Asian matrimony platform."
      />

      <FloralBranding variant="homepage" className="z-0" />

      <main className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        <section className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="Luxury South Asian wedding couple" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-lux-onyx/80 via-lux-onyx/60 to-transparent" />
          </div>
          <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
            {/* All hero content remains here */}
          </div>
        </section>
        {/* All other sections (<section id="benefits">, etc.) go here inside the <main> tag */}
        <Footer />
      </main>
    </div>
  );
};

export default Index;