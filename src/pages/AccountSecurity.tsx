"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReauthModal } from "@/components/ui/reauth-modal";
import { 
  Shield, 
  Key, 
  Smartphone,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowLeft
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AccountSidebar } from "@/components/ui/account-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountHeader } from "@/components/ui/account-header";
import { Link } from "react-router-dom";

const AccountSecurity = () => {
  const { toast } = useToast();
  const [user, setUser] = React.useState<any>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [recoveryCodes, setRecoveryCodes] = React.useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState('');
  const [isEnabling2FA, setIsEnabling2FA] = React.useState(false);
  
  // Password change states
  const [showPasswordChange, setShowPasswordChange] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Reauthentication states
  const [showReauthModal, setShowReauthModal] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<string | null>(null);

  React.useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setUser(user);
    
    // Get user's 2FA status
    const { data: userData } = await supabase
      .from('users')
      .select('two_factor_enabled')
      .eq('id', user.id)
      .maybeSingle();
      
    setTwoFactorEnabled(userData?.two_factor_enabled || false);
  };

  const generateRecoveryCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  };

  const requestReauth = (action: string) => {
    setPendingAction(action);
    setShowReauthModal(true);
  };

  const handleReauthSuccess = () => {
    if (pendingAction === 'enable2FA') {
      enable2FAInternal();
    } else if (pendingAction === 'disable2FA') {
      disable2FAInternal();
    } else if (pendingAction === 'changePassword') {
      setShowPasswordChange(true);
    }
    setPendingAction(null);
  };

  const enable2FA = () => {
    requestReauth('enable2FA');
  };

  const enable2FAInternal = async () => {
    setIsEnabling2FA(true);
    setIsLoading(true);

    try {
      // For TOTP implementation, we'll use Supabase's MFA
      const { data, error } = await supabase.auth.mfa.enroll({ 
        factorType: 'totp',
        friendlyName: 'Authenticator App'
      });

      if (error) throw error;

      // Generate recovery codes
      const codes = generateRecoveryCodes();
      setRecoveryCodes(codes);
      
      toast({
        title: "Scan QR Code",
        description: "Scan the QR code with your authenticator app and enter the 6-digit code below.",
        duration: 5000,
      });
      
      setShowRecoveryCodes(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async () => {
    setIsLoading(true);

    try {
      // For TOTP verification using MFA, we need to create a challenge first
      const factors = await supabase.auth.mfa.listFactors();
      const totp = factors.data?.totp?.[0];

      if (!totp) throw new Error('No TOTP factor found');

      // Create challenge and then verify
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totp.id
      });

      if (challengeError) throw challengeError;

      const { error } = await supabase.auth.mfa.verify({
        factorId: totp.id,
        challengeId: challenge.id,
        code: otpCode,
      });

      if (error) throw error;

      // Update user's 2FA status
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          two_factor_enabled: true,
          two_factor_backup_codes: recoveryCodes 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setTwoFactorEnabled(true);
      setIsEnabling2FA(false);
      setShowRecoveryCodes(false);
      setOtpCode('');

      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account.",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = () => {
    requestReauth('disable2FA');
  };

  const disable2FAInternal = async () => {
    setIsLoading(true);

    try {
      // Unenroll all TOTP factors
      const factors = await supabase.auth.mfa.listFactors();
      const totpFactors = factors.data?.totp || [];

      for (const factor of totpFactors) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      const { error } = await supabase
        .from('users')
        .update({ 
          two_factor_enabled: false,
          two_factor_backup_codes: null
        })
        .eq('id', user.id);

      if (error) throw error;

      setTwoFactorEnabled(false);
      setRecoveryCodes([]);

      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    requestReauth('changePassword');
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
        duration: 3000,
      });

      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyRecoveryCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Recovery code copied to clipboard.",
      duration: 3000,
    });
  };

  const downloadRecoveryCodes = () => {
    const content = recoveryCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mel-milaap-recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm lg:text-base">Loading security settings...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AccountSidebar />
        
        <div className="flex-1">
          <Navigation />
          
          {/* Account Header */}
          <AccountHeader
            title="Account Security"
            description="Manage your security settings and protect your account"
            icon={Shield}
          />

          {/* Main Content */}
          <div className="container mx-auto px-4 lg:px-8 py-6">
            <div className="max-w-2xl mx-auto space-y-6 lg:space-y-8">
              
              {/* Two-Factor Authentication */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="luxury-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-lg lg:text-xl">
                      <Smartphone className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                      <span>Two-Factor Authentication</span>
                      {twoFactorEnabled && (
                        <Badge variant="default" className="bg-success text-success-foreground text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 mr-0 sm:mr-4">
                        <p className="font-medium text-foreground text-sm lg:text-base">
                          Email-based 2FA
                        </p>
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          Receive verification codes via email for additional security
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={twoFactorEnabled ? disable2FA : enable2FA}
                        disabled={isLoading}
                      />
                    </div>

                    {isEnabling2FA && (
                      <div className="space-y-4 p-3 lg:p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center space-x-2 text-amber-600">
                          <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="text-xs lg:text-sm font-medium">Action Required</span>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="otp-verify" className="text-sm lg:text-base">Enter verification code from email</Label>
                          <Input
                            id="otp-verify"
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="max-w-xs text-sm lg:text-base"
                          />
                          <Button
                            onClick={verify2FA}
                            disabled={isLoading || otpCode.length !== 6}
                            className="w-full sm:w-auto text-sm lg:text-base"
                          >
                            {isLoading ? "Verifying..." : "Verify & Enable 2FA"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recovery Codes */}
              {showRecoveryCodes && (
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <Card className="luxury-card border-amber-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3 text-amber-700 text-lg lg:text-xl">
                        <Key className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span>Recovery Codes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 lg:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs lg:text-sm text-amber-800 mb-3 font-medium">
                          Save these recovery codes in a safe place. You can use them to access your account if you lose access to your email.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                          {recoveryCodes.map((code, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-2 lg:p-3 rounded border"
                            >
                              <code className="text-xs lg:text-sm font-mono">{code}</code>
                              <button
                                onClick={() => copyRecoveryCode(code)}
                                className="text-amber-600 hover:text-amber-800 flex-shrink-0 ml-2"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            onClick={downloadRecoveryCodes}
                            variant="outline"
                            size="sm"
                            className="text-xs lg:text-sm"
                          >
                            Download Codes
                          </Button>
                          <Button
                            onClick={() => setShowRecoveryCodes(false)}
                            variant="outline"
                            size="sm"
                            className="text-xs lg:text-sm"
                          >
                            I've Saved Them
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Password Settings */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="luxury-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-lg lg:text-xl">
                      <Key className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                      <span>Password</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 mr-0 sm:mr-4">
                          <p className="font-medium text-foreground text-sm lg:text-base">Change Password</p>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            {user?.app_metadata?.provider === 'email' 
                              ? "Update your account password" 
                              : "Password change not available for OAuth accounts"
                            }
                          </p>
                        </div>
                        {user?.app_metadata?.provider === 'email' && (
                          <Button 
                            variant="outline" 
                            onClick={handleChangePassword}
                            disabled={isLoading}
                            className="w-full sm:w-auto text-sm lg:text-base"
                          >
                            Change Password
                          </Button>
                        )}
                      </div>

                      {showPasswordChange && (
                        <div className="space-y-4 p-3 lg:p-4 bg-card border border-border rounded-lg">
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="new-password" className="text-sm lg:text-base">New Password</Label>
                              <div className="relative">
                                <Input
                                  id="new-password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="pr-10 text-sm lg:text-base"
                                  autoComplete="new-password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  required
                                  minLength={8}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirm-password" className="text-sm lg:text-base">Confirm New Password</Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="text-sm lg:text-base"
                              />
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <Button
                                onClick={changePassword}
                                disabled={isLoading || !newPassword || !confirmPassword}
                                className="text-sm lg:text-base"
                              >
                                {isLoading ? "Updating..." : "Update Password"}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowPasswordChange(false);
                                  setNewPassword('');
                                  setConfirmPassword('');
                                }}
                                className="text-sm lg:text-base"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>

          <Footer />
          
          <ReauthModal
            open={showReauthModal}
            onOpenChange={setShowReauthModal}
            onSuccess={handleReauthSuccess}
            title="Confirm Your Identity"
            description="Please re-enter your password to continue with this security action."
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AccountSecurity;