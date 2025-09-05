"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Calendar, Sparkles } from "lucide-react";
import { journeyStep, staggerChildren } from "@/lib/motion";

const journeySteps = [
  {
    id: "meet",
    title: "Meet",
    description: "Discover compatible profiles with shared values and cultural background",
    icon: Heart,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "match",
    title: "Match",
    description: "Connect with verified members through safe, meaningful conversations",
    icon: Users,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "marry",
    title: "Marry",
    description: "Plan your perfect wedding with trusted suppliers and expert guidance",
    icon: Calendar,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "celebrate",
    title: "Celebrate",
    description: "Create memories that last a lifetime with our planning tools and vendors",
    icon: Sparkles,
    color: "text-lux-champagne",
    bgColor: "bg-lux-champagne/10",
  },
];

export function JourneySteps() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-luxury-lg text-foreground mb-6"
            variants={journeyStep}
          >
            Your Journey to Forever
          </motion.h2>
          <motion.p 
            className="text-body-lg text-muted-foreground max-w-2xl mx-auto"
            variants={journeyStep}
          >
            From first meeting to wedding celebration, we guide you through every step 
            of your journey with care, tradition, and modern elegance.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {journeySteps.map((step, index) => (
            <motion.div
              key={step.id}
              className="luxury-card group cursor-pointer"
              variants={journeyStep}
              whileHover="hover"
            >
              {/* Step Number */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-muted-foreground">
                  0{index + 1}
                </span>
                <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (except last item) */}
              {index < journeySteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2 z-10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}