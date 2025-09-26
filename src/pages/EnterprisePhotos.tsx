import React from "react";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountHeader } from "@/components/ui/account-header";
import { Camera } from "lucide-react";
import { EnterprisePhotoUpload } from "@/components/photo/EnterprisePhotoUpload";

export default function EnterprisePhotos() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <AccountHeader
            title="Enterprise Photo Management"
            description="Secure photo upload with enterprise-grade validation and approval workflow"
            icon={Camera}
            backUrl="/account"
            backText="Back to Dashboard"
          />

          <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8">
            <div className="max-w-4xl mx-auto">
              <EnterprisePhotoUpload 
                maxPhotos={8}
                enableWatermark={true}
                requireApproval={true}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}