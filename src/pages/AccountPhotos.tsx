import React from 'react';
import { AccountSidebar } from '@/components/ui/account-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PhotoManager } from '@/components/PhotoManager';
import { AccountHeader } from '@/components/ui/account-header';

export default function AccountPhotos() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          <AccountHeader 
            title="Profile Photos"
            description="Manage your profile photos to attract potential matches"
            icon={Camera}
            backUrl="/account"
            backText="Back to Dashboard"
          >
            <Link to="/account/profile">
              <Button variant="outline" size="sm">
                <span className="hidden lg:inline">Manage Profile</span>
                <span className="lg:hidden">Profile</span>
              </Button>
            </Link>
          </AccountHeader>

          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <PhotoManager />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}