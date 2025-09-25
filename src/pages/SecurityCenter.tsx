import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrivacySettings from '@/components/privacy/PrivacySettings';
import DataExport from '@/components/privacy/DataExport';
import SecurityAlerts from '@/components/security/SecurityAlerts';
import { Shield, Download, Bell, Settings } from 'lucide-react';

const SecurityCenter = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Security & Privacy Center</h1>
          <p className="text-muted-foreground">
            Manage your privacy settings, security alerts, and data
          </p>
        </div>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Privacy Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Security Alerts
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Data Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityAlerts />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityCenter;