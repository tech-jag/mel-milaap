import React from 'react';
import { AccountSidebar } from '@/components/ui/account-sidebar';
import { PhotoManager } from '@/components/PhotoManager';

export default function AccountPhotos() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar />
        </div>
        <div className="lg:col-span-3">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Profile Photos</h1>
              <p className="text-muted-foreground mt-2">
                Manage your profile photos to attract potential matches
              </p>
            </div>
            <PhotoManager />
          </div>
        </div>
      </div>
    </div>
  );
}