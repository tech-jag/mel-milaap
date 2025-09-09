import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  mother_tongue: z.string().min(1, 'Mother tongue is required'),
  languages_spoken: z.string().optional(),
});

const motherTongues = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 
  'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Odia', 'Assamese', 'Other'
];

export default function OnboardingStep7() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mother_tongue: userProfile?.mother_tongue || '',
      languages_spoken: userProfile?.languages_spoken?.join(', ') || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const languages = values.languages_spoken 
        ? values.languages_spoken.split(',').map(lang => lang.trim()).filter(Boolean)
        : [];
      
      await updateUserProfile.mutateAsync({
        mother_tongue: values.mother_tongue,
        languages_spoken: languages,
      });
      navigate('/onboarding/8');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <OnboardingLayout
      currentStep={7}
      title="Languages"
      subtitle="Tell us about the languages you speak"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="mother_tongue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother Tongue</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mother tongue" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {motherTongues.map((tongue) => (
                      <SelectItem key={tongue} value={tongue}>
                        {tongue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="languages_spoken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Languages Spoken (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., English, Hindi, Tamil (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/6')}>
              Previous
            </Button>
            <Button type="submit" disabled={updateUserProfile.isPending}>
              {updateUserProfile.isPending ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </OnboardingLayout>
  );
}