import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  Mail, 
  Smartphone, 
  MapPin,
  Clock,
  Bell
} from 'lucide-react';

interface SecurityAlert {
  id: string;
  event_type: string;
  event_data: any;
  created_at: string;
  acknowledged: boolean;
}

interface AlertSettings {
  email_alerts: boolean;
  login_alerts: boolean;
  profile_change_alerts: boolean;
  suspicious_activity_alerts: boolean;
}

const SecurityAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [settings, setSettings] = useState<AlertSettings>({
    email_alerts: true,
    login_alerts: true,
    profile_change_alerts: true,
    suspicious_activity_alerts: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSecurityAlerts();
      loadAlertSettings();
    }
  }, [user]);

  const loadSecurityAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform security events to alerts format
      const alertsData = (data || []).map(event => ({
        id: event.id,
        event_type: event.event_type,
        event_data: event.event_data,
        created_at: event.created_at,
        acknowledged: false, // Default to false, would need separate table for acknowledgments
      }));

      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading security alerts:', error);
    }
  };

  const loadAlertSettings = async () => {
    if (!user) return;

    try {
      // For now, use default settings
      // In a real app, you'd load these from a user_settings table
      setSettings({
        email_alerts: true,
        login_alerts: true,
        profile_change_alerts: true,
        suspicious_activity_alerts: true,
      });
    } catch (error) {
      console.error('Error loading alert settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAlertSettings = async (newSettings: Partial<AlertSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // In a real app, you'd save these to a user_settings table
    toast({
      title: 'Settings Updated',
      description: 'Your security alert preferences have been saved.',
    });
  };

  const acknowledgeAlert = async (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));

    toast({
      title: 'Alert Acknowledged',
      description: 'The security alert has been marked as reviewed.',
    });
  };

  const getAlertIcon = (eventType: string) => {
    switch (eventType) {
      case 'login':
        return <Shield className="h-4 w-4" />;
      case 'profile_change':
        return <MapPin className="h-4 w-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertSeverity = (eventType: string) => {
    switch (eventType) {
      case 'suspicious_activity':
        return 'destructive';
      case 'login':
        return 'default';
      case 'profile_change':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatAlertMessage = (alert: SecurityAlert) => {
    switch (alert.event_type) {
      case 'login':
        return `New login from ${alert.event_data?.ip_address || 'unknown location'}`;
      case 'profile_change':
        return `Profile information was modified`;
      case 'suspicious_activity':
        return `Suspicious activity detected on your account`;
      default:
        return `Security event: ${alert.event_type}`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Security Alert Settings
          </CardTitle>
          <CardDescription>
            Choose when you want to be notified about security events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-alerts" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive security alerts via email
              </p>
            </div>
            <Switch
              id="email-alerts"
              checked={settings.email_alerts}
              onCheckedChange={(checked) => updateAlertSettings({ email_alerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-alerts" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Login Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert me when someone logs into my account
              </p>
            </div>
            <Switch
              id="login-alerts"
              checked={settings.login_alerts}
              onCheckedChange={(checked) => updateAlertSettings({ login_alerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-alerts" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Profile Change Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Notify me when my profile information is modified
              </p>
            </div>
            <Switch
              id="profile-alerts"
              checked={settings.profile_change_alerts}
              onCheckedChange={(checked) => updateAlertSettings({ profile_change_alerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="suspicious-alerts" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Suspicious Activity Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert me about unusual account activity
              </p>
            </div>
            <Switch
              id="suspicious-alerts"
              checked={settings.suspicious_activity_alerts}
              onCheckedChange={(checked) => updateAlertSettings({ suspicious_activity_alerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Security Alerts
          </CardTitle>
          <CardDescription>
            Latest security events for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.event_type)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getAlertSeverity(alert.event_type) as any}>
                        {alert.event_type}
                      </Badge>
                      {!alert.acknowledged && (
                        <Badge variant="outline" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      {formatAlertMessage(alert)}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Security Alerts</h3>
                <p className="text-muted-foreground">
                  You don't have any recent security alerts. Your account is secure!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAlerts;