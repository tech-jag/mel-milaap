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
  education_level: z.string().min(1, 'Education level is required'),
  field_of_study: z.string().optional(),
  university: z.string().optional(),
});

const educationLevels = [
  'High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 
  'PhD/Doctorate', 'Professional Degree', 'Other'
];

export default function OnboardingStep10() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education_level: userProfile?.education_level || '',
      field_of_study: userProfile?.field_of_study || '',
      university: userProfile?.university || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateUserProfile.mutateAsync(values);
      navigate('/onboarding/11');
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
      currentStep={10}
      title="Education"
      subtitle="Tell us about your educational background"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="education_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highest Education Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
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
            name="field_of_study"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field of Study (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Engineering, Medicine, Business" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University/Institution (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter university or institution name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/9')}>
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