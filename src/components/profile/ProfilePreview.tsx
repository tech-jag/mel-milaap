import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Star,
  MessageCircle,
  Share,
  MoreHorizontal
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfilePreviewProps {
  profile: any;
  preferences: any;
  isOwnProfile?: boolean;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({ 
  profile, 
  preferences, 
  isOwnProfile = false 
}) => {
  const { user } = useAuth();

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profile.birth_date);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-400 to-pink-400 text-white p-4 rounded-t-lg">
        <div className="text-center text-sm font-medium">
          Profile as it appears to others
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={profile.photo_primary_url} />
                <AvatarFallback className="text-2xl">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-xl font-semibold">{profile.first_name} {profile.last_name?.[0]}</h2>
                <Badge variant="destructive" className="text-xs">🔒</Badge>
              </div>
              
              <div className="text-sm text-green-600 mb-4">● Online now</div>
              
              <div className="space-y-2 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{age ? `${age} yrs` : 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height:</span>
                  <span>{profile.height_cm ? `${Math.floor(profile.height_cm/30.48)}'${Math.round((profile.height_cm%30.48)/2.54)}"` : 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Religion:</span>
                  <span>{profile.religion || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Community:</span>
                  <span>{profile.caste_community || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{profile.city || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profession:</span>
                  <span>{profile.profession_title || 'Not specified'}</span>
                </div>
              </div>

              {!isOwnProfile && (
                <div className="mt-6 space-y-2">
                  <div className="relative">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Connect Now
                    </Button>
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground cursor-pointer">Like this profile?</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verifications */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium">Verifications</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Mobile no. is verified
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Profile */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Tabs */}
              <div className="flex border-b mb-6">
                <button className="px-4 py-2 border-b-2 border-red-400 text-red-400 font-medium">
                  Detailed Profile
                </button>
                <button className="px-4 py-2 text-muted-foreground">
                  Partner Preferences  
                </button>
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      💬
                    </div>
                    About {profile.first_name}
                  </h3>
                  <div className="flex gap-4 mb-4">
                    <Badge variant="outline">ID: {user?.id?.slice(0, 8)}</Badge>
                    <Badge variant="outline">Profile Managed by {profile.profile_manager || 'Self'}</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {profile.bio || 'No bio provided yet.'}
                  </p>
                </div>

                {/* Hobbies & Interests */}
                {profile.hobbies && profile.hobbies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        🎯
                      </div>
                      Hobbies & Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.map((hobby: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-purple-50">
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Details */}
                <div>
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      📞
                    </div>
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-green-600 mb-1">📱 Contact Number</div>
                      <div className="text-sm">+61 4669X XXXX</div>
                    </div>
                    <div>
                      <div className="text-sm text-orange-600 mb-1">✉️ Email ID</div>
                      <div className="text-sm">XXXXXXXXX@gmail.com</div>
                    </div>
                  </div>
                </div>

                {/* Lifestyle */}
                <div>
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      💡
                    </div>
                    Lifestyle
                  </h3>
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        🌱
                      </div>
                      <div className="text-sm font-medium">{profile.diet || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                {/* Background */}
                <div>
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      👥
                    </div>
                    Background
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                        🕉️
                      </div>
                      <span className="text-sm">{profile.religion}, {profile.caste_community}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        👑
                      </div>
                      <span className="text-sm">{profile.sub_community || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        📍
                      </div>
                      <span className="text-sm">Lives in {profile.city}, {profile.country_of_residence || 'Australia'} (Citizen)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        🌍
                      </div>
                      <span className="text-sm">Grew up in {profile.location_country || 'Australia'}, India ethnic origin</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};