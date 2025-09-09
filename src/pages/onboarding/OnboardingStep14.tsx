import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  about_me: z.string().min(50, 'Please write at least 50 characters about yourself'),
  highlights: z.string().optional(),
});

export default function OnboardingStep14() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about_me: userProfile?.about_me || '',
      highlights: userProfile?.highlights?.join(', ') || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const highlights = values.highlights 
        ? values.highlights.split(',').map(highlight => highlight.trim()).filter(Boolean)
        : [];
      
      await updateUserProfile.mutateAsync({
        about_me: values.about_me,
        highlights,
      });
      navigate('/onboarding/15');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const aboutMeLength = form.watch('about_me')?.length || 0;

  return (
    <OnboardingLayout
      currentStep={14}
      title="About You"
      subtitle="Tell us about yourself and what makes you unique"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="about_me"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Me</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about yourself, your personality, interests, values, and what you're looking for in a life partner. Share what makes you unique and what's important to you in life..."
                    className="min-h-[150px]"
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  {aboutMeLength}/50 characters minimum
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highlights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Highlights (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Travel enthusiast, Fitness lover, Music passion (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Add 3-5 key things that highlight your personality
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/13')}>
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