"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Search, 
  MoreVertical,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

interface Conversation {
  participant_id: string;
  participant_name: string;
  participant_avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online?: boolean;
}

const MessagingCenter = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuthAndLoadMessages();
  }, []);

  const checkAuthAndLoadMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    await loadConversations(user.id);
    setIsLoading(false);
  };

  const loadConversations = async (userId: string) => {
    try {
      // Get all messages where user is sender or receiver
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      messages?.forEach(message => {
        const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            participant_id: partnerId,
            participant_name: `User ${partnerId.slice(0, 8)}`, // Temporary name
            last_message: message.body,
            last_message_time: message.created_at,
            unread_count: message.sender_id !== userId ? 1 : 0
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error: any) {
      toast({
        title: "Error loading conversations",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadMessages = async (partnerId: string) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!currentUser || !selectedConversation || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: selectedConversation,
          body: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      await loadMessages(selectedConversation);
      await loadConversations(currentUser.id);

      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const selectConversation = (partnerId: string) => {
    setSelectedConversation(partnerId);
    loadMessages(partnerId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex bg-background rounded-lg border border-border overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Messages</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="p-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start messaging someone to see conversations here</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.participant_id}
                  variants={fadeInUp}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedConversation === conversation.participant_id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => selectConversation(conversation.participant_id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.participant_avatar} />
                        <AvatarFallback>
                          {conversation.participant_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.is_online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground truncate">
                          {conversation.participant_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.last_message_time), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message}
                        </p>
                        {conversation.unread_count > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {conversations.find(c => c.participant_id === selectedConversation)?.participant_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {conversations.find(c => c.participant_id === selectedConversation)?.participant_name}
                    </p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={fadeInUp}
                      className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender_id === currentUser?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      } rounded-lg px-4 py-2`}>
                        <p className="text-sm">{message.body}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 ${
                          message.sender_id === currentUser?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <p className="text-xs">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                          {message.sender_id === currentUser?.id && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1 max-h-20 min-h-[40px] resize-none"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  variant="luxury"
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the left to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingCenter;