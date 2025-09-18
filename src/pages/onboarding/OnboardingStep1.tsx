import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { fadeInUp, staggerChildren } from '@/lib/motion';
import { useAuth } from '@/hooks/useAuth';

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('OnboardingStep1 - Auth state:', { user: !!user, loading, userEmail: user?.email });
    if (!loading && !user) {
      // If user is not authenticated, redirect to auth page
      console.log('OnboardingStep1 - No user found, redirecting to auth');
      navigate('/auth?tab=signup');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const benefits = [
    "Complete your detailed profile",
    "Add beautiful photos",
    "Set partner preferences", 
    "Start connecting with matches"
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-2xl mx-auto"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {/* Header */}
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 bg-white/10 border-white/20 text-white">
              <Heart className="w-4 h-4 mr-2" />
              Step 1 of 23
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Welcome to Your Journey
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Hello {user.user_metadata?.name || 'there'}! Let's create your perfect profile to help you find your ideal partner.
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div variants={fadeInUp}>
            <Card className="luxury-card bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-heading text-foreground">
                  Let's Build Your Profile
                </CardTitle>
                <p className="text-muted-foreground">
                  We'll guide you through creating a profile that truly represents you
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="bg-gradient-primary p-6 rounded-xl text-white text-center"
                >
                  <h3 className="font-semibold mb-2">Ready to Get Started?</h3>
                  <p className="text-white/90 text-sm mb-4">
                    This should take about 10-15 minutes to complete. You can save and continue anytime.
                  </p>
                  <Button
                    variant="champagne"
                    size="lg"
                    className="w-full group"
                    onClick={() => navigate('/onboarding/3')}
                  >
                    Start My Profile
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => navigate('/auth?tab=login')}
                  >
                    Sign in here
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingStep1;