"use client";

import * as React from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function AccountPhotos() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AccountSidebar />
          
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
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
                    <h1 className="text-3xl font-bold text-foreground">My Photos</h1>
                    <p className="text-muted-foreground">Manage your profile photos and gallery</p>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Photos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Add Photo Card */}
                      <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="text-center">
                          <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Add Photo</p>
                        </div>
                      </div>
                      
                      {/* Placeholder for existing photos */}
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg relative">
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            Photo {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}