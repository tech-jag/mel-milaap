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
  photo_visibility: z.enum(['public', 'members', 'on_request']).optional(),
  contact_by: z.string().optional(),
});

export default function OnboardingStep21() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useOnboardingState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo_visibility: userProfile?.photo_visibility || 'members',
      contact_by: userProfile?.contact_by?.join(', ') || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const contact_by = values.contact_by 
        ? values.contact_by.split(',').map(item => item.trim()).filter(Boolean)
        : [];
      
      await updateUserProfile.mutateAsync({
        photo_visibility: values.photo_visibility,
        contact_by,
      });
      navigate('/onboarding/22');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <OnboardingLayout
      currentStep={21}
      title="Privacy & Contact Settings"
      subtitle="Configure your privacy preferences and how others can contact you"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="photo_visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo Visibility</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select photo visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can see</SelectItem>
                    <SelectItem value="members">Members Only - Registered users can see</SelectItem>
                    <SelectItem value="on_request">On Request - Only after approval</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  Choose who can view your profile photos
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Contact Methods (Optional)</FormLabel>
                <FormControl>
                  <input 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="e.g., Phone, Email, WhatsApp, Video Call (comma-separated)" 
                    {...field} 
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Specify how interested members can contact you
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium">Privacy Guidelines:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• <strong>Public:</strong> Your photos are visible to all website visitors</li>
              <li>• <strong>Members Only:</strong> Only registered and logged-in users can see your photos</li>
              <li>• <strong>On Request:</strong> Your photos are protected and only shared after you approve each request</li>
            </ul>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/onboarding/20')}>
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