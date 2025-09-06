"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const values = [
  {
    title: "Community First",
    description: "We're building for our community, by our community"
  },
  {
    title: "Cultural Understanding",
    description: "Deep respect and understanding of South Asian traditions"
  },
  {
    title: "Innovation",
    description: "Using technology to solve real relationship challenges"
  },
  {
    title: "Integrity",
    description: "Building trust through transparency and authenticity"
  }
];

const openPositions = [
  {
    title: "Senior React Developer",
    location: "Sydney, NSW",
    type: "Full-time",
    department: "Engineering",
    description: "Build beautiful, responsive web applications for our matrimony platform"
  },
  {
    title: "Community Manager",
    location: "Melbourne, VIC",
    type: "Full-time", 
    department: "Community",
    description: "Engage with our community and help create meaningful connections"
  },
  {
    title: "Product Designer",
    location: "Remote",
    type: "Contract",
    department: "Design",
    description: "Design intuitive experiences for couples and wedding suppliers"
  }
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-luxury-lg text-foreground mb-6"
              variants={fadeInUp}
            >
              Join Our Team
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              Help us build the future of South Asian matrimony and wedding planning in ANZ
            </motion.p>
            <motion.div
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg">
                View Open Positions
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-md text-foreground mb-6">
              Our Values
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
              >
                <Card className="luxury-card h-full">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-md text-foreground mb-6">
              Open Positions
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Join our growing team and make an impact
            </p>
          </motion.div>

          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {openPositions.map((position) => (
              <motion.div
                key={position.title}
                variants={fadeInUp}
              >
                <Card className="luxury-card">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-xl font-heading font-semibold text-foreground">
                            {position.title}
                          </h3>
                          <Badge variant="secondary">{position.department}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {position.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {position.type}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-luxury-md text-foreground mb-6"
              variants={fadeInUp}
            >
              Don't See the Right Role?
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              We're always looking for talented people to join our team. Send us your resume!
            </motion.p>
            <motion.div
              variants={fadeInUp}
            >
              <Button variant="luxury" size="lg" asChild>
                <a href="mailto:careers@melmilaap.com">
                  Send Resume
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;