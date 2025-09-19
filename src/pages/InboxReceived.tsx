"use client";

import * as React from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  MessageCircle, 
  User, 
  CheckCircle, 
  X,
  MapPin,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";

export default function InboxReceived() {
  const receivedProfiles = [
    {
      id: 1,
      name: "Simranjeet K",
      age: 25,
      height: "5'5\"",
      location: "Punjabi, Saini, Chandigarh",
      education: "M.A",
      profession: "Not working",
      online: "1h ago",
      type: "super_connect",
      message: "She invited you to Connect",
      avatar: null
    },
    {
      id: 2, 
      name: "Ripanpreet B",
      age: 24,
      height: "5'9\"",
      location: "Punjabi, Jat, Winnipeg, CAN | Faridkot",
      education: "BBA",
      profession: "Sales Professional",
      online: "8h ago",
      type: "connect",
      message: "She invited you to Connect",
      avatar: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link to="/inbox">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Inbox
              </Button>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Received ({receivedProfiles.length})</h1>
                <p className="text-muted-foreground">Profile interests you've received</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm">All Requests</Button>
            <Button variant="ghost" size="sm">Super Connects</Button>
            <Button variant="ghost" size="sm">Premium Members</Button>
            <Button variant="ghost" size="sm">Online Now</Button>
          </div>

          {/* Received Profiles */}
          <div className="space-y-4">
            {receivedProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {/* Profile Avatar */}
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={profile.avatar} alt={profile.name} />
                          <AvatarFallback className="bg-gradient-primary text-white text-lg">
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {profile.type === 'super_connect' && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                            ❤️ SUPER CONNECT
                          </div>
                        )}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Online {profile.online}
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">{profile.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {profile.age} yrs, {profile.height}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{profile.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <span>{profile.education} | {profile.profession}</span>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-4">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-600" />
                            <p className="text-sm font-medium text-blue-900">{profile.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}