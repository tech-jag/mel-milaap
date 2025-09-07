"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { ArrowLeft, Shield, Eye, Lock, Database, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Link to="/privacy" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Privacy Hub
              </Link>
              <h1 className="text-luxury-xl text-foreground mb-6">
                Privacy Policy
              </h1>
              <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
                Your privacy is fundamental to who we are and how we operate at Mēl Milaap.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: January 2024
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="space-y-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >

              {/* Introduction */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-primary" />
                      Introduction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p>
                      At Mēl Milaap, we are committed to protecting your privacy and ensuring the security of your personal information. 
                      This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                    </p>
                    <p>
                      By using Mēl Milaap, you agree to the collection and use of information in accordance with this policy. 
                      We will not use or share your information with anyone except as described in this Privacy Policy.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Information We Collect */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="w-6 h-6 mr-3 text-primary" />
                      Information We Collect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <h4>Personal Information</h4>
                    <ul>
                      <li><strong>Account Information:</strong> Name, email address, phone number, date of birth, location</li>
                      <li><strong>Profile Information:</strong> Photos, personal descriptions, preferences, family details</li>
                      <li><strong>Identity Verification:</strong> Government-issued ID, verification documents</li>
                      <li><strong>Communication:</strong> Messages, photos, and other content you share on our platform</li>
                    </ul>

                    <h4>Usage Information</h4>
                    <ul>
                      <li><strong>Activity Data:</strong> How you interact with our platform, profiles viewed, searches performed</li>
                      <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                      <li><strong>Location Data:</strong> General location information for matching purposes</li>
                    </ul>

                    <h4>Payment Information</h4>
                    <ul>
                      <li><strong>Billing Details:</strong> Credit card information, billing address (processed securely through Stripe)</li>
                      <li><strong>Transaction History:</strong> Records of payments and subscription details</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* How We Use Your Information */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-6 h-6 mr-3 text-primary" />
                      How We Use Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p>We use your information for the following purposes:</p>
                    <ul>
                      <li><strong>Matchmaking Services:</strong> To provide personalized matches based on your preferences and compatibility</li>
                      <li><strong>Account Management:</strong> To create and maintain your account, provide customer support</li>
                      <li><strong>Communication:</strong> To facilitate communication between members and send important updates</li>
                      <li><strong>Safety & Security:</strong> To verify identities, prevent fraud, and maintain platform safety</li>
                      <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our platform</li>
                      <li><strong>Marketing:</strong> To send you relevant information about our services (with your consent)</li>
                      <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Information Sharing */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-6 h-6 mr-3 text-primary" />
                      Information Sharing and Disclosure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p>We may share your information in the following circumstances:</p>
                    
                    <h4>With Other Members</h4>
                    <ul>
                      <li>Profile information you choose to share publicly</li>
                      <li>Messages and photos you send to other members</li>
                      <li>Basic compatibility information for matching purposes</li>
                    </ul>

                    <h4>With Service Providers</h4>
                    <ul>
                      <li>Payment processing (Stripe)</li>
                      <li>Cloud storage and hosting services</li>
                      <li>Analytics and performance monitoring</li>
                      <li>Customer support platforms</li>
                    </ul>

                    <h4>Legal Requirements</h4>
                    <ul>
                      <li>When required by law or court order</li>
                      <li>To protect our rights, safety, or property</li>
                      <li>To investigate fraud or security issues</li>
                      <li>With your explicit consent</li>
                    </ul>

                    <p><strong>We will never sell your personal information to third parties.</strong></p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Data Security */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="w-6 h-6 mr-3 text-primary" />
                      Data Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p>We implement industry-standard security measures to protect your information:</p>
                    <ul>
                      <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                      <li><strong>Secure Storage:</strong> Information is stored on secure servers with restricted access</li>
                      <li><strong>Access Controls:</strong> Strict employee access controls and regular security training</li>
                      <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</li>
                      <li><strong>Two-Factor Authentication:</strong> Available for enhanced account security</li>
                      <li><strong>Data Minimization:</strong> We only collect and retain necessary information</li>
                    </ul>
                    <p>
                      While we strive to protect your personal information, no method of transmission over the Internet 
                      or electronic storage is 100% secure. We cannot guarantee absolute security.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Your Rights */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-primary" />
                      Your Privacy Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p>You have the following rights regarding your personal information:</p>
                    <ul>
                      <li><strong>Access:</strong> Request a copy of your personal information</li>
                      <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                      <li><strong>Portability:</strong> Request your data in a portable format</li>
                      <li><strong>Restriction:</strong> Limit how we process your information</li>
                      <li><strong>Objection:</strong> Object to certain types of processing</li>
                      <li><strong>Withdrawal of Consent:</strong> Withdraw consent for data processing</li>
                    </ul>
                    <p>
                      To exercise these rights, please contact us at privacy@melmilaap.com. 
                      We will respond to your request within 30 days.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Data Retention */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Data Retention</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p>We retain your personal information for as long as necessary to:</p>
                    <ul>
                      <li>Provide our services to you</li>
                      <li>Comply with legal obligations</li>
                      <li>Resolve disputes and enforce agreements</li>
                      <li>Maintain security and prevent fraud</li>
                    </ul>
                    <p>
                      When you delete your account, we will delete or anonymize your personal information within 30 days, 
                      except where we need to retain certain information for legal or security purposes.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p>
                      If you have questions about this Privacy Policy or our privacy practices, please contact us:
                    </p>
                    <ul>
                      <li><strong>Email:</strong> privacy@melmilaap.com</li>
                      <li><strong>Mail:</strong> Mēl Milaap Privacy Team, Sydney, NSW, Australia</li>
                      <li><strong>Phone:</strong> +61 (0)2 8000 0000</li>
                    </ul>
                    <p>
                      For urgent privacy concerns, please mark your communication as "Urgent Privacy Matter."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Updates to Policy */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Updates to This Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p>
                      We may update this Privacy Policy from time to time. When we make changes, we will:
                    </p>
                    <ul>
                      <li>Post the updated policy on our website</li>
                      <li>Update the "Last updated" date</li>
                      <li>Notify you via email for significant changes</li>
                      <li>Provide notice within the platform</li>
                    </ul>
                    <p>
                      Your continued use of our services after changes take effect constitutes acceptance of the updated policy.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link to="/data-rights">
                  <Button variant="outline" size="lg">
                    <FileText className="w-5 h-5 mr-2" />
                    Data Protection Rights
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg">
                    Contact Privacy Team
                  </Button>
                </Link>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;