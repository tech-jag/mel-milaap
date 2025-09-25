import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface DataExport {
  id: string;
  status: 'pending' | 'ready' | 'downloaded' | 'expired';
  created_at: string;
  expires_at: string;
  export_data: any;
}

const DataExport = () => {
  const { user } = useAuth();
  const [exports, setExports] = useState<DataExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    loadDataExports();
  }, [user]);

  const loadDataExports = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('data_exports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExports((data || []) as DataExport[]);
    } catch (error) {
      console.error('Error loading data exports:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestDataExport = async () => {
    if (!user) return;

    setRequesting(true);
    try {
      // Collect user data from various tables
      const [
        profileData,
        photosData,
        interestsData,
        messagesData,
        viewsData
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('profile_photos').select('*').eq('user_id', user.id),
        supabase.from('interests').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
        supabase.from('messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
        supabase.from('profile_views').select('*').or(`viewer_id.eq.${user.id},viewed_profile_id.eq.${user.id}`)
      ]);

      const exportData = {
        user_info: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        profile: profileData.data,
        photos: photosData.data,
        interests: interestsData.data,
        messages: messagesData.data?.map(msg => ({
          ...msg,
          // Remove sensitive content for privacy
          body: msg.sender_id === user.id ? msg.body : '[Message from other user]'
        })),
        profile_views: viewsData.data,
        export_requested_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('data_exports')
        .insert({
          user_id: user.id,
          export_data: exportData,
          status: 'ready',
        });

      if (error) throw error;

      toast({
        title: 'Data Export Requested',
        description: 'Your data export has been prepared and is ready for download.',
      });

      loadDataExports();
    } catch (error) {
      console.error('Error requesting data export:', error);
      toast({
        title: 'Error',
        description: 'Failed to request data export. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRequesting(false);
    }
  };

  const downloadExport = async (exportId: string, exportData: any) => {
    try {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mel-milaap-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Mark as downloaded
      await supabase
        .from('data_exports')
        .update({ status: 'downloaded' })
        .eq('id', exportId);

      toast({
        title: 'Download Started',
        description: 'Your data export has been downloaded.',
      });

      loadDataExports();
    } catch (error) {
      console.error('Error downloading export:', error);
      toast({
        title: 'Error',
        description: 'Failed to download export. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'downloaded':
        return <Download className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'ready':
        return 'default';
      case 'downloaded':
        return 'outline';
      case 'expired':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export (GDPR Compliance)
        </CardTitle>
        <CardDescription>
          Download all your personal data stored on our platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Request New Export</h4>
            <p className="text-sm text-muted-foreground">
              Download your profile, photos, messages, and activity data
            </p>
          </div>
          <Button 
            onClick={requestDataExport} 
            disabled={requesting}
          >
            {requesting ? 'Preparing...' : 'Request Export'}
          </Button>
        </div>

        {exports.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Previous Exports</h4>
            {exports.map((exportItem) => (
              <div key={exportItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(exportItem.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Export {new Date(exportItem.created_at).toLocaleDateString()}
                      </span>
                      <Badge variant={getStatusColor(exportItem.status) as any}>
                        {exportItem.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {exportItem.status === 'ready' && `Expires: ${new Date(exportItem.expires_at).toLocaleDateString()}`}
                      {exportItem.status === 'expired' && 'This export has expired'}
                      {exportItem.status === 'downloaded' && 'Downloaded'}
                    </p>
                  </div>
                </div>
                {exportItem.status === 'ready' && (
                  <Button
                    size="sm"
                    onClick={() => downloadExport(exportItem.id, exportItem.export_data)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
          <p><strong>What's included:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Profile information and settings</li>
            <li>Photos and media you've uploaded</li>
            <li>Messages you've sent and received</li>
            <li>Interest expressions and matches</li>
            <li>Profile view history</li>
            <li>Account activity logs</li>
          </ul>
          <p className="pt-2">
            <strong>Note:</strong> Exports expire after 7 days for security reasons.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExport;