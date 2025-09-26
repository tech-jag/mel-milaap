import React from "react";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
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
            {/* Additional action buttons can go here if needed */}
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link to="/account/profile">
                Profile
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

              {/* Photo Guidelines - Mobile Optimized */}
              <div className="bg-muted/30 rounded-lg p-4 lg:p-6 mb-6">
                <h3 className="font-semibold mb-3 text-base lg:text-lg">Photo Guidelines</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-700">✓ Do's</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Use clear, recent photos</li>
                      <li>• Show your face clearly</li>
                      <li>• Include full body shots</li>
                      <li>• Smile naturally</li>
                      <li>• Use good lighting</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-700">✗ Don'ts</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• No group photos as primary</li>
                      <li>• Avoid sunglasses in all photos</li>
                      <li>• No blurry or pixelated images</li>
                      <li>• Don't use filters excessively</li>
                      <li>• No inappropriate content</li>
                    </ul>
                  </div>
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