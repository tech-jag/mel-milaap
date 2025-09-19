import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  education_levels: z.string().optional(),
  professions: z.string().optional(),
});

export default function OnboardingStep19() {
  const navigate = useNavigate();
  const { partnerPreferences, updatePartnerPreferences } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education_levels: partnerPreferences?.education_levels?.join(', ') || '',
      professions: partnerPreferences?.professions?.join(', ') || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        education_levels: values.education_levels 
          ? values.education_levels.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        professions: values.professions 
          ? values.professions.split(',').map(item => item.trim()).filter(Boolean)
          : [],
      };
      
      await updatePartnerPreferences.mutateAsync(payload);
      navigate('/onboarding/20');
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
      currentStep={19}
      title="Partner Preferences - Education & Career"
      subtitle="Specify your preferences for education and professional background"
      hideNavigation={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="education_levels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Education Levels (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Bachelor's Degree, Master's Degree, PhD (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all education levels
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Occupations (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Software Engineer, Doctor, Teacher, Business Owner (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all occupations
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> These preferences help you find partners with compatible educational 
              and professional backgrounds. Being flexible with these criteria can help you discover 
              great matches you might not have initially considered.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/18')}>
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