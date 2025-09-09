import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  lifestyle_diet: z.string().optional(),
  lifestyle_drinking: z.string().optional(),
  lifestyle_smoking: z.string().optional(),
  additional: z.string().optional(),
});

export default function OnboardingStep20() {
  const navigate = useNavigate();
  const { partnerPreferences, updatePartnerPreferences } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lifestyle_diet: partnerPreferences?.lifestyle_diet?.join(', ') || '',
      lifestyle_drinking: partnerPreferences?.lifestyle_drinking?.join(', ') || '',
      lifestyle_smoking: partnerPreferences?.lifestyle_smoking?.join(', ') || '',
      additional: partnerPreferences?.additional || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        lifestyle_diet: values.lifestyle_diet 
          ? values.lifestyle_diet.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        lifestyle_drinking: values.lifestyle_drinking 
          ? values.lifestyle_drinking.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        lifestyle_smoking: values.lifestyle_smoking 
          ? values.lifestyle_smoking.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        additional: values.additional,
      };
      
      await updatePartnerPreferences.mutateAsync(payload);
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
                  <Input 
                    placeholder="e.g., Vegetarian, Non-Vegetarian, Vegan (comma-separated)" 
                    {...field} 
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
                  <Input 
                    placeholder="e.g., No, Occasionally, Yes (comma-separated)" 
                    {...field} 
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
                  <Input 
                    placeholder="e.g., No, Occasionally, Yes (comma-separated)" 
                    {...field} 
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