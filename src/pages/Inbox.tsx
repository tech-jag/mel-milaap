"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Heart, 
  Search,
  Send,
  Check,
  X,
  Shield,
  Clock,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";

const Inbox = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = React.useState(null);
  const [message, setMessage] = React.useState("");

  // Mock data for messages and interests
  const interests = [
    {
      id: 1,
      name: "Priya S.",
      age: 28,
      location: "Sydney, NSW",
      profession: "Software Engineer",
      photo: "/api/placeholder/300/400",
      verified: true,
      sentAt: "2 hours ago",
      message: "Hi! I found your profile interesting and would love to connect.",
      compatibility: 92
    },
    {
      id: 2,
      name: "Anjali K.",
      age: 26,
      location: "Melbourne, VIC",
      profession: "Doctor",
      photo: "/api/placeholder/300/400",
      verified: true,
      sentAt: "1 day ago",
      message: "Hello! Your profile caught my attention. I'd like to get to know you better.",
      compatibility: 88
    }
  ];

  const conversations = [
    {
      id: 1,
      name: "Shreya M.",
      photo: "/api/placeholder/300/400",
      lastMessage: "Thank you for accepting my interest! How are you doing?",
      time: "2 min ago",
      unread: true,
      verified: true,
      messages: [
        { sender: "them", text: "Hi! Thanks for accepting my interest!", time: "2:30 PM" },
        { sender: "me", text: "Hello! Nice to connect with you.", time: "2:32 PM" },
        { sender: "them", text: "Thank you for accepting my interest! How are you doing?", time: "2:35 PM" }
      ]
    },
    {
      id: 2,
      name: "Kavya R.",
      photo: "/api/placeholder/300/400",
      lastMessage: "Would love to know more about your interests",
      time: "1 hour ago",
      unread: false,
      verified: true,
      messages: [
        { sender: "them", text: "Hello! I saw your profile and found it interesting.", time: "1:00 PM" },
        { sender: "me", text: "Hi! Thank you for reaching out.", time: "1:15 PM" },
        { sender: "them", text: "Would love to know more about your interests", time: "1:30 PM" }
      ]
    }
  ];

  const handleAcceptInterest = (interestId: number) => {
    console.log("Accepted interest:", interestId);
  };

  const handleDeclineInterest = (interestId: number) => {
    console.log("Declined interest:", interestId);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in to view your inbox</h1>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-8 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-4">
                <MessageCircle className="w-4 h-4 mr-2" />
                Inbox
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Messages & Interests
              </h1>
              <p className="text-muted-foreground text-lg">
                Connect with your matches and manage your conversations
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Inbox Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            <Tabs defaultValue="interests" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="interests">
                  Interests ({interests.length})
                </TabsTrigger>
                <TabsTrigger value="messages">
                  Messages ({conversations.filter(c => c.unread).length})
                </TabsTrigger>
              </TabsList>

              {/* Interests Tab */}
              <TabsContent value="interests">
                <motion.div
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.div variants={fadeInUp} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Profile Interests Received</h2>
                    <p className="text-muted-foreground">Members who have shown interest in your profile</p>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interests.map((interest) => (
                      <motion.div key={interest.id} variants={fadeInUp}>
                        <Card className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex">
                              {/* Profile Image */}
                              <div className="relative w-32 h-40">
                                <img 
                                  src={interest.photo} 
                                  alt={interest.name}
                                  className="w-full h-full object-cover"
                                />
                                {interest.verified && (
                                  <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Profile Details */}
                              <div className="flex-1 p-4 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg">{interest.name}</h3>
                                    <Badge className="bg-purple-500 text-white text-xs">
                                      {interest.compatibility}% Match
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {interest.age} years • {interest.location}
                                  </p>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {interest.profession}
                                  </p>
                                  
                                  <div className="bg-muted/50 p-3 rounded-lg mb-4">
                                    <p className="text-sm italic">"{interest.message}"</p>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Sent {interest.sentAt}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => handleDeclineInterest(interest.id)}
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Decline
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => handleAcceptInterest(interest.id)}
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Accept
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  
                  {interests.length === 0 && (
                    <motion.div variants={fadeInUp} className="text-center py-12">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No interests received yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Complete your profile to attract more interests
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages">
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]"
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {/* Conversations List */}
                  <motion.div variants={fadeInUp} className="lg:col-span-1">
                    <Card className="h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Search className="w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Search conversations..." className="border-0 shadow-none" />
                        </div>
                        
                        <div className="space-y-2">
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedConversation?.id === conversation.id 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-muted/50'
                              }`}
                              onClick={() => setSelectedConversation(conversation)}
                            >
                              <div className="relative">
                                <img 
                                  src={conversation.photo} 
                                  alt={conversation.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                {conversation.verified && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Shield className="w-2 h-2 text-white" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium truncate">{conversation.name}</h4>
                                  <span className="text-xs text-muted-foreground">{conversation.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage}
                                </p>
                              </div>
                              
                              {conversation.unread && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  {/* Chat Area */}
                  <motion.div variants={fadeInUp} className="lg:col-span-2">
                    <Card className="h-full flex flex-col">
                      {selectedConversation ? (
                        <>
                          {/* Chat Header */}
                          <div className="p-4 border-b">
                            <div className="flex items-center gap-3">
                              <img 
                                src={selectedConversation.photo} 
                                alt={selectedConversation.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-semibold">{selectedConversation.name}</h3>
                                <p className="text-sm text-muted-foreground">Online now</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Messages */}
                          <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {selectedConversation.messages.map((msg, index) => (
                              <div
                                key={index}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    msg.sender === 'me'
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{msg.text}</p>
                                  <p className={`text-xs mt-1 ${
                                    msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                  }`}>
                                    {msg.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Message Input */}
                          <div className="p-4 border-t">
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="resize-none"
                                rows={1}
                              />
                              <Button onClick={handleSendMessage}>
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-center p-8">
                          <div>
                            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Select a conversation</h3>
                            <p className="text-muted-foreground text-sm">
                              Choose a conversation from the left to start messaging
                            </p>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Inbox;