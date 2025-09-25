import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Shield, Flag, UserX } from 'lucide-react';

interface BlockReportActionsProps {
  targetUserId: string;
  targetUserName?: string;
  className?: string;
}

const BlockReportActions: React.FC<BlockReportActionsProps> = ({
  targetUserId,
  targetUserName = 'user',
  className = '',
}) => {
  const { user } = useAuth();
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [blocking, setBlocking] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleBlockUser = async () => {
    if (!user || user.id === targetUserId) return;

    setBlocking(true);
    try {
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_user_id: user.id,
          blocked_user_id: targetUserId,
        });

      if (error) throw error;

      toast({
        title: 'User Blocked',
        description: `${targetUserName} has been blocked successfully.`,
      });
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: 'Error',
        description: 'Failed to block user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBlocking(false);
    }
  };

  const handleReportUser = async () => {
    if (!user || !reportReason || user.id === targetUserId) return;

    setReporting(true);
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_user_id: user.id,
          subject_id: targetUserId,
          subject_type: 'user',
          reason: reportReason,
          description: reportDescription,
        });

      if (error) throw error;

      toast({
        title: 'Report Submitted',
        description: 'Thank you for reporting. We will review this matter.',
      });

      setReportDialogOpen(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      console.error('Error reporting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setReporting(false);
    }
  };

  if (!user || user.id === targetUserId) {
    return null;
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Report User Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-2" />
            Report
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Report {targetUserName}
            </DialogTitle>
            <DialogDescription>
              Help us keep the community safe by reporting inappropriate behavior.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for reporting</Label>
              <RadioGroup value={reportReason} onValueChange={setReportReason}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inappropriate_content" id="inappropriate_content" />
                  <Label htmlFor="inappropriate_content">Inappropriate content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="harassment" id="harassment" />
                  <Label htmlFor="harassment">Harassment or bullying</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spam" id="spam" />
                  <Label htmlFor="spam">Spam or fake profile</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fraud" id="fraud" />
                  <Label htmlFor="fraud">Fraud or scam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="description">Additional details (optional)</Label>
              <Textarea
                id="description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Provide any additional context..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReportUser} 
              disabled={!reportReason || reporting}
            >
              {reporting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block User Alert Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm">
            <UserX className="h-4 w-4 mr-2" />
            Block
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Block {targetUserName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This user will no longer be able to view your profile, send you messages, 
              or interact with you on the platform. You can unblock them later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockUser}
              disabled={blocking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {blocking ? 'Blocking...' : 'Block User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlockReportActions;