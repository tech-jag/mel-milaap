import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  lifestyle_diet: z.array(z.string()).optional(),
  lifestyle_drinking: z.array(z.string()).optional(),
  lifestyle_smoking: z.array(z.string()).optional(),
  additional: z.string().optional(),
});

const dietOptions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'non_vegetarian', label: 'Non-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'eggetarian', label: 'Eggetarian' },
  { value: 'halal', label: 'Halal' },
  { value: 'jain_vegetarian', label: 'Jain Vegetarian' },
  { value: 'no_preference', label: 'No Preference' },
];

const drinkingOptions = [
  { value: 'never', label: 'Never' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'socially', label: 'Socially' },
  { value: 'regularly', label: 'Regularly' },
  { value: 'no_preference', label: 'No Preference' },
];

const smokingOptions = [
  { value: 'never', label: 'Never' },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'socially', label: 'Socially' },
  { value: 'regularly', label: 'Regularly' },
  { value: 'no_preference', label: 'No Preference' },
];

interface MultiSelectFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({ value, onChange, options, placeholder }) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value || []);

  React.useEffect(() => {
    setSelectedValues(value || []);
  }, [value]);

  const handleSelect = (selectedValue: string) => {
    if (!selectedValues.includes(selectedValue)) {
      const newValues = [...selectedValues, selectedValue];
      setSelectedValues(newValues);
      onChange(newValues);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.filter(option => !selectedValues.includes(option.value)).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge key={value} variant="secondary" className="flex items-center gap-1">
                {option?.label}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleRemove(value)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function OnboardingStep20() {
  const navigate = useNavigate();
  const { partnerPreferences, updatePartnerPreferences } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lifestyle_diet: partnerPreferences?.lifestyle_diet || [],
      lifestyle_drinking: partnerPreferences?.lifestyle_drinking || [],
      lifestyle_smoking: partnerPreferences?.lifestyle_smoking || [],
      additional: partnerPreferences?.additional || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updatePartnerPreferences.mutateAsync(values);
      navigate('/onboarding/21');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <OnboardingLayout
      currentStep={20}
      title="Partner Preferences - Lifestyle"
      subtitle="Share your lifestyle preferences for your ideal partner"
      hideNavigation={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="lifestyle_diet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Diet Types (Optional)</FormLabel>
                <FormControl>
                  <MultiSelectField
                    value={field.value || []}
                    onChange={field.onChange}
                    options={dietOptions}
                    placeholder="Select diet preferences"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all diet preferences
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lifestyle_drinking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drinking Preferences (Optional)</FormLabel>
                <FormControl>
                  <MultiSelectField
                    value={field.value || []}
                    onChange={field.onChange}
                    options={drinkingOptions}
                    placeholder="Select drinking preferences"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all drinking preferences
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lifestyle_smoking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Smoking Preferences (Optional)</FormLabel>
                <FormControl>
                  <MultiSelectField
                    value={field.value || []}
                    onChange={field.onChange}
                    options={smokingOptions}
                    placeholder="Select smoking preferences"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all smoking preferences
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Preferences (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share any additional preferences or qualities you're looking for in your ideal partner..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Lifestyle preferences help ensure compatibility with your daily habits 
              and values. Remember, being open to different lifestyles can lead to wonderful discoveries 
              about potential partners.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/19')}>
              Previous
            </Button>
            <Button type="submit" disabled={updatePartnerPreferences.isPending}>
              {updatePartnerPreferences.isPending ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </OnboardingLayout>
  );
}