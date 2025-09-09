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
import { Textarea } from '@/components/ui/textarea';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  family_type: z.enum(['nuclear', 'joint', 'other']).optional(),
  family_values: z.enum(['traditional', 'moderate', 'liberal', 'other']).optional(),
  father_occupation: z.string().optional(),
  mother_occupation: z.string().optional(),
  siblings_brothers: z.string().optional(),
  siblings_sisters: z.string().optional(),
  family_living_in: z.string().optional(),
  family_about: z.string().optional(),
});

export default function OnboardingStep13() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      family_type: userProfile?.family_type || undefined,
      family_values: userProfile?.family_values || undefined,
      father_occupation: userProfile?.father_occupation || '',
      mother_occupation: userProfile?.mother_occupation || '',
      siblings_brothers: userProfile?.siblings_brothers?.toString() || '',
      siblings_sisters: userProfile?.siblings_sisters?.toString() || '',
      family_living_in: userProfile?.family_living_in || '',
      family_about: userProfile?.family_about || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        family_type: values.family_type,
        family_values: values.family_values,
        father_occupation: values.father_occupation,
        mother_occupation: values.mother_occupation,
        siblings_brothers: values.siblings_brothers ? parseInt(values.siblings_brothers) : undefined,
        siblings_sisters: values.siblings_sisters ? parseInt(values.siblings_sisters) : undefined,
        family_living_in: values.family_living_in,
        family_about: values.family_about,
      };
      
      await updateUserProfile.mutateAsync(payload);
      navigate('/onboarding/14');
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
      currentStep={13}
      title="Family Background"
      subtitle="Tell us about your family"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="family_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select family type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nuclear">Nuclear Family</SelectItem>
                    <SelectItem value="joint">Joint Family</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="family_values"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Values</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select family values" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="traditional">Traditional</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="liberal">Liberal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="father_occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Occupation (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter father's occupation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mother_occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother's Occupation (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mother's occupation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="siblings_brothers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Brothers (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siblings_sisters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Sisters (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="family_living_in"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Lives In (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city/country where family lives" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="family_about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Family (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your family background and values..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/12')}>
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