import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Send, 
  Check, 
  X, 
  Clock,
  AlertCircle,
  MessageCircle,
  Eye,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Interest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender_profile?: {
    first_name: string;
    last_name: string;
    photo_primary_url: string;
    profession: string;
    city: string;
  } | null;
  receiver_profile?: {
    first_name: string;
    last_name: string;
    photo_primary_url: string;
    profession: string;
    city: string;
  } | null;
}

const InterestManager: React.FC = () => {
  const { user } = useAuth();
  const [receivedInterests, setReceivedInterests] = useState<Interest[]>([]);
  const [sentInterests, setSentInterests] = useState<Interest[]>([]);
  const [acceptedInterests, setAcceptedInterests] = useState<Interest[]>([]);
  const [dailyLimit, setDailyLimit] = useState({ sent: 0, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadInterests();
      checkDailyLimit();
    }
  }, [user]);

  const loadInterests = async () => {
    setLoading(true);
    try {
      // Load received interests
      const { data: received } = await supabase
        .from('interests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at
        `)
        .eq('receiver_id', user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Load sent interests
      const { data: sent } = await supabase
        .from('interests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at
        `)
        .eq('sender_id', user?.id)
        .order('created_at', { ascending: false });

      // Load accepted interests (conversations)
      const { data: accepted } = await supabase
        .from('interests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      setReceivedInterests((received as any[]) || []);
      setSentInterests((sent as any[]) || []);
      setAcceptedInterests((accepted as any[]) || []);

      // Log security event
      console.log('🔒 INTERESTS LOADED:', {
        user_id: user?.id,
        received: received?.length || 0,
        sent: sent?.length || 0,
        accepted: accepted?.length || 0,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error loading interests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load interests.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkDailyLimit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: todaysInterests } = await supabase
        .from('interests')
        .select('id')
        .eq('sender_id', user?.id)
        .gte('created_at', `${today}T00:00:00`);

      setDailyLimit({
        sent: todaysInterests?.length || 0,
        limit: 10
      });

      // Log rate limiting check
      console.log('🔒 RATE LIMIT CHECK:', {
        user_id: user?.id,
        daily_sent: todaysInterests?.length || 0,
        limit: 10,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error checking daily limit:', error);
    }
  };

  const respondToInterest = async (interestId: string, response: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('interests')
        .update({ status: response as any })
        .eq('id', interestId)
        .eq('receiver_id', user?.id);

      if (error) throw error;

      // Log security event
      console.log('🔒 INTEREST RESPONSE:', {
        user_id: user?.id,
        interest_id: interestId,
        response,
        timestamp: new Date().toISOString()
      });

      toast({
        title: response === 'accepted' ? 'Interest Accepted' : 'Interest Declined',
        description: response === 'accepted' 
          ? 'You can now start a conversation!' 
          : 'Interest has been declined.',
      });

      // Reload interests
      loadInterests();

    } catch (error) {
      console.error('Error responding to interest:', error);
      toast({
        title: 'Error',
        description: 'Failed to respond to interest.',
        variant: 'destructive'
      });
    }
  };

  const sendInterest = async (receiverId: string) => {
    try {
      // Check daily limit
      if (dailyLimit.sent >= dailyLimit.limit) {
        toast({
          title: 'Daily Limit Reached',
          description: `You can only send ${dailyLimit.limit} interests per day.`,
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('interests')
        .insert({
          sender_id: user?.id,
          receiver_id: receiverId,
          status: 'pending'
        });

      if (error) throw error;

      // Log security event
      console.log('🔒 INTEREST SENT:', {
        user_id: user?.id,
        receiver_id: receiverId,
        daily_count: dailyLimit.sent + 1,
        timestamp: new Date().toISOString()
      });

      toast({
        title: 'Interest Sent',
        description: 'Your interest has been sent successfully.',
      });

      // Update daily limit and reload
      setDailyLimit(prev => ({ ...prev, sent: prev.sent + 1 }));
      loadInterests();

    } catch (error: any) {
      console.error('Error sending interest:', error);
      
      // Check for rate limiting error
      if (error.message?.includes('limit')) {
        toast({
          title: 'Rate Limit Exceeded',
          description: 'You have reached your daily interest limit.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send interest.',
          variant: 'destructive'
        });
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Daily Limit Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">Daily Interest Limit</h3>
                <p className="text-sm text-muted-foreground">
                  {dailyLimit.sent}/{dailyLimit.limit} interests sent today
                </p>
              </div>
            </div>
            {dailyLimit.sent >= dailyLimit.limit ? (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Limit Reached
              </Badge>
            ) : (
              <Badge variant="outline">
                {dailyLimit.limit - dailyLimit.sent} remaining
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="received" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Received
            {receivedInterests.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {receivedInterests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sent
            {sentInterests.length > 0 && (
              <Badge variant="outline" className="ml-1">
                {sentInterests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Conversations
            {acceptedInterests.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {acceptedInterests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p>Loading received interests...</p>
                </CardContent>
              </Card>
            ) : receivedInterests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No New Interests</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll see new profile interests here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              receivedInterests.map((interest) => (
                <Card key={interest.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={interest.sender_profile?.photo_primary_url} />
                          <AvatarFallback>
                            {interest.sender_profile?.first_name?.charAt(0)}
                            {interest.sender_profile?.last_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {interest.sender_profile?.first_name} {interest.sender_profile?.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {interest.sender_profile?.profession} • {interest.sender_profile?.city}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(interest.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => respondToInterest(interest.id, 'rejected')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => respondToInterest(interest.id, 'accepted')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="sent">
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p>Loading sent interests...</p>
                </CardContent>
              </Card>
            ) : sentInterests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Sent Interests</h3>
                  <p className="text-sm text-muted-foreground">
                    Your sent interests will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              sentInterests.map((interest) => (
                <Card key={interest.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={interest.receiver_profile?.photo_primary_url} />
                          <AvatarFallback>
                            {interest.receiver_profile?.first_name?.charAt(0)}
                            {interest.receiver_profile?.last_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {interest.receiver_profile?.first_name} {interest.receiver_profile?.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {interest.receiver_profile?.profession} • {interest.receiver_profile?.city}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sent {formatTimeAgo(interest.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        interest.status === 'pending' ? 'outline' :
                        interest.status === 'accepted' ? 'default' : 'secondary'
                      }>
                        {interest.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {interest.status === 'accepted' && <Check className="h-3 w-3 mr-1" />}
                        {interest.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                        {interest.status.charAt(0).toUpperCase() + interest.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p>Loading conversations...</p>
                </CardContent>
              </Card>
            ) : acceptedInterests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Active Conversations</h3>
                  <p className="text-sm text-muted-foreground">
                    Your conversations will appear here after mutual interest.
                  </p>
                </CardContent>
              </Card>
            ) : (
              acceptedInterests.map((interest) => {
                const otherUser = interest.sender_id === user?.id 
                  ? interest.receiver_profile 
                  : interest.sender_profile;
                
                return (
                  <Card key={interest.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={otherUser?.photo_primary_url} />
                            <AvatarFallback>
                              {otherUser?.first_name?.charAt(0)}
                              {otherUser?.last_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">
                              {otherUser?.first_name} {otherUser?.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {otherUser?.profession} • {otherUser?.city}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Connected {formatTimeAgo(interest.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                          <Button size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterestManager;