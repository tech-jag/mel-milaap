import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  marital_statuses: z.string().optional(),
  has_children: z.enum(['yes', 'no', 'unknown']).optional(),
});

const maritalStatusOptions = [
  { value: 'never_married', label: 'Never Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'annulled', label: 'Annulled' },
];

export default function OnboardingStep16() {
  const navigate = useNavigate();
  const { partnerPreferences, updatePartnerPreferences } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marital_statuses: partnerPreferences?.marital_statuses?.[0] || '',
      has_children: partnerPreferences?.has_children || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        marital_statuses: values.marital_statuses ? [values.marital_statuses] : [],
        has_children: values.has_children,
      };
      
      await updatePartnerPreferences.mutateAsync(payload);
      navigate('/onboarding/17');
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
      currentStep={16}
      title="Partner Preferences - Marital Status"
      subtitle="Specify your preferences for marital status and children"
      hideNavigation={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="marital_statuses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acceptable Marital Status (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred marital status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No preference</SelectItem>
                    <SelectItem value="never_married">Never Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="annulled">Annulled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  Select your preferred marital status for your partner
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_children"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner Having Children (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no">No children preferred</SelectItem>
                    <SelectItem value="yes">Okay with children</SelectItem>
                    <SelectItem value="unknown">No preference</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> These preferences help filter potential matches. 
              Leaving options unselected means you're open to all possibilities in that category.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/15')}>
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