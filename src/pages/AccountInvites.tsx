"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Download,
  ExternalLink,
  Calendar,
  MapPin,
  Heart,
  Image
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteData {
  coupleName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  customMessage: string;
  template: string;
  canvaLink?: string;
}

const AccountInvites = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [inviteData, setInviteData] = React.useState<InviteData>({
    coupleName: '',
    eventDate: '',
    eventTime: '',
    venueName: '',
    venueAddress: '',
    customMessage: '',
    template: 'elegant',
    canvaLink: ''
  });

  React.useEffect(() => {
    checkAuthAndLoadInvite();
  }, []);

  const checkAuthAndLoadInvite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    
    // Load existing invite data
    const { data: inviteRecord } = await supabase
      .from('invites')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (inviteRecord) {
      setInviteData({
        coupleName: `${user.user_metadata?.first_name || ''} & Partner`,
        eventDate: inviteRecord.event_date || '',
        eventTime: '6:00 PM',
        venueName: inviteRecord.venue_name || '',
        venueAddress: 'Your Venue Address',
        customMessage: inviteRecord.custom_message || '',
        template: inviteRecord.template_name || 'elegant',
        canvaLink: inviteRecord.canva_link || ''
      });
    } else {
      setInviteData(prev => ({
        ...prev,
        coupleName: `${user.user_metadata?.first_name || ''} & Partner`
      }));
    }
    
    setIsLoading(false);
  };

  const saveInvite = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('invites')
        .upsert({
          user_id: currentUser.id,
          template_name: inviteData.template,
          event_date: inviteData.eventDate || null,
          venue_name: inviteData.venueName || null,
          custom_message: inviteData.customMessage || null,
          canva_link: inviteData.canvaLink || null,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Invite saved",
        description: "Your wedding invite has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportToPNG = () => {
    toast({
      title: "Export started",
      description: "Your invite is being prepared for download as PNG.",
    });
    // Placeholder for PNG export functionality
  };

  const exportToPDF = () => {
    toast({
      title: "Export started", 
      description: "Your invite is being prepared for download as PDF.",
    });
    // Placeholder for PDF export functionality
  };

  const openCanvaEditor = () => {
    if (inviteData.canvaLink) {
      window.open(inviteData.canvaLink, '_blank');
    } else {
      // Create a placeholder Canva link (in real implementation, this would integrate with Canva API)
      const canvaUrl = 'https://www.canva.com/design/create?type=invitation';
      window.open(canvaUrl, '_blank');
      
      toast({
        title: "Opening Canva",
        description: "Canva editor is opening in a new tab.",
      });
    }
  };

  if (!currentUser || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Mail className="w-4 h-4 mr-2" />
                  Digital Invites
                </Badge>
                <h1 className="text-luxury-xl text-foreground mb-4">
                  Wedding Invitations
                </h1>
                <p className="text-body-lg text-muted-foreground">
                  Create beautiful digital wedding invitations.
                </p>
              </div>
              <Link to="/account">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Invite Editor */}
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle>Invitation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Couple Names</Label>
                        <Input
                          placeholder="John & Jane"
                          value={inviteData.coupleName}
                          onChange={(e) => setInviteData(prev => ({...prev, coupleName: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label>Event Date</Label>
                        <Input
                          type="date"
                          value={inviteData.eventDate}
                          onChange={(e) => setInviteData(prev => ({...prev, eventDate: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Event Time</Label>
                        <Input
                          placeholder="6:00 PM"
                          value={inviteData.eventTime}
                          onChange={(e) => setInviteData(prev => ({...prev, eventTime: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label>Venue Name</Label>
                        <Input
                          placeholder="Grand Ballroom"
                          value={inviteData.venueName}
                          onChange={(e) => setInviteData(prev => ({...prev, venueName: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Venue Address</Label>
                      <Input
                        placeholder="123 Wedding St, City, State"
                        value={inviteData.venueAddress}
                        onChange={(e) => setInviteData(prev => ({...prev, venueAddress: e.target.value}))}
                      />
                    </div>

                    <div>
                      <Label>Custom Message</Label>
                      <Textarea
                        placeholder="Join us as we celebrate our special day..."
                        value={inviteData.customMessage}
                        onChange={(e) => setInviteData(prev => ({...prev, customMessage: e.target.value}))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Template Style</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {['elegant', 'modern', 'rustic'].map((template) => (
                          <div
                            key={template}
                            className={`p-3 border rounded-lg cursor-pointer text-center capitalize transition-colors ${
                              inviteData.template === template
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:bg-muted'
                            }`}
                            onClick={() => setInviteData(prev => ({...prev, template}))}
                          >
                            {template}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Canva Design Link (Optional)</Label>
                      <Input
                        placeholder="https://canva.com/design/..."
                        value={inviteData.canvaLink}
                        onChange={(e) => setInviteData(prev => ({...prev, canvaLink: e.target.value}))}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={saveInvite} className="flex-1">
                        Save Invitation
                      </Button>
                      <Button variant="outline" onClick={openCanvaEditor}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Edit in Canva
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>

              {/* Preview & Export */}
              <motion.div variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardHeader>
                    <CardTitle>Preview & Export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                    {/* Invite Preview */}
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center mb-6 border-2 border-dashed border-primary/20">
                      <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
                      
                      <h3 className="text-2xl font-elegant text-foreground mb-2">
                        {inviteData.coupleName || 'Your Names'}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4">
                        request the pleasure of your company
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          {inviteData.eventDate || 'Wedding Date'} at {inviteData.eventTime || 'Time'}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          {inviteData.venueName || 'Venue Name'}
                        </div>
                      </div>
                      
                      {inviteData.customMessage && (
                        <p className="text-sm text-muted-foreground italic">
                          "{inviteData.customMessage}"
                        </p>
                      )}
                    </div>

                    {/* Export Options */}
                    <div className="space-y-3">
                      <Button onClick={exportToPNG} variant="outline" className="w-full">
                        <Image className="w-4 h-4 mr-2" />
                        Export as PNG
                      </Button>
                      <Button onClick={exportToPDF} variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export as PDF
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> PNG and PDF export features are coming soon. 
                        For now, you can use the "Edit in Canva" option to create professional invitations.
                      </p>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccountInvites;