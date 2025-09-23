"use client";

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { FloralBranding } from '@/components/ui/FloralBranding';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export function MainLayout() {
  const location = useLocation();
  let floralVariant: 'homepage' | 'account' | 'minimal' = 'minimal';

  // Logic to select floral variant based on the page route
  if (location.pathname === '/') {
    floralVariant = 'homepage';
  } else if (location.pathname.startsWith('/account')) {
    floralVariant = 'account';
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloralBranding variant={floralVariant} className="z-0" />
      <main className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
}