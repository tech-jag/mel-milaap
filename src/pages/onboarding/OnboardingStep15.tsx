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
  age_min: z.string().optional(),
  age_max: z.string().optional(),
  height_min_cm: z.string().optional(),
  height_max_cm: z.string().optional(),
});

export default function OnboardingStep15() {
  const navigate = useNavigate();
  const { partnerPreferences, updatePartnerPreferences } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age_min: partnerPreferences?.age_min?.toString() || '',
      age_max: partnerPreferences?.age_max?.toString() || '',
      height_min_cm: partnerPreferences?.height_min_cm?.toString() || '',
      height_max_cm: partnerPreferences?.height_max_cm?.toString() || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        age_min: values.age_min ? parseInt(values.age_min) : undefined,
        age_max: values.age_max ? parseInt(values.age_max) : undefined,
        height_min_cm: values.height_min_cm ? parseInt(values.height_min_cm) : undefined,
        height_max_cm: values.height_max_cm ? parseInt(values.height_max_cm) : undefined,
      };
      
      await updatePartnerPreferences.mutateAsync(payload);
      navigate('/onboarding/16');
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
      currentStep={15}
      title="Partner Preferences - Basic"
      subtitle="Tell us about your ideal partner's age and height preferences"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Age (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="18" min="18" max="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Age (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="60" min="18" max="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="height_min_cm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Height (cm) (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="150" min="120" max="250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height_max_cm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Height (cm) (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="200" min="120" max="250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> These preferences are optional and help us show you more relevant matches. 
              You can always update these later or leave them blank for broader search results.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/14')}>
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