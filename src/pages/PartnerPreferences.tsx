import React, { useState, useEffect } from 'react';
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Heart, MapPin, GraduationCap, Briefcase, Globe, Calendar, Ruler, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function PartnerPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setPreferences(data || {});
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load partner preferences",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const updatePreferences = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('partner_preferences')
        .upsert({ user_id: user?.id, ...updates })
        .eq('user_id', user?.id);

      if (error) throw error;

      setPreferences({ ...preferences, ...updates });
      setEditingSection(null);
      
      toast({
        title: "Success",
        description: "Partner preferences updated successfully",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error", 
        description: "Failed to update partner preferences",
        variant: "destructive"
      });
    }
  };

  const PreferenceSection = ({ title, icon: Icon, sectionKey, children }: any) => (
    <Card className="luxury-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            {title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingSection(editingSection === sectionKey ? null : sectionKey)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {editingSection === sectionKey ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AccountSidebar />
          
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link to="/account">
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                
                <div>
                  <Badge variant="outline" className="mb-2">Partner Preferences</Badge>
                  <h1 className="text-3xl font-heading font-bold text-foreground">Your Partner Preferences</h1>
                  <p className="text-muted-foreground">You will see Matches based on Preferences you have set</p>
                  <p className="text-sm text-muted-foreground italic">Tap on the field to edit</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Basic Details */}
                <PreferenceSection title="Basic Details" icon={User} sectionKey="basic">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">Age Range</div>
                          <div className="text-muted-foreground">
                            {preferences.age_min && preferences.age_max 
                              ? `${preferences.age_min} to ${preferences.age_max}` 
                              : 'Not specified'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <Ruler className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">Height Range</div>
                          <div className="text-muted-foreground">
                            {preferences.height_min_cm && preferences.height_max_cm
                              ? `${Math.floor(preferences.height_min_cm/30.48)}'${Math.round((preferences.height_min_cm%30.48)/2.54)}" to ${Math.floor(preferences.height_max_cm/30.48)}'${Math.round((preferences.height_max_cm%30.48)/2.54)}"`
                              : 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {editingSection === 'basic' && (
                      <div className="mt-6 p-6 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Min Age</Label>
                            <Input 
                              type="number" 
                              defaultValue={preferences.age_min}
                              onChange={(e) => setPreferences({...preferences, age_min: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <Label>Max Age</Label>
                            <Input 
                              type="number" 
                              defaultValue={preferences.age_max}
                              onChange={(e) => setPreferences({...preferences, age_max: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Min Height (cm)</Label>
                            <Input 
                              type="number" 
                              defaultValue={preferences.height_min_cm}
                              onChange={(e) => setPreferences({...preferences, height_min_cm: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <Label>Max Height (cm)</Label>
                            <Input 
                              type="number" 
                              defaultValue={preferences.height_max_cm}
                              onChange={(e) => setPreferences({...preferences, height_max_cm: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                        <Button onClick={() => updatePreferences({
                          age_min: preferences.age_min,
                          age_max: preferences.age_max,
                          height_min_cm: preferences.height_min_cm,
                          height_max_cm: preferences.height_max_cm
                        })}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </PreferenceSection>

                {/* Community */}
                <PreferenceSection title="Community" icon={Heart} sectionKey="community">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <span className="text-lg">🕉️</span>
                        <div className="flex-1">
                          <div className="font-medium">Religion</div>
                          <div className="text-muted-foreground">
                            {preferences.religions?.join(', ') || 'Open to All'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <span className="text-lg">👥</span>
                        <div className="flex-1">
                          <div className="font-medium">Community</div>
                          <div className="text-muted-foreground">
                            {preferences.communities?.join(', ') || 'Open to All'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <span className="text-lg">🗣️</span>
                        <div className="flex-1">
                          <div className="font-medium">Mother Tongue</div>
                          <div className="text-muted-foreground">
                            {preferences.mother_tongues?.join(', ') || 'Open to All'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {editingSection === 'community' && (
                      <div className="mt-6 p-6 bg-muted/50 rounded-lg">
                        <div className="space-y-4">
                          <div>
                            <Label>Religions (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.religions?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, religions: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                          <div>
                            <Label>Communities (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.communities?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, communities: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                          <div>
                            <Label>Mother Tongues (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.mother_tongues?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, mother_tongues: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                        </div>
                        <Button className="mt-4" onClick={() => updatePreferences({
                          religions: preferences.religions,
                          communities: preferences.communities,
                          mother_tongues: preferences.mother_tongues
                        })}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </PreferenceSection>

                {/* Location */}
                <PreferenceSection title="Location" icon={MapPin} sectionKey="location">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <Globe className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">Country living in</div>
                          <div className="text-muted-foreground">
                            {preferences.countries?.join(', ') || 'Australia, India'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">State living in</div>
                          <div className="text-muted-foreground">
                            {preferences.states?.join(', ') || 'Open to All'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {editingSection === 'location' && (
                      <div className="mt-6 p-6 bg-muted/50 rounded-lg">
                        <div className="space-y-4">
                          <div>
                            <Label>Countries (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.countries?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, countries: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                          <div>
                            <Label>States (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.states?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, states: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                          <div>
                            <Label>Cities (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.cities?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, cities: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                        </div>
                        <Button className="mt-4" onClick={() => updatePreferences({
                          countries: preferences.countries,
                          states: preferences.states,
                          cities: preferences.cities
                        })}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </PreferenceSection>

                {/* Education & Career */}
                <PreferenceSection title="Education & Career" icon={GraduationCap} sectionKey="career">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">Education Level</div>
                          <div className="text-muted-foreground">
                            {preferences.education_levels?.join(', ') || 'Open to All'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">Profession</div>
                          <div className="text-muted-foreground">
                            {preferences.professions?.join(', ') || 'Open to All'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {editingSection === 'career' && (
                      <div className="mt-6 p-6 bg-muted/50 rounded-lg">
                        <div className="space-y-4">
                          <div>
                            <Label>Education Levels (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.education_levels?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, education_levels: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                          <div>
                            <Label>Professions (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.professions?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, professions: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                          <div>
                            <Label>Industries (comma separated)</Label>
                            <Input 
                              defaultValue={preferences.industries?.join(', ')}
                              onChange={(e) => setPreferences({...preferences, industries: e.target.value.split(',').map(s => s.trim())})}
                            />
                          </div>
                        </div>
                        <Button className="mt-4" onClick={() => updatePreferences({
                          education_levels: preferences.education_levels,
                          professions: preferences.professions,
                          industries: preferences.industries
                        })}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </PreferenceSection>

                {/* Additional Notes */}
                <PreferenceSection title="Additional Preferences" icon={Heart} sectionKey="notes">
                  <div className="space-y-4">
                    <div className="bg-secondary/30 p-6 rounded-lg">
                      <div className="font-medium mb-2">Special Notes</div>
                      <div className="text-muted-foreground">
                        {preferences.notes || 'No additional preferences specified'}
                      </div>
                    </div>
                    
                    {editingSection === 'notes' && (
                      <div className="mt-6 p-6 bg-muted/50 rounded-lg">
                        <div>
                          <Label>Additional Notes</Label>
                          <Textarea 
                            defaultValue={preferences.notes}
                            onChange={(e) => setPreferences({...preferences, notes: e.target.value})}
                            placeholder="Any additional preferences or requirements..."
                            rows={4}
                          />
                        </div>
                        <Button className="mt-4" onClick={() => updatePreferences({
                          notes: preferences.notes
                        })}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </PreferenceSection>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}