import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Heart, 
  Users, 
  Camera, 
  MapPin, 
  Sparkles, 
  CheckCircle,
  User,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  full_name: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  relationship_status: string;
  role: string;
  desired_features: string[];
  additional_comments: string;
  referral_source: string;
}

interface SupplierFormData {
  business_name: string;
  contact_person: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  business_category: string;
  years_experience: number;
  current_client_base: string;
  desired_features: string[];
  additional_comments: string;
  website: string;
}

const userFeatures = [
  { id: 'verified-profiles', label: 'Verified Profiles', icon: CheckCircle },
  { id: 'advanced-matching', label: 'Advanced Matching Algorithm', icon: Heart },
  { id: 'wedding-planning', label: 'Wedding Planning Tools', icon: Sparkles },
  { id: 'supplier-directory', label: 'Supplier Directory', icon: Building2 },
  { id: 'guest-management', label: 'Guest Management', icon: Users },
  { id: 'photo-sharing', label: 'Private Photo Sharing', icon: Camera },
];

const supplierFeatures = [
  { id: 'lead-management', label: 'Lead Management System', icon: Users },
  { id: 'portfolio-showcase', label: 'Portfolio Showcase', icon: Camera },
  { id: 'booking-calendar', label: 'Booking & Calendar Management', icon: MapPin },
  { id: 'client-communication', label: 'Client Communication Tools', icon: Heart },
  { id: 'payment-processing', label: 'Payment Processing', icon: Sparkles },
  { id: 'analytics-reporting', label: 'Analytics & Reporting', icon: CheckCircle },
];

const australianStates = [
  'New South Wales',
  'Victoria', 
  'Queensland',
  'Western Australia',
  'South Australia',
  'Tasmania',
  'Australian Capital Territory',
  'Northern Territory',
  'Auckland (NZ)',
  'Wellington (NZ)',
  'Canterbury (NZ)',
  'Other NZ Region'
];

export function EarlyAccessForm() {
  const [activeTab, setActiveTab] = useState<'user' | 'supplier'>('user');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [userFormData, setUserFormData] = useState<FormData>({
    full_name: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    relationship_status: '',
    role: '',
    desired_features: [],
    additional_comments: '',
    referral_source: ''
  });

  const [supplierFormData, setSupplierFormData] = useState<SupplierFormData>({
    business_name: '',
    contact_person: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    business_category: '',
    years_experience: 0,
    current_client_base: '',
    desired_features: [],
    additional_comments: '',
    website: ''
  });

  const handleUserFeatureToggle = (featureId: string) => {
    setUserFormData(prev => ({
      ...prev,
      desired_features: prev.desired_features.includes(featureId)
        ? prev.desired_features.filter(f => f !== featureId)
        : [...prev.desired_features, featureId]
    }));
  };

  const handleSupplierFeatureToggle = (featureId: string) => {
    setSupplierFormData(prev => ({
      ...prev,
      desired_features: prev.desired_features.includes(featureId)
        ? prev.desired_features.filter(f => f !== featureId)
        : [...prev.desired_features, featureId]
    }));
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('early_access_users')
        .insert([userFormData]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "This email is already registered for early access.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setIsSubmitted(true);
      toast({
        title: "Registration Successful!",
        description: "You're now on our exclusive early access list.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('early_access_suppliers')
        .insert([supplierFormData]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "This email is already registered for early access.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setIsSubmitted(true);
      toast({
        title: "Registration Successful!",
        description: "You're now on our exclusive supplier early access list.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h3 className="text-luxury-md text-foreground mb-4">
          Welcome to the Founders Circle!
        </h3>
        <p className="text-body-lg text-muted-foreground mb-6 max-w-md mx-auto">
          You'll receive an exclusive invitation email when Mēl Milaap launches with your 3 months of free premium access.
        </p>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Founder Member Benefits Unlocked
        </Badge>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tab Selector */}
      <div className="flex bg-card rounded-xl p-1 mb-8 shadow-soft">
        <button
          onClick={() => setActiveTab('user')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
            activeTab === 'user' 
              ? 'bg-primary text-primary-foreground shadow-elegant' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Find Love</span>
        </button>
        <button
          onClick={() => setActiveTab('supplier')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
            activeTab === 'supplier' 
              ? 'bg-primary text-primary-foreground shadow-elegant' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Partner with Us</span>
        </button>
      </div>

      {activeTab === 'user' ? (
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-center text-luxury-md text-foreground">
              Join the Founders Circle
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Be among the first to find your perfect match with exclusive benefits
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUserSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    required
                    value={userFormData.full_name}
                    onChange={(e) => setUserFormData({...userFormData, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={userFormData.mobile}
                    onChange={(e) => setUserFormData({...userFormData, mobile: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={userFormData.city}
                    onChange={(e) => setUserFormData({...userFormData, city: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State/Region *</Label>
                  <Select onValueChange={(value) => setUserFormData({...userFormData, state: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {australianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship_status">Relationship Status</Label>
                  <Select onValueChange={(value) => setUserFormData({...userFormData, relationship_status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="engaged">Engaged</SelectItem>
                      <SelectItem value="looking-for-child">Looking for my child</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Role *</Label>
                <Select onValueChange={(value) => setUserFormData({...userFormData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride</SelectItem>
                    <SelectItem value="groom">Groom</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="relative">Family Member/Relative</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Which features are most important to you? (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={feature.id}
                        checked={userFormData.desired_features.includes(feature.id)}
                        onCheckedChange={() => handleUserFeatureToggle(feature.id)}
                      />
                      <Label htmlFor={feature.id} className="flex items-center space-x-2 cursor-pointer">
                        <feature.icon className="w-4 h-4 text-accent" />
                        <span>{feature.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_comments">What else would you like to see on the platform?</Label>
                <Textarea
                  id="additional_comments"
                  rows={3}
                  value={userFormData.additional_comments}
                  onChange={(e) => setUserFormData({...userFormData, additional_comments: e.target.value})}
                  placeholder="Share your thoughts and suggestions..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral_source">How did you hear about us?</Label>
                <Select onValueChange={(value) => setUserFormData({...userFormData, referral_source: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="friend-family">Friend or Family</SelectItem>
                    <SelectItem value="google-search">Google Search</SelectItem>
                    <SelectItem value="community-event">Community Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="luxury" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Securing Your Spot...</span>
                  </div>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Secure My Founder Access
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-center text-luxury-md text-foreground">
              Partner with Mēl Milaap
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Join our exclusive supplier network and grow your wedding business
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSupplierSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    required
                    value={supplierFormData.business_name}
                    onChange={(e) => setSupplierFormData({...supplierFormData, business_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person *</Label>
                  <Input
                    id="contact_person"
                    required
                    value={supplierFormData.contact_person}
                    onChange={(e) => setSupplierFormData({...supplierFormData, contact_person: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier_email">Email Address *</Label>
                  <Input
                    id="supplier_email"
                    type="email"
                    required
                    value={supplierFormData.email}
                    onChange={(e) => setSupplierFormData({...supplierFormData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier_mobile">Mobile Number</Label>
                  <Input
                    id="supplier_mobile"
                    type="tel"
                    value={supplierFormData.mobile}
                    onChange={(e) => setSupplierFormData({...supplierFormData, mobile: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier_city">City</Label>
                  <Input
                    id="supplier_city"
                    value={supplierFormData.city}
                    onChange={(e) => setSupplierFormData({...supplierFormData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier_state">State/Region *</Label>
                  <Select onValueChange={(value) => setSupplierFormData({...supplierFormData, state: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {australianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_category">Business Category *</Label>
                  <Select onValueChange={(value) => setSupplierFormData({...supplierFormData, business_category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venue">Venues</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="videography">Videography</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="decoration">Decoration & Flowers</SelectItem>
                      <SelectItem value="music">Music & Entertainment</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="makeup">Makeup & Beauty</SelectItem>
                      <SelectItem value="jewelry">Jewelry & Accessories</SelectItem>
                      <SelectItem value="clothing">Wedding Attire</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years_experience">Years of Experience</Label>
                  <Input
                    id="years_experience"
                    type="number"
                    min="0"
                    value={supplierFormData.years_experience || ''}
                    onChange={(e) => setSupplierFormData({...supplierFormData, years_experience: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_client_base">Current Client Base</Label>
                  <Select onValueChange={(value) => setSupplierFormData({...supplierFormData, current_client_base: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (0-10 clients/year)</SelectItem>
                      <SelectItem value="small">Small (11-50 clients/year)</SelectItem>
                      <SelectItem value="medium">Medium (51-100 clients/year)</SelectItem>
                      <SelectItem value="large">Large (100+ clients/year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={supplierFormData.website}
                    onChange={(e) => setSupplierFormData({...supplierFormData, website: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Which platform features interest you most? (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {supplierFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={feature.id}
                        checked={supplierFormData.desired_features.includes(feature.id)}
                        onCheckedChange={() => handleSupplierFeatureToggle(feature.id)}
                      />
                      <Label htmlFor={feature.id} className="flex items-center space-x-2 cursor-pointer">
                        <feature.icon className="w-4 h-4 text-accent" />
                        <span>{feature.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier_comments">What features would help grow your business?</Label>
                <Textarea
                  id="supplier_comments"
                  rows={3}
                  value={supplierFormData.additional_comments}
                  onChange={(e) => setSupplierFormData({...supplierFormData, additional_comments: e.target.value})}
                  placeholder="Tell us about your business goals and needs..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="luxury" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Securing Your Partnership...</span>
                  </div>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    Join Our Partner Network
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}