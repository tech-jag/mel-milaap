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
  diet: z.enum(['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan', 'halal', 'prefer_not']).optional(),
  drinking: z.enum(['no', 'occasional', 'yes']).optional(),
  smoking: z.enum(['no', 'occasional', 'yes']).optional(),
  lifestyle_tags: z.string().optional(),
});

export default function OnboardingStep12() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diet: userProfile?.diet || undefined,
      drinking: userProfile?.drinking || undefined,
      smoking: userProfile?.smoking || undefined,
      lifestyle_tags: userProfile?.lifestyle_tags?.join(', ') || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const lifestyle_tags = values.lifestyle_tags 
        ? values.lifestyle_tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      
      await updateUserProfile.mutateAsync({
        diet: values.diet,
        drinking: values.drinking,
        smoking: values.smoking,
        lifestyle_tags,
      });
      navigate('/onboarding/13');
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
      currentStep={12}
      title="Lifestyle Preferences"
      subtitle="Tell us about your lifestyle choices"
      hideNavigation={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="diet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diet Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="eggetarian">Eggetarian</SelectItem>
                    <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="halal">Halal</SelectItem>
                    <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drinking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drinking Habits</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select drinking habits" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="occasional">Occasionally</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smoking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Smoking Habits</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select smoking habits" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="occasional">Occasionally</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lifestyle_tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interests & Hobbies (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Travel, Reading, Sports, Music (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/11')}>
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