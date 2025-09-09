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
  religion: z.string().optional(),
  community: z.string().optional(),
  sub_community: z.string().optional(),
  gothra: z.string().optional(),
  nakshatra: z.string().optional(),
  manglik: z.enum(['yes', 'no', 'unknown']).optional(),
});

const religions = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Other', 'No Religion'
];

export default function OnboardingStep8() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      religion: userProfile?.religion || '',
      community: userProfile?.community || '',
      sub_community: userProfile?.sub_community || '',
      gothra: userProfile?.gothra || '',
      nakshatra: userProfile?.nakshatra || '',
      manglik: userProfile?.manglik || 'unknown',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateUserProfile.mutateAsync(values);
      navigate('/onboarding/9');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedReligion = form.watch('religion');
  const isHindu = selectedReligion === 'Hindu';

  return (
    <OnboardingLayout
      currentStep={8}
      title="Religion & Community"
      subtitle="Share your religious and community background"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {religions.map((religion) => (
                      <SelectItem key={religion} value={religion}>
                        {religion}
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
            name="community"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Brahmin, Kshatriya, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sub_community"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Community (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Iyer, Iyengar, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isHindu && (
            <>
              <FormField
                control={form.control}
                name="gothra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gothra (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter gothra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nakshatra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nakshatra (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter nakshatra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manglik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manglik Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manglik status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unknown">Don't know</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/7')}>
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