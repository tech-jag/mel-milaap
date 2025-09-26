import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Scale, 
  Globe,
  Heart,
  Camera,
  MessageSquare,
  Lock,
  Gavel,
  Eye
} from 'lucide-react';
import { fadeInUp, staggerChildren } from '@/lib/motion';

export const ComprehensiveTermsOfService: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Comprehensive legal framework for Mēl Milaap platform
          </p>
          <Badge variant="outline" className="mt-4">
            Last Updated: January 2024 • Version 2.1
          </Badge>
        </motion.div>
      </motion.div>

      {/* Quick Navigation */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                'User Responsibilities',
                'Platform Usage',
                'Payment Terms',
                'Privacy & Data',
                'Content Guidelines',
                'Safety Policies',
                'Liability Terms',
                'Dispute Resolution'
              ].map((item) => (
                <Button key={item} variant="ghost" size="sm" className="justify-start text-left">
                  {item}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Critical Terms Alert */}
      <motion.div variants={fadeInUp}>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Important Legal Notice</p>
              <p>By using Mēl Milaap, you agree to these terms and our dispute resolution process. 
              Please read carefully, especially sections on liability, payment terms, and account termination.</p>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Terms Sections */}
      <motion.div
        className="space-y-8"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        
        {/* 1. Acceptance and Eligibility */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-3 text-primary" />
                1. Acceptance of Terms & User Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Acceptance</h4>
                <p className="text-muted-foreground leading-relaxed">
                  By creating an account, accessing, or using Mēl Milaap services, you acknowledge that you have read, 
                  understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not 
                  agree to these terms, you must not use our services.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Eligibility Requirements</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Must be at least 18 years of age (21+ in some jurisdictions)</li>
                  <li>• Legally single or eligible for marriage under applicable law</li>
                  <li>• Not previously banned or suspended from our platform</li>
                  <li>• Must provide accurate and truthful information</li>
                  <li>• Australian residents or eligible visa holders preferred</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Account Verification</h4>
                <p className="text-muted-foreground leading-relaxed">
                  We may require identity verification including government-issued ID, proof of address, 
                  and other documentation to ensure platform safety and compliance with legal requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. User Responsibilities */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-3 text-primary" />
                2. User Responsibilities & Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Profile Accuracy</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• All profile information must be truthful and up-to-date</li>
                  <li>• Photos must be recent (within 2 years) and show you clearly</li>
                  <li>• Misrepresentation of age, marital status, or identity is prohibited</li>
                  <li>• Professional photos and posed images are encouraged</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Prohibited Conduct</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-red-600 mb-2">Strictly Forbidden</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Creating fake or duplicate profiles</li>
                      <li>• Harassment, bullying, or inappropriate contact</li>
                      <li>• Sharing explicit or inappropriate content</li>
                      <li>• Commercial or promotional activities</li>
                      <li>• Collecting other users' personal information</li>
                      <li>• Circumventing privacy or security measures</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-600 mb-2">Cultural Sensitivity</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Respect diverse cultural and religious backgrounds</li>
                      <li>• Avoid discriminatory language or behavior</li>
                      <li>• Honor family involvement in matrimonial process</li>
                      <li>• Maintain appropriate communication standards</li>
                      <li>• Report inappropriate behavior promptly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Platform Usage & Features */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-6 w-6 mr-3 text-primary" />
                3. Platform Usage & Matrimonial Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Matchmaking Services</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform provides matrimonial matchmaking services including profile browsing, interest expressions, 
                  messaging, and family involvement features. We do not guarantee matches or successful marriages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <h5 className="font-medium">Profile Viewing</h5>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• View compatible profiles</li>
                    <li>• Respect privacy settings</li>
                    <li>• Limited daily views for free users</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    <h5 className="font-medium">Communication</h5>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Send interests to profiles</li>
                    <li>• Message after mutual acceptance</li>
                    <li>• Family member involvement</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-4 w-4 text-purple-500" />
                    <h5 className="font-medium">Privacy Controls</h5>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Control profile visibility</li>
                    <li>• Block unwanted contacts</li>
                    <li>• Manage photo access</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 4. Payment Terms */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-6 w-6 mr-3 text-primary" />
                4. Payment Terms & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Subscription Plans</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-green-600">Basic (Free)</h5>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Limited profile views</li>
                      <li>• Basic search filters</li>
                      <li>• 5 interests per month</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <h5 className="font-medium text-blue-600">Premium ($29.99/month)</h5>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Unlimited profile views</li>
                      <li>• Advanced search filters</li>
                      <li>• Priority support</li>
                      <li>• Read receipts</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-purple-600">Elite ($59.99/month)</h5>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Personal matchmaker</li>
                      <li>• Profile optimization</li>
                      <li>• Background verification</li>
                      <li>• Exclusive events</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Payment Processing</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• All payments processed securely through Stripe</li>
                  <li>• Subscriptions automatically renew unless cancelled</li>
                  <li>• All prices in Australian Dollars (AUD) unless specified</li>
                  <li>• GST included where applicable</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Refund Policy</h4>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm">
                    <strong>14-Day Money-Back Guarantee:</strong> New premium subscribers may request 
                    a full refund within 14 days of initial subscription. Refunds are processed to 
                    the original payment method within 5-10 business days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5. Content Guidelines & Photo Policies */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-6 w-6 mr-3 text-primary" />
                5. Content Guidelines & Photo Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Photo Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-green-600 mb-2">✓ Acceptable Photos</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Clear, high-resolution images</li>
                      <li>• Recent photos (within 2 years)</li>
                      <li>• Face clearly visible</li>
                      <li>• Appropriate attire</li>
                      <li>• Natural lighting preferred</li>
                      <li>• Solo photos for profile picture</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-600 mb-2">✗ Prohibited Content</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Explicit or suggestive content</li>
                      <li>• Photos of other people</li>
                      <li>• Heavily filtered/edited images</li>
                      <li>• Copyrighted material</li>
                      <li>• Blurry or pixelated images</li>
                      <li>• Promotional content</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Content Moderation</h4>
                <p className="text-muted-foreground leading-relaxed">
                  All photos and profile content undergo manual and automated review processes. 
                  Content violating our guidelines will be removed, and repeat violations may result 
                  in account suspension or termination.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Intellectual Property</h4>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of content you upload but grant us a non-exclusive license to use, 
                  display, and distribute your content for platform operations. You warrant that you have 
                  all necessary rights to upload and share your content.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 6. Privacy & Data Protection */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-6 w-6 mr-3 text-primary" />
                6. Privacy & Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Collection & Usage</h4>
                <p className="text-muted-foreground leading-relaxed">
                  We collect and process personal information as detailed in our Privacy Policy, 
                  including profile data, photos, communication records, and usage analytics. 
                  Your data is used to provide matchmaking services and improve platform functionality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium text-blue-600 mb-2">Your Rights</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Access your personal data</li>
                    <li>• Correct inaccurate information</li>
                    <li>• Request data deletion</li>
                    <li>• Data portability</li>
                    <li>• Object to processing</li>
                    <li>• Withdraw consent</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium text-green-600 mb-2">Our Commitments</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• GDPR & Australian Privacy Act compliance</li>
                    <li>• Secure data storage and transmission</li>
                    <li>• No sale of personal information</li>
                    <li>• Transparent privacy practices</li>
                    <li>• Regular security audits</li>
                    <li>• Prompt breach notifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 7. Liability & Disclaimers */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-3 text-primary" />
                7. Liability Terms & Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Important Legal Disclaimer</p>
                    <p>Mēl Milaap is a platform facilitating introductions only. We do not guarantee marriages, 
                    compatibility, or the accuracy of user-provided information. Users are responsible for 
                    their own safety and decision-making.</p>
                  </div>
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-2">Limitation of Liability</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Platform operates on an "as-is" basis without warranties</li>
                  <li>• We are not responsible for user conduct or interactions</li>
                  <li>• Liability limited to subscription fees paid in the 12 months prior to claim</li>
                  <li>• No liability for indirect, consequential, or emotional damages</li>
                  <li>• Force majeure events beyond our reasonable control are excluded</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">User Safety</h4>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm">
                    <strong>Safety First:</strong> Always meet in public places, inform family/friends of meetings, 
                    trust your instincts, and report suspicious behavior. We provide safety guidelines but cannot 
                    guarantee the safety of offline interactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 8. Dispute Resolution */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gavel className="h-6 w-6 mr-3 text-primary" />
                8. Dispute Resolution & Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Resolution Process</h4>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. <strong>Direct Communication:</strong> First attempt to resolve disputes directly with other users</li>
                  <li>2. <strong>Platform Mediation:</strong> Contact our support team for mediation assistance</li>
                  <li>3. <strong>Formal Complaint:</strong> Submit written complaint with supporting documentation</li>
                  <li>4. <strong>Alternative Dispute Resolution:</strong> Binding arbitration if mediation fails</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Governing Law & Jurisdiction</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>• These terms are governed by Australian law</li>
                    <li>• Disputes subject to jurisdiction of New South Wales courts</li>
                    <li>• Australian Consumer Law protections apply where applicable</li>
                    <li>• International users subject to Australian jurisdiction for platform disputes</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Account Termination</h4>
                <p className="text-muted-foreground leading-relaxed">
                  We may suspend or terminate accounts for violations of these terms, fraudulent activity, 
                  or other conduct harmful to the platform or its users. You may close your account anytime 
                  through account settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Legal Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">General Legal Inquiries</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Email: legal@melmilaap.com</li>
                    <li>Phone: +61 (0)2 8000 0000</li>
                    <li>Address: Legal Department, Mēl Milaap Pty Ltd</li>
                    <li>Sydney, NSW, Australia</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Privacy & Data Inquiries</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Email: privacy@melmilaap.com</li>
                    <li>Data Protection Officer available</li>
                    <li>GDPR compliance inquiries welcome</li>
                    <li>Response within 30 days guaranteed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>

      {/* Agreement Confirmation */}
      <motion.div variants={fadeInUp}>
        <Card className="border-2 border-primary">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Terms Agreement</h3>
              <p className="text-muted-foreground">
                By continuing to use Mēl Milaap, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
              </p>
              <p className="text-sm text-muted-foreground">
                Version 2.1 • Last Updated: January 2024 • Next Review: July 2024
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};