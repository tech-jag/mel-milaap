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
  religions: z.string().optional(),
  communities: z.string().optional(),
  mother_tongues: z.string().optional(),
});

export default function OnboardingStep17() {
  const navigate = useNavigate();
  const { partnerPreferences, updatePartnerPreferences } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      religions: partnerPreferences?.religions?.join(', ') || '',
      communities: partnerPreferences?.communities?.join(', ') || '',
      mother_tongues: partnerPreferences?.mother_tongues?.join(', ') || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        religions: values.religions 
          ? values.religions.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        communities: values.communities 
          ? values.communities.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        mother_tongues: values.mother_tongues 
          ? values.mother_tongues.split(',').map(item => item.trim()).filter(Boolean)
          : [],
      };
      
      await updatePartnerPreferences.mutateAsync(payload);
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
                  <Input 
                    placeholder="e.g., Hindu, Christian, Muslim (comma-separated)" 
                    {...field} 
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
                  <Input 
                    placeholder="e.g., Brahmin, Kshatriya, Reddy (comma-separated)" 
                    {...field} 
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
                  <Input 
                    placeholder="e.g., Hindi, Tamil, Telugu (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all languages
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/50 p-4 rounded-lg">
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