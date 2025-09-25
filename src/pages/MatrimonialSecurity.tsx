import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AccountSidebar } from '@/components/ui/account-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AccountHeader } from '@/components/ui/account-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Settings, 
  Heart, 
  Activity,
  TestTube
} from 'lucide-react';
import { fadeInUp } from '@/lib/motion';
import SecurityTestSuite from '@/components/matrimonial/SecurityTestSuite';
import PrivacyControls from '@/components/matrimonial/PrivacyControls';
import InterestManager from '@/components/matrimonial/InterestManager';
import SecurityDashboard from '@/components/matrimonial/SecurityDashboard';
import BlockReportActions from '@/components/privacy/BlockReportActions';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const MatrimonialSecurity: React.FC = () => {
  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <AccountHeader
            title="Matrimonial Security Center"
            description="Comprehensive security testing and privacy controls for the matrimonial platform"
            icon={Shield}
            backUrl="/account"
            backText="Back to Dashboard"
          />

          <motion.section 
            className="py-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="dashboard" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="tests" className="flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    <span className="hidden sm:inline">Security Tests</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="interests" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span className="hidden sm:inline">Interests</span>
                  </TabsTrigger>
                  <TabsTrigger value="blocking" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Safety</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  <SecurityDashboard />
                </TabsContent>

                <TabsContent value="tests" className="space-y-6">
                  <SecurityTestSuite />
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <PrivacyControls />
                </TabsContent>

                <TabsContent value="interests" className="space-y-6">
                  <InterestManager />
                </TabsContent>

                <TabsContent value="blocking" className="space-y-6">
                  <div className="space-y-6">
                    {/* Demo of Block/Report Actions with a sample user */}
                    <div className="bg-card p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4">Block & Report Actions</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Test the block and report functionality with sample user actions:
                      </p>
                      <BlockReportActions 
                        targetUserId="sample-user-id" 
                        targetUserName="Sample User"
                        className="justify-start"
                      />
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">Security Features Active:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Users can only block/report others, not themselves</li>
                        <li>• All actions are logged with timestamps and user IDs</li>
                        <li>• Reports include categorized reasons and optional descriptions</li>
                        <li>• Blocked users cannot view profiles or send messages</li>
                        <li>• RLS policies prevent blocked users from interacting</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.section>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MatrimonialSecurity;