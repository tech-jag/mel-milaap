import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Crown, Phone, Mail } from 'lucide-react';

interface ContactMaskingProps {
  profileId: string;
  email?: string;
  phone?: string;
  className?: string;
}

const ContactMasking: React.FC<ContactMaskingProps> = ({
  profileId,
  email,
  phone,
  className = '',
}) => {
  const { user } = useAuth();
  const [canViewContact, setCanViewContact] = useState(false);
  const [showingContact, setShowingContact] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkContactAccess();
  }, [user, profileId]);

  const checkContactAccess = async () => {
    if (!user || !profileId) return;

    try {
      // Own profile
      if (user.id === profileId) {
        setCanViewContact(true);
        setShowingContact(true);
        return;
      }

      // Check premium status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('subject_id', user.id)
        .eq('subject_type', 'user')
        .eq('status', 'active')
        .single();

      const userIsPremium = !!subscription;
      setIsPremium(userIsPremium);

      // Check mutual interests
      const { data: mutualInterest } = await supabase
        .from('interests')
        .select('status')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`)
        .eq('status', 'accepted')
        .single();

      const hasMutualInterest = !!mutualInterest;

      setCanViewContact(userIsPremium || hasMutualInterest);
    } catch (error) {
      console.error('Error checking contact access:', error);
    }
  };

  const maskEmail = (email: string): string => {
    const [local, domain] = email.split('@');
    const maskedLocal = local.charAt(0) + '*'.repeat(Math.max(local.length - 2, 1)) + local.charAt(local.length - 1);
    const [domainName, tld] = domain.split('.');
    const maskedDomain = domainName.charAt(0) + '*'.repeat(Math.max(domainName.length - 2, 1)) + domainName.charAt(domainName.length - 1);
    return `${maskedLocal}@${maskedDomain}.${tld}`;
  };

  const maskPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length > 6) {
      return cleaned.substring(0, 3) + '*'.repeat(cleaned.length - 6) + cleaned.substring(cleaned.length - 3);
    }
    return '*'.repeat(cleaned.length);
  };

  const toggleContactVisibility = () => {
    if (canViewContact) {
      setShowingContact(!showingContact);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {email && (
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm">
              {showingContact && canViewContact ? email : maskEmail(email)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!canViewContact && (
              <Badge variant="outline" className="text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            {canViewContact && (
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleContactVisibility}
                className="h-8 w-8 p-0"
              >
                {showingContact ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {phone && (
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm">
              {showingContact && canViewContact ? phone : maskPhone(phone)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!canViewContact && (
              <Badge variant="outline" className="text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            {canViewContact && (
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleContactVisibility}
                className="h-8 w-8 p-0"
              >
                {showingContact ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {!canViewContact && (
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Contact information is protected
          </p>
          <Button size="sm" variant="outline">
            <Crown className="h-4 w-4 mr-2" />
            {isPremium ? 'Send Interest First' : 'Upgrade to Premium'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactMasking;