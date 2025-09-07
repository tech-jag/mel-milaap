import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  BookmarkPlus, 
  Search, 
  Shield, 
  ArrowUpRight,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const MatchDashboard = () => {
  // Mock data for demonstration
  const matchStats = {
    profileViews: 125,
    likesReceived: 23,
    messagesSent: 8,
    matchesFound: 12
  };

  const recentActivity = [
    { type: "view", name: "Priya K.", time: "2 hours ago", location: "Sydney" },
    { type: "like", name: "Rahul M.", time: "5 hours ago", location: "Melbourne" },
    { type: "message", name: "Aisha P.", time: "1 day ago", location: "Brisbane" },
  ];

  const recommendations = [
    { name: "Kavya S.", age: 26, profession: "Doctor", location: "Sydney", compatibility: 92 },
    { name: "Arjun R.", age: 29, profession: "Engineer", location: "Melbourne", compatibility: 88 },
    { name: "Meera T.", age: 25, profession: "Teacher", location: "Perth", compatibility: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Match Dashboard</h1>
          <p className="text-muted-foreground">Find your perfect match and connect with compatible profiles</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Free Member
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{matchStats.profileViews}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Likes Received</p>
                <p className="text-2xl font-bold">{matchStats.likesReceived}</p>
              </div>
              <Heart className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{matchStats.messagesSent}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Matches</p>
                <p className="text-2xl font-bold">{matchStats.matchesFound}</p>
              </div>
              <BookmarkPlus className="w-8 h-8 text-lux-champagne" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Complete your profile to get better matches</span>
              <span className="text-sm text-muted-foreground">75%</span>
            </div>
            <Progress value={75} className="w-full" />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/account/profile">Add Photos</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/account/verification">Get Verified</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/account/profile">Complete Bio</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activity.type === "view" && <Users className="w-4 h-4 text-primary" />}
                    {activity.type === "like" && <Heart className="w-4 h-4 text-accent" />}
                    {activity.type === "message" && <MessageCircle className="w-4 h-4 text-success" />}
                    <div>
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/account/messages">View All Activity</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((match, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{match.name}, {match.age}</p>
                      <p className="text-xs text-muted-foreground">{match.profession} • {match.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {match.compatibility}% match
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/match">
                  Discover More Matches
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="luxury" className="h-auto p-4 flex flex-col gap-2" asChild>
              <Link to="/match">
                <Search className="w-6 h-6" />
                <span>Search Profiles</span>
              </Link>
            </Button>
            <Button variant="champagne" className="h-auto p-4 flex flex-col gap-2" asChild>
              <Link to="/account/favorites">
                <Heart className="w-6 h-6" />
                <span>View Favorites</span>
              </Link>
            </Button>
            <Button variant="premium" className="h-auto p-4 flex flex-col gap-2" asChild>
              <Link to="/account/messages">
                <MessageCircle className="w-6 h-6" />
                <span>Messages</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchDashboard;