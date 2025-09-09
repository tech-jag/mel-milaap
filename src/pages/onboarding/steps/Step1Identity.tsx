import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { OnboardingData } from '@/hooks/useOnboarding';

interface Step1IdentityProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export function Step1Identity({ data, onUpdate }: Step1IdentityProps) {
  const selectedDate = data.dob ? new Date(data.dob) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onUpdate({ dob: format(date, 'yyyy-MM-dd') });
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground">
          Tell us about yourself to get started with your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={data.first_name || ''}
            onChange={(e) => onUpdate({ first_name: e.target.value })}
            placeholder="Enter your first name"
            autoComplete="given-name"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={data.last_name || ''}
            onChange={(e) => onUpdate({ last_name: e.target.value })}
            placeholder="Enter your last name"
            autoComplete="family-name"
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label>Gender *</Label>
        <Select value={data.gender || ''} onValueChange={(value) => onUpdate({ gender: value })}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non_binary">Non-binary</SelectItem>
            <SelectItem value="prefer_not_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Date of Birth *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                <span>
                  {format(selectedDate, "PPP")} 
                  {selectedDate && ` (Age: ${calculateAge(selectedDate)})`}
                </span>
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const age = calculateAge(date);
                return date > new Date() || age < 18 || age > 100;
              }}
              initialFocus
              className="p-3 pointer-events-auto"
              defaultMonth={new Date(1995, 0)}
            />
          </PopoverContent>
        </Popover>
        {selectedDate && calculateAge(selectedDate) < 18 && (
          <p className="text-sm text-destructive mt-1">
            You must be at least 18 years old to create a profile.
          </p>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mt-6">
        <p className="text-sm text-muted-foreground">
          <strong>Why we ask this:</strong> This basic information helps us create your profile 
          and find compatible matches in your age group and location.
        </p>
      </div>
    </div>
  );
}