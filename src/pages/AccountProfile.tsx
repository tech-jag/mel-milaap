import React, { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Edit, Camera, MapPin, Briefcase, GraduationCap, Heart, Home, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { useAuth } from "@/hooks/useAuth";

export default function AccountProfile() {
  const { user } = useAuth();
  const { userProfile, partnerPreferences, isLoading } = useOnboardingState();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profileData = userProfile || {} as any;
  const preferences = partnerPreferences || {} as any;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AccountSidebar />
          
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
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
                    <Badge variant="outline" className="mb-2">Profile Management</Badge>
                    <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and preferences</p>
                  </div>
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
              </div>

              {/* Profile ID */}
              <div className="mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{profileData.first_name} {profileData.last_name}</h2>
                        <p className="text-muted-foreground">Profile ID: {user?.id?.slice(0, 8)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={profileData.profile_ready ? "default" : "secondary"}>
                            {profileData.profile_ready ? "Complete" : "Incomplete"}
                          </Badge>
                          {profileData.onboarding_completed && (
                            <Badge variant="outline">Verified</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic & Lifestyle */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Basic & Lifestyle
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                          <p className="font-medium">{profileData.gender || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Marital Status</Label>
                          <p className="font-medium">{profileData.marital_status || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Height</Label>
                          <p className="font-medium">{profileData.height_cm ? `${profileData.height_cm} cm` : 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                          <p className="font-medium">{profileData.dob ? new Date(profileData.dob).toLocaleDateString() : 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Diet</Label>
                          <p className="font-medium">{profileData.diet || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Drink</Label>
                          <p className="font-medium">{profileData.drink || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Smoke</Label>
                          <p className="font-medium">{profileData.smoke || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Children</Label>
                          <p className="font-medium">{profileData.has_children ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Religious Background */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Religious Background
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Religion</Label>
                          <p className="font-medium">{profileData.religion || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Community</Label>
                          <p className="font-medium">{profileData.caste_community || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Mother Tongue</Label>
                          <p className="font-medium">{profileData.mother_tongue || 'Not specified'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Family Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Family Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Family Type</Label>
                          <p className="font-medium">{profileData.family_type || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Family Values</Label>
                          <p className="font-medium">{profileData.family_values || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Father's Occupation</Label>
                          <p className="font-medium">{profileData.father_occupation || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Mother's Occupation</Label>
                          <p className="font-medium">{profileData.mother_occupation || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Siblings</Label>
                          <p className="font-medium">{profileData.siblings_count || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Education & Career */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education & Career
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Education Level</Label>
                          <p className="font-medium">{profileData.education_level || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Field of Study</Label>
                          <p className="font-medium">{profileData.education_field || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Institution</Label>
                          <p className="font-medium">{profileData.education_institution || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Profession</Label>
                          <p className="font-medium">{profileData.profession_title || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
                          <p className="font-medium">{profileData.industry || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                          <p className="font-medium">{profileData.company || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Income Range</Label>
                          <p className="font-medium">{profileData.income_range || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Employment Type</Label>
                          <p className="font-medium">{profileData.employment_type || 'Not specified'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location & Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Location & Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Current City</Label>
                          <p className="font-medium">{profileData.city || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Country of Residence</Label>
                          <p className="font-medium">{profileData.country_of_residence || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Citizenship</Label>
                          <p className="font-medium">{profileData.citizenship || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Visa Status</Label>
                          <p className="font-medium">{profileData.visa_status || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Willing to Relocate</Label>
                          <p className="font-medium">{profileData.willing_to_relocate ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* About Me */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">
                        {profileData.bio || 'No bio provided yet. Add a description about yourself to help potential matches get to know you better.'}
                      </p>
                      {profileData.hobbies && profileData.hobbies.length > 0 && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium text-muted-foreground">Hobbies & Interests</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {profileData.hobbies.map((hobby: string, index: number) => (
                              <Badge key={index} variant="outline">{hobby}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Partner Preferences */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Partner Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Age Range</Label>
                        <p className="font-medium">
                          {preferences.age_min && preferences.age_max 
                            ? `${preferences.age_min} - ${preferences.age_max} years`
                            : 'Not specified'
                          }
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Height Range</Label>
                        <p className="font-medium">
                          {preferences.height_min_cm && preferences.height_max_cm 
                            ? `${preferences.height_min_cm} - ${preferences.height_max_cm} cm`
                            : 'Not specified'
                          }
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                        <div className="space-y-2">
                          {preferences.countries && preferences.countries.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Countries</p>
                              <p className="font-medium">{preferences.countries.join(', ')}</p>
                            </div>
                          )}
                          {preferences.cities && preferences.cities.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Cities</p>
                              <p className="font-medium">{preferences.cities.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Education & Career</Label>
                        <div className="space-y-2">
                          {preferences.education_levels && preferences.education_levels.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Education</p>
                              <p className="font-medium">{preferences.education_levels.join(', ')}</p>
                            </div>
                          )}
                          {preferences.professions && preferences.professions.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Professions</p>
                              <p className="font-medium">{preferences.professions.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Religious Background</Label>
                        <div className="space-y-2">
                          {preferences.religions && preferences.religions.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Religion</p>
                              <p className="font-medium">{preferences.religions.join(', ')}</p>
                            </div>
                          )}
                          {preferences.communities && preferences.communities.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Community</p>
                              <p className="font-medium">{preferences.communities.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {preferences.notes && (
                        <>
                          <Separator />
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
                            <p className="text-sm mt-1">{preferences.notes}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* My Contact Detail */}
                  <Card>
                    <CardHeader>
                      <CardTitle>My Contact Detail</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="font-medium">{user?.email}</p>
                        <Badge variant={profileData.email_verified ? "default" : "secondary"} className="mt-1">
                          {profileData.email_verified ? "Verified" : "Not Verified"}
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                        <p className="font-medium">Not provided</p>
                        <Badge variant="secondary" className="mt-1">Not Verified</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}