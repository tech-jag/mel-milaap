import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountHeader } from "@/components/ui/account-header";
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Heart,
  MessageCircle,
  Shield,
  Calendar,
  Users
} from "lucide-react";
import { allProfiles } from "@/data/dummyProfiles";

export default function Profile() {
  const { profileId } = useParams();
  
  // Find the profile by ID
  const profile = allProfiles.find(p => p.id.toString() === profileId);

  if (!profile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          <AccountSidebar />
          
          <div className="flex-1">
            <AccountHeader
              title="Profile Not Found"
              description="The profile you're looking for doesn't exist"
              icon={User}
              backUrl="/search"
              backText="Back to Search"
            />
            
            <div className="container mx-auto px-4 py-8 text-center">
              <p className="text-muted-foreground">Please try searching for another profile.</p>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <AccountHeader
            title={`${profile.name}'s Profile`}
            description="View profile details and connect"
            icon={User}
            backUrl="/search"
            backText="Back to Search"
          >
            <Button size="sm" className="w-full sm:w-auto">
              <MessageCircle className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </AccountHeader>

          {/* Main Content */}
          <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8">
            <div className="max-w-4xl mx-auto">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* Profile Photo and Basic Info */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <img 
                          src={profile.photos[0]} 
                          alt={profile.name}
                          className="w-32 h-32 lg:w-48 lg:h-48 rounded-full object-cover mx-auto mb-4"
                        />
                        
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <h1 className="text-xl lg:text-2xl font-bold">{profile.name}</h1>
                          {profile.verified && (
                            <Badge className="bg-green-500 text-white">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{profile.age} years old</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{profile.location}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <span>{profile.profession}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                            <span>{profile.education}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Detailed Information */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* About Section */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">About {profile.name}</h2>
                      <p className="text-muted-foreground">{profile.bio}</p>
                    </CardContent>
                  </Card>
                  
                  {/* Basic Details */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Age</h3>
                          <p>{profile.age} years</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Height</h3>
                          <p>{profile.height}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Community</h3>
                          <p>{profile.religion}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Religion</h3>
                          <p>{profile.religion}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Mother Tongue</h3>
                          <p>{profile.motherTongue}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Marital Status</h3>
                          <p>{profile.maritalStatus}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Interests */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Interests</h2>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Family Details */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Family Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Family Type</h3>
                          <p>{profile.familyType}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Family Income</h3>
                          <p>{profile.income}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Diet</h3>
                          <p>{profile.diet}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Family Location</h3>
                          <p>{profile.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Connect Actions */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" className="flex-1 max-w-xs">
                          <Heart className="w-4 h-4 mr-2" />
                          Express Interest
                        </Button>
                        <Button className="flex-1 max-w-xs">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}