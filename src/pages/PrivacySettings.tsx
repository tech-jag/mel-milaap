import React from 'react';
import { motion } from 'framer-motion';
import { AccountSidebar } from '@/components/ui/account-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AccountHeader } from '@/components/ui/account-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Settings, 
  Download,
  UserX
} from 'lucide-react';
import { fadeInUp } from '@/lib/motion';
import PrivacyControls from '@/components/matrimonial/PrivacyControls';
import DataExport from '@/components/privacy/DataExport';
import BlockReportActions from '@/components/privacy/BlockReportActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PrivacySettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id: user.id,
          reason: 'User requested account deletion',
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Account Deletion Requested",
        description: "Your account will be deleted in 7 days. You can cancel this request anytime before then.",
      });
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      toast({
        title: "Error",
        description: "Failed to request account deletion. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <AccountHeader
            title="Privacy Settings"
            description="Manage your privacy, visibility, and data preferences"
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
              <Tabs defaultValue="privacy" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="blocking" className="flex items-center gap-2">
                    <UserX className="h-4 w-4" />
                    <span className="hidden sm:inline">Blocking</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Data Export</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="privacy" className="space-y-6">
                  <PrivacyControls />
                </TabsContent>

                <TabsContent value="blocking" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Block & Report Management</CardTitle>
                      <CardDescription>
                        Manage users you've blocked and report inappropriate behavior
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>• Blocked users cannot view your profile or send you messages</p>
                        <p>• You can unblock users at any time</p>
                        <p>• Reports are reviewed by our moderation team</p>
                      </div>
                      <BlockReportActions 
                        targetUserId="sample-user-id" 
                        targetUserName="Sample User"
                        className="justify-start"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-6">
                  <DataExport />
                </TabsContent>

                <TabsContent value="account" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-destructive">Account Deletion</CardTitle>
                      <CardDescription>
                        Permanently delete your account and all associated data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-2">Before you delete your account:</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• This action cannot be undone</li>
                          <li>• All your data will be permanently removed</li>
                          <li>• You have 7 days to cancel the deletion request</li>
                          <li>• Consider downloading your data first</li>
                        </ul>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="w-full"
                      >
                        Request Account Deletion
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </motion.section>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PrivacySettings;