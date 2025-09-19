import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const onboardingSteps = [
  { step: 1, title: 'Welcome' },
  { step: 2, title: 'Profile Photo' },
  { step: 3, title: 'Basic Information' },
  { step: 4, title: 'Additional Details' },
  { step: 5, title: 'About You' },
  { step: 6, title: 'Lifestyle' },
  { step: 7, title: 'Education & Career' },
  { step: 8, title: 'Family Background' },
  { step: 9, title: 'Health & Habits' },
  { step: 10, title: 'Hobbies & Interests' },
  { step: 11, title: 'Values & Beliefs' },
  { step: 12, title: 'Contact & Social Media' },
  { step: 13, title: 'Verification' },
  { step: 14, title: 'Partner Preferences - Age' },
  { step: 15, title: 'Partner Preferences - Physical' },
  { step: 16, title: 'Partner Preferences - Marital Status' },
  { step: 17, title: 'Partner Preferences - Education' },
  { step: 18, title: 'Partner Preferences - Location' },
  { step: 19, title: 'Partner Preferences - Lifestyle' },
  { step: 20, title: 'Partner Preferences - Family' },
  { step: 21, title: 'Partner Preferences - Values' },
  { step: 22, title: 'Subscription Plan' },
  { step: 23, title: 'Complete' },
];

export default function DevOnboarding() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Steps - Development Access</CardTitle>
          <p className="text-muted-foreground">
            Quick access to individual onboarding steps for testing and development
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {onboardingSteps.map(({ step, title }) => (
              <Button
                key={step}
                variant="outline"
                asChild
                className="h-auto p-4 text-left flex-col items-start"
              >
                <Link to={`/onboarding/${step}`}>
                  <span className="font-semibold">Step {step}</span>
                  <span className="text-sm text-muted-foreground">{title}</span>
                </Link>
              </Button>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <Button asChild variant="default">
                <Link to="/onboarding/1">Start Onboarding</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}