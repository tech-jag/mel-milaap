"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Camera,
  Star,
  Users
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

const verificationSteps = [
  {
    step: 1,
    title: "Upload ID Document",
    description: "Government-issued photo ID (License, Passport, or National ID)",
    icon: FileText,
    status: "required"
  },
  {
    step: 2,
    title: "Selfie Verification",
    description: "Take a clear selfie to match with your ID document",
    icon: Camera,
    status: "required"
  },
  {
    step: 3,
    title: "Admin Review",
    description: "Our team reviews your submission within 24-48 hours",
    icon: Users,
    status: "pending"
  },
  {
    step: 4,
    title: "Verified Badge",
    description: "Get your verified badge and enhanced profile visibility",
    icon: Star,
    status: "complete"
  }
];

const verificationBenefits = [
  "Enhanced profile visibility in search results",
  "Verified badge displayed on your profile",
  "Access to verified-only search filters",
  "Increased trust from potential matches",
  "Priority customer support",
  "Higher response rates to messages"
];

const Verification = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState<{[key: string]: File | null}>({
    idDocument: null,
    selfie: null
  });
  const [verificationStatus, setVerificationStatus] = React.useState<'none' | 'pending' | 'verified' | 'rejected'>('none');

  const handleFileUpload = (type: 'idDocument' | 'selfie', file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmitVerification = () => {
    if (uploadedFiles.idDocument && uploadedFiles.selfie) {
      setVerificationStatus('pending');
      // Here you would typically upload files to Supabase Storage
      // and create a verification request in the database
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Identity Verification
              </Badge>
              <h1 className="text-luxury-xl text-foreground mb-6">
                Verify Your Identity
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get verified to build trust, increase visibility, and connect with serious members 
                looking for meaningful relationships.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Verification Benefits */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-md text-foreground mb-4">
              Why Get Verified?
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {verificationBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-4 bg-card rounded-lg"
                variants={fadeInUp}
              >
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-foreground text-sm">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-luxury-lg text-foreground mb-6">
              Verification Process
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Simple 4-step process to get your profile verified
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {verificationSteps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="luxury-card h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-2xl font-heading font-bold text-primary mb-2">
                      Step {step.step}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <Badge 
                      variant={step.status === 'complete' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {step.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Verification Form */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <span>Submit Verification Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {verificationStatus === 'none' && (
                    <>
                      {/* ID Document Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="id-document">Government-Issued Photo ID *</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            id="id-document"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload('idDocument', e.target.files[0])}
                          />
                          <label htmlFor="id-document" className="cursor-pointer">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                            <p className="text-foreground font-medium mb-2">
                              {uploadedFiles.idDocument ? uploadedFiles.idDocument.name : 'Upload ID Document'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Accepted: Driver's License, Passport, National ID
                            </p>
                          </label>
                        </div>
                      </div>

                      {/* Selfie Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="selfie">Verification Selfie *</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            id="selfie"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])}
                          />
                          <label htmlFor="selfie" className="cursor-pointer">
                            <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                            <p className="text-foreground font-medium mb-2">
                              {uploadedFiles.selfie ? uploadedFiles.selfie.name : 'Upload Selfie'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Clear photo of yourself holding your ID document
                            </p>
                          </label>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any additional information to help with verification..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <Button 
                        onClick={handleSubmitVerification}
                        disabled={!uploadedFiles.idDocument || !uploadedFiles.selfie}
                        className="w-full"
                        variant="luxury"
                        size="lg"
                      >
                        Submit for Verification
                      </Button>
                    </>
                  )}

                  {verificationStatus === 'pending' && (
                    <div className="text-center py-8">
                      <Clock className="w-16 h-16 text-accent mx-auto mb-4" />
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        Verification Pending
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Your documents are being reviewed. You'll receive an email within 24-48 hours.
                      </p>
                      <Badge variant="outline">
                        <Clock className="w-4 h-4 mr-2" />
                        Under Review
                      </Badge>
                    </div>
                  )}

                  {verificationStatus === 'verified' && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        Verification Complete
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Congratulations! Your profile is now verified and will receive enhanced visibility.
                      </p>
                      <Badge className="bg-success text-success-foreground">
                        <Shield className="w-4 h-4 mr-2" />
                        Verified
                      </Badge>
                    </div>
                  )}

                  {verificationStatus === 'rejected' && (
                    <div className="text-center py-8">
                      <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        Verification Failed
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Your documents couldn't be verified. Please check requirements and try again.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setVerificationStatus('none')}
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Verification;