import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  religions: z.array(z.string()).optional(),
  communities: z.array(z.string()).optional(),
  mother_tongues: z.array(z.string()).optional(),
});

const religionOptions = [
  { value: 'hinduism', label: 'Hinduism' },
  { value: 'islam', label: 'Islam' },
  { value: 'christianity', label: 'Christianity' },
  { value: 'sikhism', label: 'Sikhism' },
  { value: 'buddhism', label: 'Buddhism' },
  { value: 'jainism', label: 'Jainism' },
  { value: 'judaism', label: 'Judaism' },
  { value: 'zoroastrianism', label: 'Zoroastrianism' },
  { value: 'other', label: 'Other' },
];

const communityOptions = [
  { value: 'brahmin', label: 'Brahmin' },
  { value: 'kshatriya', label: 'Kshatriya' },
  { value: 'vaishya', label: 'Vaishya' },
  { value: 'shudra', label: 'Shudra' },
  { value: 'reddy', label: 'Reddy' },
  { value: 'chettiar', label: 'Chettiar' },
  { value: 'naidu', label: 'Naidu' },
  { value: 'pillai', label: 'Pillai' },
  { value: 'patel', label: 'Patel' },
  { value: 'shah', label: 'Shah' },
  { value: 'gupta', label: 'Gupta' },
  { value: 'agarwal', label: 'Agarwal' },
  { value: 'sharma', label: 'Sharma' },
  { value: 'other', label: 'Other' },
];

const motherTongueOptions = [
  { value: 'hindi', label: 'Hindi' },
  { value: 'english', label: 'English' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'odia', label: 'Odia' },
  { value: 'assamese', label: 'Assamese' },
  { value: 'other', label: 'Other' },
];

interface MultiSelectFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({ value, onChange, options, placeholder }) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value || []);

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

export default function OnboardingStep17() {
  const navigate = useNavigate();
  const { partnerPreferences, updatePartnerPreferences } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      religions: partnerPreferences?.religions || [],
      communities: partnerPreferences?.communities || [],
      mother_tongues: partnerPreferences?.mother_tongues || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updatePartnerPreferences.mutateAsync(values);
      navigate('/onboarding/18');
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
      currentStep={17}
      title="Partner Preferences - Culture"
      subtitle="Specify your preferences for religion, community, and language"
      hideNavigation={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="religions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Religions (Optional)</FormLabel>
                <FormControl>
                  <MultiSelectField
                    value={field.value || []}
                    onChange={field.onChange}
                    options={religionOptions}
                    placeholder="Select religions"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all religions
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Communities (Optional)</FormLabel>
                <FormControl>
                  <MultiSelectField
                    value={field.value || []}
                    onChange={field.onChange}
                    options={communityOptions}
                    placeholder="Select communities"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all communities
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_tongues"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Mother Tongues (Optional)</FormLabel>
                <FormControl>
                  <MultiSelectField
                    value={field.value || []}
                    onChange={field.onChange}
                    options={motherTongueOptions}
                    placeholder="Select languages"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all languages
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/10">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> These preferences help narrow down your search. 
              You can always update these later or leave them blank for broader results.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/16')}>
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