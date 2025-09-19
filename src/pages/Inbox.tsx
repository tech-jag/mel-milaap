"use client";

import * as React from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Heart, Send, Check, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Inbox() {
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
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Messages & Interests</h1>
                    <p className="text-muted-foreground">Connect with your matches and manage your conversations</p>
                  </div>
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

          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">

              {/* Inbox Tabs */}
              <Tabs defaultValue="received" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="received" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Received</span>
                    <Badge variant="secondary" className="ml-1">2</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="accepted" className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Accepted</span>
                    <Badge variant="secondary" className="ml-1">0</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Requests</span>
                    <Badge variant="secondary" className="ml-1">0</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Sent</span>
                    <Badge variant="secondary" className="ml-1">0</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="deleted" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Deleted</span>
                    <Badge variant="secondary" className="ml-1">0</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="received">
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">New Profile Interests</h3>
                    <p className="text-muted-foreground mb-6">
                      You have 2 profile interests waiting for your response
                    </p>
                    <Button asChild>
                      <Link to="/inbox/received">View Received Interests</Link>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="accepted">
                  <div className="text-center py-12">
                    <Check className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Accepted Connections</h3>
                    <p className="text-muted-foreground mb-6">
                      No accepted connections yet
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/matches">Browse Matches</Link>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="requests">
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Pending Requests</h3>
                    <p className="text-muted-foreground mb-6">
                      No pending requests
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/search">Search Profiles</Link>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="sent">
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Sent Messages</h3>
                    <p className="text-muted-foreground mb-6">
                      No sent messages yet
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/matches">Start Conversations</Link>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="deleted">
                  <div className="text-center py-12">
                    <Trash2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Deleted Messages</h3>
                    <p className="text-muted-foreground mb-6">
                      No deleted messages
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}