import React from 'react';
import { AccountSidebar } from '@/components/ui/account-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PhotoManager } from '@/components/PhotoManager';

export default function AccountPhotos() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
            <div className="container mx-auto px-4 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Profile Photos</h1>
                    <p className="text-muted-foreground">Manage your profile photos to attract potential matches</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/account/profile">
                    <Button variant="outline">
                      Manage Profile
                    </Button>
                  </Link>
                  <Link to="/account">
                    <Button variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

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