import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { 
  Heart, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Star,
  MessageCircle,
  Share,
  MoreHorizontal,
  Verified,
  Shield,
  Phone,
  Mail,
  Home,
  Globe,
  GraduationCap as Education
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Banner */}
          <div className="bg-gradient-primary text-primary-foreground p-6 rounded-xl mb-8 shadow-luxury">
            <div className="text-center">
              <h1 className="text-2xl font-heading font-semibold mb-2">Profile Preview</h1>
              <p className="text-sm opacity-90">Profile as it appears to others</p>
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Avatar and Basic Info */}
            <div className="lg:col-span-1">
              <Card className="luxury-card">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <Avatar className="w-40 h-40 mx-auto border-4 border-accent/20">
                      <AvatarImage 
                        src={profile.photo_primary_url} 
                        className={!isOwnProfile ? "blur-sm" : ""}
                      />
                      <AvatarFallback className="text-3xl bg-secondary">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {!isOwnProfile && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                          Premium Required
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-2xl font-heading font-semibold text-foreground">
                      {profile.first_name} {profile.last_name?.[0]}
                    </h2>
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-success mb-6">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    Online now
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="text-muted-foreground font-medium">Age:</span>
                      <span className="font-semibold">{age ? `${age} yrs` : 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="text-muted-foreground font-medium">Height:</span>
                      <span className="font-semibold">{profile.height_cm ? `${Math.floor(profile.height_cm/30.48)}'${Math.round((profile.height_cm%30.48)/2.54)}"` : 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="text-muted-foreground font-medium">Religion:</span>
                      <span className="font-semibold">{profile.religion || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="text-muted-foreground font-medium">Community:</span>
                      <span className="font-semibold">{profile.caste_community || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="text-muted-foreground font-medium">Location:</span>
                      <span className="font-semibold">{profile.city || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <span className="text-muted-foreground font-medium">Profession:</span>
                      <span className="font-semibold">{profile.profession_title || 'Not specified'}</span>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <div className="mt-8 space-y-4">
                      <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300 font-semibold py-3">
                        <Heart className="w-4 h-4 mr-2" />
                        Express Interest
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Share className="w-4 h-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verifications */}
              <Card className="luxury-card mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-success/20 rounded-full">
                      <Verified className="w-5 h-5 text-success" />
                    </div>
                    <span className="font-heading font-semibold text-lg">Verifications</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-success" />
                      <span>Mobile number verified</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-success" />
                      <span>Email verified</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-4 h-4 text-success" />
                      <span>Profile verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Profile */}
            <div className="lg:col-span-2">
              <Card className="luxury-card">
                <CardContent className="p-8">
                  {/* Tabs */}
                  <div className="flex border-b border-border mb-8">
                    <button className="px-6 py-3 border-b-2 border-primary text-primary font-heading font-semibold">
                      Detailed Profile
                    </button>
                    <button className="px-6 py-3 text-muted-foreground font-heading hover:text-foreground transition-colors">
                      Partner Preferences  
                    </button>
                    <div className="ml-auto flex gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-primary mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        About {profile.first_name}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-6">
                        <Badge variant="secondary" className="font-medium">
                          ID: {profile.profile_id || user?.id?.slice(0, 8)}
                        </Badge>
                        <Badge variant="outline" className="font-medium">
                          Profile Managed by {profile.profile_manager || 'Self'}
                        </Badge>
                      </div>
                      <div className="bg-secondary/30 p-6 rounded-lg">
                        <p className="text-foreground leading-relaxed">
                          {profile.bio || 'No bio provided yet.'}
                        </p>
                      </div>
                    </div>

                    {/* Hobbies & Interests */}
                    {profile.hobbies && profile.hobbies.length > 0 && (
                      <div>
                        <h3 className="font-heading font-semibold text-xl text-primary mb-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-accent" />
                          </div>
                          Hobbies & Interests
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {profile.hobbies.map((hobby: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-accent/10 border-accent/30 text-accent-foreground font-medium px-4 py-2 text-sm">
                              {hobby}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Details */}
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-primary mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        Contact Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-secondary/30 p-6 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Phone className="w-5 h-5 text-success" />
                            <span className="font-medium">Contact Number</span>
                          </div>
                          <div className="text-muted-foreground">
                            {!isOwnProfile ? '+61 4669X XXXX' : 'Hidden for privacy'}
                          </div>
                        </div>
                        <div className="bg-secondary/30 p-6 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-5 h-5 text-accent" />
                            <span className="font-medium">Email ID</span>
                          </div>
                          <div className="text-muted-foreground">
                            {!isOwnProfile ? 'XXXXXXXXX@gmail.com' : 'Hidden for privacy'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lifestyle */}
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-primary mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Home className="w-5 h-5 text-primary" />
                        </div>
                        Lifestyle
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-secondary/30 p-6 rounded-lg text-center">
                          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🌱</span>
                          </div>
                          <div className="font-semibold text-foreground">{profile.diet || 'Not specified'}</div>
                          <div className="text-sm text-muted-foreground mt-1">Diet</div>
                        </div>
                        <div className="bg-secondary/30 p-6 rounded-lg text-center">
                          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🚭</span>
                          </div>
                          <div className="font-semibold text-foreground">{profile.smoke || 'Not specified'}</div>
                          <div className="text-sm text-muted-foreground mt-1">Smoking</div>
                        </div>
                        <div className="bg-secondary/30 p-6 rounded-lg text-center">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🍷</span>
                          </div>
                          <div className="font-semibold text-foreground">{profile.drink || 'Not specified'}</div>
                          <div className="text-sm text-muted-foreground mt-1">Drinking</div>
                        </div>
                      </div>
                    </div>

                    {/* Background */}
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-primary mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        Background
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                            <span className="text-lg">🕉️</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{profile.religion}, {profile.caste_community}</div>
                            <div className="text-sm text-muted-foreground">Religious Background</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">Lives in {profile.city}, {profile.country_of_residence || 'Australia'}</div>
                            <div className="text-sm text-muted-foreground">Current Location</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                          <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                            <Education className="w-4 h-4 text-success" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{profile.education_level || 'Not specified'}</div>
                            <div className="text-sm text-muted-foreground">Education Level</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{profile.profession_title || 'Not specified'}</div>
                            <div className="text-sm text-muted-foreground">Profession</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};