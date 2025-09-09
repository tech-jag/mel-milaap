import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, Users } from 'lucide-react';
import { OnboardingData } from '@/hooks/useOnboarding';

interface Step0WelcomeProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export function Step0Welcome({ data, onUpdate }: Step0WelcomeProps) {
  const [showRelation, setShowRelation] = useState(data.profile_manager !== 'self');

  const handleManagerChange = (value: string) => {
    const isNotSelf = value !== 'self';
    setShowRelation(isNotSelf);
    onUpdate({ 
      profile_manager: value as any,
      manager_relation: isNotSelf ? data.manager_relation : undefined
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground">
          Let's start by understanding who will be managing this profile.
        </p>
      </div>

      <RadioGroup
        value={data.profile_manager || 'self'}
        onValueChange={handleManagerChange}
        className="grid grid-cols-1 gap-4"
      >
        <Card className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <CardContent className="flex items-center space-x-3 p-4">
            <RadioGroupItem value="self" id="self" />
            <Label htmlFor="self" className="flex items-center space-x-3 cursor-pointer flex-1">
              <User className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">I'm creating my own profile</div>
                <div className="text-sm text-muted-foreground">
                  This profile is for me
                </div>
              </div>
            </Label>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <CardContent className="flex items-center space-x-3 p-4">
            <RadioGroupItem value="parent" id="parent" />
            <Label htmlFor="parent" className="flex items-center space-x-3 cursor-pointer flex-1">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">I'm a parent creating for my son/daughter</div>
                <div className="text-sm text-muted-foreground">
                  This profile is for my child
                </div>
              </div>
            </Label>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <CardContent className="flex items-center space-x-3 p-4">
            <RadioGroupItem value="sibling" id="sibling" />
            <Label htmlFor="sibling" className="flex items-center space-x-3 cursor-pointer flex-1">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">I'm a sibling creating this profile</div>
                <div className="text-sm text-muted-foreground">
                  This profile is for my brother/sister
                </div>
              </div>
            </Label>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <CardContent className="flex items-center space-x-3 p-4">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other" className="flex items-center space-x-3 cursor-pointer flex-1">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Other family member</div>
                <div className="text-sm text-muted-foreground">
                  I'm helping someone else create their profile
                </div>
              </div>
            </Label>
          </CardContent>
        </Card>
      </RadioGroup>

      {showRelation && (
        <div className="mt-4">
          <Label htmlFor="relation">What is your relationship to this person?</Label>
          <Input
            id="relation"
            value={data.manager_relation || ''}
            onChange={(e) => onUpdate({ manager_relation: e.target.value })}
            placeholder="e.g., Uncle, Aunt, Cousin, Friend"
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
}