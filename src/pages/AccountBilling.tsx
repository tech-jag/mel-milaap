"use client";

import * as React from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Crown } from "lucide-react";
import { Link } from "react-router-dom";

export default function AccountBilling() {
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
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Billing</h1>
                  <p className="text-muted-foreground">Manage your subscription and billing</p>
                </div>
                <Link to="/account">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">

              {/* Content */}
              <div className="space-y-6 py-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">FREE</Badge>
                        <h3 className="text-lg font-medium">Free Plan</h3>
                        <p className="text-muted-foreground">Basic features included</p>
                      </div>
                      <Button>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No payment methods added</p>
                      <Button variant="outline" className="mt-4">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}