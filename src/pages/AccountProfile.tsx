import React, { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, MapPin, Briefcase, GraduationCap, Heart, Home, Users, Star, Eye, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { useAuth } from "@/hooks/useAuth";
import { EditableProfileSection } from "@/components/profile/EditableProfileSection";
import { AccountHeader } from "@/components/ui/account-header";
import { ProfileCompletionTracker } from "@/components/profile/ProfileCompletionTracker";
import { FloralBranding } from "@/components/ui/FloralBranding";

export default function AccountProfile() {
  const { user } = useAuth();
  const { userProfile, partnerPreferences, updateUserProfile, updatePartnerPreferences, isLoading } = useOnboardingState();

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

  const handleProfileUpdate = async (data: any) => {
    await updateUserProfile.mutateAsync(data);
  };

  const handlePreferencesUpdate = async (data: any) => {
    await updatePartnerPreferences.mutateAsync(data);
  };

  const basicFields = [
    { key: 'gender', label: 'Gender', type: 'select' as const, options: ['male', 'female', 'non_binary', 'prefer_not'] },
    { key: 'marital_status', label: 'Marital Status', type: 'select' as const, options: ['never_married', 'divorced', 'widowed', 'annulled'] },
    { key: 'height_cm', label: 'Height (cm)', type: 'number' as const },
    { key: 'birth_date', label: 'Date of Birth', type: 'date' as const },
    { key: 'diet', label: 'Diet', type: 'select' as const, options: ['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan', 'halal', 'prefer_not'] },
    { key: 'drinking', label: 'Drinking', type: 'select' as const, options: ['no', 'occasional', 'yes'] },
    { key: 'smoking', label: 'Smoking', type: 'select' as const, options: ['no', 'occasional', 'yes'] },
    { key: 'have_children', label: 'Have Children', type: 'select' as const, options: ['true', 'false'] }
  ];

  const religiousFields = [
    { key: 'religion', label: 'Religion', type: 'text' as const },
    { key: 'community', label: 'Community', type: 'text' as const },
    { key: 'sub_community', label: 'Sub Community', type: 'text' as const },
    { key: 'mother_tongue', label: 'Mother Tongue', type: 'text' as const }
  ];

  const astroFields = [
    { key: 'birth_time', label: 'Time of Birth', type: 'text' as const },
    { key: 'birth_place', label: 'Place of Birth', type: 'text' as const },
    { key: 'gothra', label: 'Gothra', type: 'text' as const },
    { key: 'nakshatra', label: 'Nakshatra', type: 'text' as const },
    { key: 'raashi', label: 'Raashi', type: 'text' as const },
    { key: 'manglik', label: 'Manglik', type: 'select' as const, options: ['yes', 'no', 'unknown'] },
    { key: 'mangal_dosha', label: 'Mangal Dosha', type: 'select' as const, options: ['yes', 'no', 'anshik', 'dont_know'] },
    { key: 'horoscope_matching_importance', label: 'Horoscope Matching', type: 'select' as const, options: ['very_important', 'important', 'not_important'] }
  ];

  const familyFields = [
    { key: 'family_type', label: 'Family Type', type: 'select' as const, options: ['nuclear', 'joint', 'other'] },
    { key: 'family_values', label: 'Family Values', type: 'select' as const, options: ['traditional', 'moderate', 'liberal', 'other'] },
    { key: 'father_occupation', label: "Father's Occupation", type: 'text' as const },
    { key: 'mother_occupation', label: "Mother's Occupation", type: 'text' as const },
    { key: 'siblings_brothers', label: 'Brothers', type: 'number' as const },
    { key: 'siblings_sisters', label: 'Sisters', type: 'number' as const },
    { key: 'family_living_in', label: 'Family Living In', type: 'text' as const },
    { key: 'family_about', label: 'About Family', type: 'textarea' as const }
  ];

  const educationFields = [
    { key: 'education_level', label: 'Education Level', type: 'text' as const },
    { key: 'field_of_study', label: 'Field of Study', type: 'text' as const },
    { key: 'university', label: 'University', type: 'text' as const },
    { key: 'occupation', label: 'Occupation', type: 'text' as const },
    { key: 'employer', label: 'Employer', type: 'text' as const },
    { key: 'annual_income', label: 'Annual Income', type: 'number' as const },
    { key: 'work_location', label: 'Work Location', type: 'text' as const }
  ];

  const locationFields = [
    { key: 'location_country', label: 'Country', type: 'text' as const },
    { key: 'location_state', label: 'State', type: 'text' as const },
    { key: 'location_city', label: 'City', type: 'text' as const },
    { key: 'citizenship', label: 'Citizenship', type: 'text' as const },
    { key: 'residency_status', label: 'Residency Status', type: 'text' as const }
  ];

  const aboutFields = [
    { key: 'about_me', label: 'About Me', type: 'textarea' as const },
    { key: 'highlights', label: 'Highlights', type: 'multi-select' as const, options: ['friendly', 'career-focused', 'family-oriented', 'spiritual', 'adventurous', 'artistic'] },
    { key: 'lifestyle_tags', label: 'Lifestyle Tags', type: 'multi-select' as const, options: ['fitness', 'travel', 'music', 'reading', 'cooking', 'sports', 'movies'] }
  ];

  const partnerPreferenceFields = [
    { key: 'age_min', label: 'Minimum Age', type: 'number' as const },
    { key: 'age_max', label: 'Maximum Age', type: 'number' as const },
    { key: 'height_min_cm', label: 'Minimum Height (cm)', type: 'number' as const },
    { key: 'height_max_cm', label: 'Maximum Height (cm)', type: 'number' as const },
    { key: 'marital_statuses', label: 'Marital Status', type: 'multi-select' as const, options: ['never_married', 'divorced', 'widowed'] },
    { key: 'religions', label: 'Religions', type: 'multi-select' as const, options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'] },
    { key: 'communities', label: 'Communities', type: 'multi-select' as const, options: ['Brahmin', 'Kshatriya', 'Vaishya', 'Other'] },
    { key: 'mother_tongues', label: 'Mother Tongues', type: 'multi-select' as const, options: ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Bengali'] },
    { key: 'countries', label: 'Countries', type: 'multi-select' as const, options: ['India', 'Australia', 'USA', 'UK', 'Canada'] },
    { key: 'education_levels', label: 'Education Levels', type: 'multi-select' as const, options: ['Bachelor', 'Master', 'PhD', 'Diploma'] },
    { key: 'willing_to_relocate', label: 'Willing to Relocate?', type: 'select' as const, options: ['yes', 'same_country', 'no'] },
    { key: 'lifestyle_preferences', label: 'Lifestyle Preferences', type: 'multi-select' as const, options: ['non_smoker', 'non_drinker', 'vegetarian', 'fitness_oriented', 'family_oriented', 'career_oriented'] },
    { key: 'deal_breakers', label: 'Deal Breakers (Optional)', type: 'textarea' as const }
  ];

  return (
    <SidebarProvider>
      {/* Floral Branding for Account Pages */}
      <FloralBranding variant="account" />
      
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          {/* REPLACED INLINE HEADER WITH ACCOUNTHEADER */}
          <AccountHeader
            title="Profile"
            description="Manage your profile information"
            icon={User}
            backUrl="/account"
            backText="Back to Dashboard"
          >
            {/* ACTION BUTTONS AS CHILDREN */}
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => {
                const profileId = profileData.profile_id;
                window.open(`/profile/${profileId}`, '_blank');
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Preview Profile</span>
              <span className="sm:hidden">Preview</span>
            </Button>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link to="/account/photos">
                <Camera className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Manage Photos</span>
                <span className="sm:hidden">Photos</span>
              </Link>
            </Button>
          </AccountHeader>

          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto py-4 lg:py-8">

              {/* Profile Summary Card - Mobile Optimized */}
              <div className="mb-6">
                <Card>
                  <CardContent className="pt-4 lg:pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="h-16 w-16 lg:h-20 lg:w-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <Camera className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg lg:text-xl font-semibold truncate">
                          {profileData.first_name} {profileData.last_name}
                        </h2>
                        <p className="text-muted-foreground text-sm lg:text-base">
                          Profile ID: {profileData.profile_id}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant={profileData.profile_ready ? "default" : "secondary"} className="text-xs">
                            {profileData.profile_ready ? "Complete" : "Incomplete"}
                          </Badge>
                          {profileData.onboarding_completed && (
                            <Badge variant="outline" className="text-xs">Verified</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                          <Link to="/account/photos">
                            <Camera className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Edit Photos</span>
                            <span className="sm:hidden">Edit</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Completion Tracker */}
              <ProfileCompletionTracker 
                profileData={profileData}
                onSectionClick={(sectionKey) => {
                  // Scroll to relevant section
                  const element = document.getElementById(sectionKey);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />

              {/* Main Content Grid - Mobile Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                
                {/* Left Column - Personal Details */}
                <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                  
                  {/* Basic & Lifestyle */}
                  <EditableProfileSection
                    title="Basic & Lifestyle"
                    icon={Users}
                    data={profileData}
                    fields={basicFields}
                    onSave={handleProfileUpdate}
                  />

                  {/* Religious Background */}
                  <EditableProfileSection
                    title="Religious Background"
                    icon={Star}
                    data={profileData}
                    fields={religiousFields}
                    onSave={handleProfileUpdate}
                  />

                  {/* Enhanced Astro Details with section ID */}
                  <div id="astro">
                    <EditableProfileSection
                      title="Astro Details"
                      icon={Star}
                      data={profileData}
                      fields={astroFields}
                      onSave={handleProfileUpdate}
                    />
                  </div>

                  {/* Family Details */}
                  <EditableProfileSection
                    title="Family Details"
                    icon={Home}
                    data={profileData}
                    fields={familyFields}
                    onSave={handleProfileUpdate}
                  />

                  {/* Education & Career */}
                  <EditableProfileSection
                    title="Education & Career"
                    icon={GraduationCap}
                    data={profileData}
                    fields={educationFields}
                    onSave={handleProfileUpdate}
                  />

                  {/* Location & Status */}
                  <EditableProfileSection
                    title="Location & Status"
                    icon={MapPin}
                    data={profileData}
                    fields={locationFields}
                    onSave={handleProfileUpdate}
                  />

                  {/* About Me */}
                  <EditableProfileSection
                    title="About Me"
                    icon={Users}
                    data={profileData}
                    fields={aboutFields}
                    onSave={handleProfileUpdate}
                  />
                </div>

                {/* Right Column - Partner Preferences & Contact */}
                <div className="space-y-4 lg:space-y-6">
                  
                  {/* Enhanced Partner Preferences with section ID */}
                  <div id="partner_preferences">
                    <EditableProfileSection
                      title="Detailed Partner Preferences"
                      icon={Heart}
                      data={preferences}
                      fields={partnerPreferenceFields}
                      onSave={handlePreferencesUpdate}
                    />
                  </div>

                  {/* My Contact Detail */}
                  <Card>
                    <CardHeader className="pb-3 lg:pb-4">
                      <CardTitle className="text-lg lg:text-xl">My Contact Detail</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 lg:space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="font-medium text-sm lg:text-base truncate">{user?.email}</p>
                        <Badge 
                          variant={profileData.email_verified ? "default" : "secondary"} 
                          className="mt-1 text-xs"
                        >
                          {profileData.email_verified ? "Verified" : "Not Verified"}
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                        <p className="font-medium text-sm lg:text-base">Not provided</p>
                        <Badge variant="secondary" className="mt-1 text-xs">Not Verified</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}