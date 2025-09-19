import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface VerificationRecord {
  id: string;
  verification_type: string;
  status: 'pending' | 'verified' | 'rejected';
  submitted_at: string;
  verified_at?: string;
  notes?: string;
}

export function useVerificationStatus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadVerifications();
    }
  }, [user]);

  const loadVerifications = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('verification_records')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setVerifications((data || []) as VerificationRecord[]);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitVerification = async (type: string, notes?: string, documentUrl?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('verification_records')
        .insert({
          user_id: user.id,
          verification_type: type,
          status: 'pending',
          notes,
          document_url: documentUrl
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setVerifications(prev => [data as VerificationRecord, ...prev]);
        toast({
          title: "Verification submitted",
          description: `Your ${type} verification has been submitted for review.`,
        });
      }
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getVerificationStatus = (type: string): 'pending' | 'verified' | 'rejected' | 'none' => {
    const verification = verifications.find(v => v.verification_type === type);
    return verification?.status || 'none';
  };

  const isVerified = (type: string): boolean => {
    return getVerificationStatus(type) === 'verified';
  };

  const getOverallVerificationScore = (): number => {
    const types = ['phone', 'email', 'id_document', 'social_media', 'professional'];
    const verified = types.filter(type => isVerified(type)).length;
    return Math.round((verified / types.length) * 100);
  };

  return {
    verifications,
    isLoading,
    submitVerification,
    getVerificationStatus,
    isVerified,
    getOverallVerificationScore,
    refreshVerifications: loadVerifications
  };
}