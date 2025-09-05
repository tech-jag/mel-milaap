"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const defaultTab = searchParams.get('tab') || 'login';
  
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const [loginData, setLoginData] = React.useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    parentManaged: false
  });

  // 2FA states
  const [showOTP, setShowOTP] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState('');
  const [pendingEmail, setPendingEmail] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First check if user has 2FA enabled
      const { data: userData } = await supabase
        .from('users')
        .select('two_factor_enabled')
        .eq('email', loginData.email)
        .maybeSingle();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      // If 2FA is enabled, request OTP
      if (userData?.two_factor_enabled) {
        await supabase.auth.signOut(); // Sign out temporarily for OTP verification
        setPendingEmail(loginData.email);
        setShowOTP(true);
        
        toast({
          title: "2FA Required",
          description: "Please check your email for the verification code.",
        });
      } else {
        // Regular login - redirect based on user type
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
        
        // Check if user is a supplier for redirect
        const { data: supplier } = await supabase
          .from('suppliers')
          .select('id')
          .eq('user_id', data.user?.id)
          .maybeSingle();
          
        navigate(supplier ? '/supplier/dashboard' : '/account');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Verify OTP and complete login
      const { data, error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: otpCode,
        type: 'email'
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });

      // Redirect based on user type
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', data.user?.id)
        .maybeSingle();
        
      navigate(supplier ? '/supplier/dashboard' : '/account');
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (!signupData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to our terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: signupData.name,
            phone: signupData.phone,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });

      // Switch to login tab
      setActiveTab('login');
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Join Our Community
              </Badge>
              <h1 className="text-luxury-lg text-foreground mb-6">
                Your Journey to Forever Starts Here
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of South Asian singles who have found meaningful connections 
                through our trusted matrimony platform.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Auth Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-md mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="luxury-card">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <span>Welcome to Shaadi & Co</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    
                    {/* Login Tab */}
                    <TabsContent value="login" className="space-y-6">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10"
                              value={loginData.email}
                              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="login-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={loginData.password}
                              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                              required
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          variant="luxury"
                          size="lg"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={handleGoogleAuth}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                          onClick={() => {/* TODO: Implement forgot password */}}
                        >
                          Forgot your password?
                        </button>
                      </div>
                    </TabsContent>

                    {/* Sign Up Tab */}
                    <TabsContent value="signup" className="space-y-6">
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Your full name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10"
                              value={signupData.email}
                              onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-phone">Phone Number</Label>
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder="+61 xxx xxx xxx"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={signupData.password}
                              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                              required
                              minLength={8}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                          <Input
                            id="signup-confirm-password"
                            type="password"
                            placeholder="••••••••"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="parent-managed"
                              checked={signupData.parentManaged}
                              onCheckedChange={(checked) => 
                                setSignupData({...signupData, parentManaged: checked as boolean})
                              }
                            />
                            <Label htmlFor="parent-managed" className="text-sm">
                              This profile is managed by parents/family
                            </Label>
                          </div>

                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="terms"
                              checked={signupData.agreeToTerms}
                              onCheckedChange={(checked) => 
                                setSignupData({...signupData, agreeToTerms: checked as boolean})
                              }
                              required
                            />
                            <Label htmlFor="terms" className="text-sm leading-relaxed">
                              I agree to the{" "}
                              <a href="/terms" className="text-primary hover:underline">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                              </a>
                            </Label>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          variant="luxury"
                          size="lg"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                      </form>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={handleGoogleAuth}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </TabsContent>
                    {/* OTP Verification Modal */}
                    {showOTP && (
                      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-10">
                        <Card className="w-full max-w-sm">
                          <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center space-x-3">
                              <Shield className="w-6 h-6 text-primary" />
                              <span>Enter Verification Code</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <form onSubmit={handleOTPVerification} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="otp">6-digit code from email</Label>
                                <Input
                                  id="otp"
                                  type="text"
                                  placeholder="123456"
                                  maxLength={6}
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value)}
                                  className="text-center tracking-widest"
                                  required
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => setShowOTP(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  variant="luxury"
                                  className="flex-1"
                                  disabled={isVerifying}
                                >
                                  {isVerifying ? "Verifying..." : "Verify"}
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 lg:gap-16"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: CheckCircle, text: "ID Verified Members", color: "text-success" },
              { icon: Shield, text: "Private & Secure", color: "text-primary" },
              { icon: Users, text: "Trusted Community", color: "text-accent" },
              { icon: Heart, text: "2,500+ Success Stories", color: "text-lux-champagne" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3"
                variants={fadeInUp}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="font-medium text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Auth;