import React from "react";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Crown, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { PhotoManager } from "@/components/PhotoManager";
import { PhotoPrivacyControls } from "@/components/PhotoPrivacyControls";
import { AccountHeader } from "@/components/ui/account-header";

export default function AccountPhotos() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          {/* Mobile-Optimized Header using updated AccountHeader component */}
          <AccountHeader
            title="Profile Photos"
            description="Manage your profile photos to attract potential matches"
            icon={Camera}
            backUrl="/account"
            backText="Back to Dashboard"
          >
          {/* Upgrade Button for Free Users */}
            <Button 
              asChild 
              size="sm" 
              variant="outline"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-glow text-white border-0 hover:opacity-90"
            >
              <Link to="/pricing">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Link>
            </Button>
          </AccountHeader>

          {/* Main Content - Mobile Optimized */}
          <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8">
            <div className="max-w-4xl mx-auto">
              
               {/* Photo Management Section - Let PhotoManager handle its own buttons */}
               <div className="mb-6 lg:mb-8">
                 {/* Photo Manager Component */}
                 <PhotoManager />
                 
                 {/* Photo Privacy Controls */}
                 <div className="mt-8">
                   <PhotoPrivacyControls />
                 </div>
               </div>


              {/* Privacy Settings - Mobile Optimized - REMOVED REDUNDANT SECTION */}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}