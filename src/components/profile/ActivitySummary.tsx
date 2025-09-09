import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageCircle, UserPlus } from "lucide-react";

interface ActivitySummaryProps {
  data: {
    pendingInvitations: number;
    acceptedInvitations: number;
    recentVisitors: number;
    contactsViewed: number;
    chatsInitiated: number;
    interests: number;
  };
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({ data }) => {
  const summaryItems = [
    {
      label: "No Pending Invitations",
      value: data.pendingInvitations,
      icon: UserPlus,
      color: "text-orange-500"
    },
    {
      label: "No Accepted Invitations", 
      value: data.acceptedInvitations,
      icon: Heart,
      color: "text-green-500"
    },
    {
      label: "No Recent Visitors",
      value: data.recentVisitors,
      icon: Eye,
      color: "text-blue-500"
    }
  ];

  const activityItems = [
    {
      label: "Contacts viewed",
      value: data.contactsViewed,
      icon: Eye,
      color: "text-purple-500"
    },
    {
      label: "Chats initiated",
      value: data.chatsInitiated,
      icon: MessageCircle,
      color: "text-pink-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Activity Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Row */}
        <div className="grid grid-cols-3 gap-4">
          {summaryItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-muted-foreground mb-1">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Premium Notice */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm font-medium text-orange-800">
              Only <span className="text-blue-600 font-semibold">Premium</span> Members can avail these benefits
            </div>
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-8">
          {activityItems.map((item, index) => (
            <div key={index} className="text-center">
              <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
              <div className="text-2xl font-bold text-muted-foreground mb-1">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Improve Profile Section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Improve your Profile</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Members with Photos</h4>
                <p className="text-sm text-green-700">get twice as many responses</p>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold mb-2">Get more responses</div>
                <Badge className="bg-white text-green-600 border-green-600">Add Photo</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};