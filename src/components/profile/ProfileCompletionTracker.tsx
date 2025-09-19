import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { calculateProfileCompletion } from "@/utils/profileCompletion";

interface ProfileCompletionTrackerProps {
  profileData: any;
  onSectionClick?: (sectionKey: string) => void;
}

export function ProfileCompletionTracker({ profileData, onSectionClick }: ProfileCompletionTrackerProps) {
  const calculateCompletionPercentage = () => {
    return calculateProfileCompletion(profileData);
  };

  const getIncompleteSections = () => {
    const sections = [
      {
        key: 'basic_info',
        label: 'Add Photos',
        condition: !profileData.photos || profileData.photos.length === 0,
        action: () => window.location.href = '/account/photos'
      },
      {
        key: 'religious',
        label: 'Religious Details',
        condition: !profileData.religion || !profileData.community,
        action: () => onSectionClick?.('religious')
      },
      {
        key: 'family',
        label: 'Family Details',
        condition: !profileData.father_occupation || !profileData.family_type,
        action: () => onSectionClick?.('family')
      },
      {
        key: 'education',
        label: 'Education & Career',
        condition: !profileData.education_level || !profileData.occupation,
        action: () => onSectionClick?.('education')
      },
      {
        key: 'about_me',
        label: 'About Me',
        condition: !profileData.about_me || profileData.about_me.length < 50,
        action: () => onSectionClick?.('about_me')
      }
    ];
    
    return sections.filter(section => section.condition);
  };

  const completionPercentage = calculateCompletionPercentage();
  const incompleteSections = getIncompleteSections();

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg lg:text-xl">Profile Strength</h3>
          <Badge variant={completionPercentage >= 90 ? 'default' : 'secondary'} className="text-xs lg:text-sm">
            {completionPercentage}% Complete
          </Badge>
        </div>
        
        <Progress value={completionPercentage} className="mb-4 h-2" />
        
        {/* Missing items */}
        {incompleteSections.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Complete these to improve your profile visibility:</p>
            <div className="flex flex-wrap gap-2">
              {incompleteSections.map(section => (
                <Button 
                  key={section.key} 
                  variant="outline" 
                  size="sm" 
                  onClick={section.action}
                  className="text-xs lg:text-sm"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {section.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {completionPercentage >= 90 && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">🎉 Excellent! Your profile is highly complete and will attract more quality matches.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}