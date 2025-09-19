import React from 'react';
import { AccountSidebar } from '@/components/ui/account-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PhotoManager } from '@/components/PhotoManager';

export default function AccountPhotos() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AccountSidebar />
          
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link to="/account">
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">Photo Management</Badge>
                    <h1 className="text-3xl font-bold text-foreground">Profile Photos</h1>
                    <p className="text-muted-foreground">Manage your profile photos to attract potential matches</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link to="/account/profile">
                        Manage Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <PhotoManager />
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}