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
  Users,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountHeader } from "@/components/ui/account-header";

const AccountVerification = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [uploadedFiles, setUploadedFiles] = React.useState<{[key: string]: File | null}>({
    idDocument: null,
    selfie: null
  });
  const [verificationStatus, setVerificationStatus] = React.useState<'none' | 'pending' | 'verified' | 'rejected'>('none');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    
    // Check existing verification status from users table
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // For demo purposes, set random status
    if (userData) {
      setVerificationStatus('none'); // Default to none for now
    }
    
    setIsLoading(false);
  };

  const handleFileUpload = (type: 'idDocument' | 'selfie', file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmitVerification = async () => {
    if (!currentUser || !uploadedFiles.idDocument || !uploadedFiles.selfie) return;

    try {
      // In a real implementation, you would upload files to Supabase Storage
      // and store verification request in database
      
      setVerificationStatus('pending');
      
      toast({
        title: "Verification submitted!",
        description: "Your documents have been submitted for review. You'll hear back within 24-48 hours.",
      });
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!currentUser || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          {/* Account Header */}
          <AccountHeader
            title="Verification"
            description="Verify your identity for enhanced trust"
            icon={Shield}
          >
            <Link to="/account">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </AccountHeader>

          {/* Main Content */}
          <div className="container mx-auto px-4 lg:px-8 py-6 space-y-6">
            
            {/* Verification Benefits */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Star,
                  title: "Enhanced Visibility",
                  description: "Verified profiles get priority in search results"
                },
                {
                  icon: Shield,
                  title: "Trust Badge",
                  description: "Display verified badge on your profile"
                },
                {
                  icon: Users,
                  title: "Serious Matches",
                  description: "Connect with other verified, serious members"
                }
              ].map((benefit, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="luxury-card text-center h-full">
                    <CardContent className="p-4 lg:p-6">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 lg:mb-4">
                        <benefit.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm lg:text-base">{benefit.title}</h3>
                      <p className="text-xs lg:text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Verification Form */}
            <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
              <Card className="luxury-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="flex items-center space-x-3 text-lg lg:text-xl">
                    <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    <span>Submit Verification Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  {verificationStatus === 'none' && (
                    <>
                      {/* ID Document Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="id-document" className="text-sm lg:text-base">Government-Issued Photo ID *</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 lg:p-8 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            id="id-document"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload('idDocument', e.target.files[0])}
                          />
                          <label htmlFor="id-document" className="cursor-pointer">
                            <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground mx-auto mb-3 lg:mb-4" />
                            <p className="text-foreground font-medium mb-2 text-sm lg:text-base">
                              {uploadedFiles.idDocument ? uploadedFiles.idDocument.name : 'Upload ID Document'}
                            </p>
                            <p className="text-xs lg:text-sm text-muted-foreground">
                              Accepted: Driver's License, Passport, National ID
                            </p>
                          </label>
                        </div>
                      </div>

                      {/* Selfie Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="selfie" className="text-sm lg:text-base">Verification Selfie *</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 lg:p-8 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            id="selfie"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])}
                          />
                          <label htmlFor="selfie" className="cursor-pointer">
                            <Camera className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground mx-auto mb-3 lg:mb-4" />
                            <p className="text-foreground font-medium mb-2 text-sm lg:text-base">
                              {uploadedFiles.selfie ? uploadedFiles.selfie.name : 'Upload Selfie'}
                            </p>
                            <p className="text-xs lg:text-sm text-muted-foreground">
                              Clear photo of yourself holding your ID document
                            </p>
                          </label>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm lg:text-base">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any additional information to help with verification..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[80px] lg:min-h-[100px] text-sm lg:text-base"
                        />
                      </div>

                      <Button 
                        onClick={handleSubmitVerification}
                        disabled={!uploadedFiles.idDocument || !uploadedFiles.selfie}
                        className="w-full text-sm lg:text-base"
                        variant="luxury"
                        size="lg"
                      >
                        Submit for Verification
                      </Button>
                    </>
                  )}

                  {verificationStatus === 'pending' && (
                    <div className="text-center py-6 lg:py-8">
                      <Clock className="w-12 h-12 lg:w-16 lg:h-16 text-accent mx-auto mb-3 lg:mb-4" />
                      <h3 className="font-heading font-semibold text-foreground mb-2 text-lg lg:text-xl">
                        Verification Pending
                      </h3>
                      <p className="text-muted-foreground mb-4 lg:mb-6 text-sm lg:text-base">
                        Your documents are being reviewed. You'll receive an email within 24-48 hours.
                      </p>
                      <Badge variant="outline" className="text-xs lg:text-sm">
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                        Under Review
                      </Badge>
                    </div>
                  )}

                  {verificationStatus === 'verified' && (
                    <div className="text-center py-6 lg:py-8">
                      <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 text-success mx-auto mb-3 lg:mb-4" />
                      <h3 className="font-heading font-semibold text-foreground mb-2 text-lg lg:text-xl">
                        Verification Complete
                      </h3>
                      <p className="text-muted-foreground mb-4 lg:mb-6 text-sm lg:text-base">
                        Congratulations! Your profile is now verified and will receive enhanced visibility.
                      </p>
                      <Badge className="bg-success text-success-foreground text-xs lg:text-sm">
                        <Shield className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                        Verified
                      </Badge>
                    </div>
                  )}

                  {verificationStatus === 'rejected' && (
                    <div className="text-center py-6 lg:py-8">
                      <AlertCircle className="w-12 h-12 lg:w-16 lg:h-16 text-destructive mx-auto mb-3 lg:mb-4" />
                      <h3 className="font-heading font-semibold text-foreground mb-2 text-lg lg:text-xl">
                        Verification Failed
                      </h3>
                      <p className="text-muted-foreground mb-4 lg:mb-6 text-sm lg:text-base">
                        Your documents couldn't be verified. Please check requirements and try again.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setVerificationStatus('none')}
                        className="text-sm lg:text-base"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AccountVerification;