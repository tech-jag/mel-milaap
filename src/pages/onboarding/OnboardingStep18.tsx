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
  location_countries: z.string().optional(),
  location_states: z.string().optional(),
  location_cities: z.string().optional(),
});

export default function OnboardingStep18() {
  const navigate = useNavigate();
  const { partnerPreferences, updatePartnerPreferences } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location_countries: partnerPreferences?.location_countries?.join(', ') || '',
      location_states: partnerPreferences?.location_states?.join(', ') || '',
      location_cities: partnerPreferences?.location_cities?.join(', ') || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        location_countries: values.location_countries 
          ? values.location_countries.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        location_states: values.location_states 
          ? values.location_states.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        location_cities: values.location_cities 
          ? values.location_cities.split(',').map(item => item.trim()).filter(Boolean)
          : [],
      };
      
      await updatePartnerPreferences.mutateAsync(payload);
      navigate('/onboarding/19');
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
      currentStep={18}
      title="Partner Preferences - Location"
      subtitle="Specify your location preferences for your ideal partner"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="location_countries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Countries (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., India, United States, Canada (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all countries
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location_states"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred States/Provinces (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Maharashtra, Tamil Nadu, California (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all states/provinces
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location_cities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Cities (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Mumbai, Delhi, Chennai, Bangalore (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Leave blank to include all cities
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Location preferences help you find matches in your preferred areas. 
              You can specify multiple locations to cast a wider net, or leave blank for worldwide search.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/17')}>
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