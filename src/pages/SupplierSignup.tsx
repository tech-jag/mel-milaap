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
  Building2, 
  ChevronRight,
  ChevronLeft,
  MapPin,
  Camera,
  Crown,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SupplierData {
  // Step 1: Business Details
  businessName: string;
  description: string;
  website: string;
  phone: string;
  
  // Step 2: Categories & Locations
  categories: string[];
  city: string;
  regions: string[];
  priceRange: string;
  capacityMin: number;
  capacityMax: number;
  
  // Step 3: Gallery & Plan
  photos: string[];
  plan: 'free' | 'featured' | 'premium';
}

const SupplierSignup = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [supplierData, setSupplierData] = React.useState<SupplierData>({
    businessName: '',
    description: '',
    website: '',
    phone: '',
    categories: [],
    city: '',
    regions: [],
    priceRange: '',
    capacityMin: 0,
    capacityMax: 0,
    photos: [],
    plan: 'free'
  });

  const categories = [
    'Venue', 'Photography', 'Catering', 'Florist', 'Music/DJ', 
    'Videography', 'Wedding Cake', 'Transport', 'Wedding Dress',
    'Makeup Artist', 'Hair Stylist', 'Decorations', 'Entertainment'
  ];

  const cities = [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
    'Auckland', 'Wellington', 'Christchurch'
  ];

  const regions = [
    'CBD', 'Inner West', 'Eastern Suburbs', 'Northern Beaches',
    'Hills District', 'Western Sydney', 'South Coast', 'Hunter Valley'
  ];

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);
    setIsLoading(false);
  };

  const handleCategoryToggle = (category: string) => {
    setSupplierData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleRegionToggle = (region: string) => {
    setSupplierData(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitSupplierProfile = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('suppliers')
        .insert({
          user_id: currentUser.id,
          business_name: supplierData.businessName,
          description: supplierData.description,
          website: supplierData.website || null,
          categories: supplierData.categories,
          city: supplierData.city,
          regions: supplierData.regions,
          price_band: supplierData.priceRange || null,
          capacity_min: supplierData.capacityMin || null,
          capacity_max: supplierData.capacityMax || null,
          photos: supplierData.photos,
          plan: supplierData.plan,
          verified: false
        });

      if (error) throw error;

      toast({
        title: "Supplier profile created!",
        description: "Your profile has been submitted for review.",
      });

      // Redirect to supplier dashboard
      window.location.href = '/supplier/dashboard';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
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
            className="max-w-4xl mx-auto text-center"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                Supplier Registration
              </Badge>
              <h1 className="text-luxury-xl text-foreground mb-6">
                Join Our Supplier Network
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect with couples planning their perfect wedding. Create your profile in 3 simple steps.
              </p>
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    {step < 3 && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            
            <motion.div variants={fadeInUp}>
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle>
                    {currentStep === 1 && "Step 1: Business Details"}
                    {currentStep === 2 && "Step 2: Categories & Locations"}
                    {currentStep === 3 && "Step 3: Gallery & Plan"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Step 1: Business Details */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label>Business Name *</Label>
                        <Input
                          value={supplierData.businessName}
                          onChange={(e) => setSupplierData(prev => ({...prev, businessName: e.target.value}))}
                          placeholder="Your Wedding Business"
                        />
                      </div>
                      
                      <div>
                        <Label>Description *</Label>
                        <Textarea
                          value={supplierData.description}
                          onChange={(e) => setSupplierData(prev => ({...prev, description: e.target.value}))}
                          placeholder="Tell couples about your services and what makes you special..."
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Website</Label>
                          <Input
                            value={supplierData.website}
                            onChange={(e) => setSupplierData(prev => ({...prev, website: e.target.value}))}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <Input
                            value={supplierData.phone}
                            onChange={(e) => setSupplierData(prev => ({...prev, phone: e.target.value}))}
                            placeholder="+61 400 000 000"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Categories & Locations */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <Label>Service Categories *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                          {categories.map((category) => (
                            <div
                              key={category}
                              className={`p-3 border rounded-lg cursor-pointer text-center text-sm transition-colors ${
                                supplierData.categories.includes(category)
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:bg-muted'
                              }`}
                              onClick={() => handleCategoryToggle(category)}
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Primary City *</Label>
                        <select 
                          className="w-full p-2 border border-border rounded-md bg-background"
                          value={supplierData.city}
                          onChange={(e) => setSupplierData(prev => ({...prev, city: e.target.value}))}
                        >
                          <option value="">Select your city</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label>Service Regions</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                          {regions.map((region) => (
                            <div
                              key={region}
                              className={`p-2 border rounded-lg cursor-pointer text-center text-sm transition-colors ${
                                supplierData.regions.includes(region)
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:bg-muted'
                              }`}
                              onClick={() => handleRegionToggle(region)}
                            >
                              {region}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Price Range</Label>
                          <select 
                            className="w-full p-2 border border-border rounded-md bg-background"
                            value={supplierData.priceRange}
                            onChange={(e) => setSupplierData(prev => ({...prev, priceRange: e.target.value}))}
                          >
                            <option value="">Select range</option>
                            <option value="$">$ (Budget)</option>
                            <option value="$$">$$ (Mid-range)</option>
                            <option value="$$$">$$$ (Premium)</option>
                            <option value="$$$$">$$$$ (Luxury)</option>
                          </select>
                        </div>
                        <div>
                          <Label>Min Capacity</Label>
                          <Input
                            type="number"
                            value={supplierData.capacityMin}
                            onChange={(e) => setSupplierData(prev => ({...prev, capacityMin: parseInt(e.target.value) || 0}))}
                            placeholder="10"
                          />
                        </div>
                        <div>
                          <Label>Max Capacity</Label>
                          <Input
                            type="number"
                            value={supplierData.capacityMax}
                            onChange={(e) => setSupplierData(prev => ({...prev, capacityMax: parseInt(e.target.value) || 0}))}
                            placeholder="200"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Gallery & Plan */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <Label>Photo Gallery</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                          <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">
                            Upload photos of your work, venue, or services
                          </p>
                          <Button variant="outline" disabled>
                            <Camera className="w-4 h-4 mr-2" />
                            Upload Photos (Coming Soon)
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Choose Your Plan</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          {[
                            {
                              id: 'free',
                              name: 'Free',
                              price: 'AUD 0/month',
                              features: ['Basic listing', 'Contact form', 'Limited photos']
                            },
                            {
                              id: 'featured',
                              name: 'Featured',
                              price: 'AUD 149/month',
                              features: ['Featured placement', 'Unlimited photos', 'Priority support']
                            },
                            {
                              id: 'premium',
                              name: 'Premium',
                              price: 'AUD 299/month',
                              features: ['Top placement', 'Analytics', 'Lead management']
                            }
                          ].map((plan) => (
                            <div
                              key={plan.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                supplierData.plan === plan.id
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:bg-muted'
                              }`}
                              onClick={() => setSupplierData(prev => ({...prev, plan: plan.id as any}))}
                            >
                              <div className="text-center">
                                {plan.id === 'premium' && <Crown className="w-6 h-6 text-primary mx-auto mb-2" />}
                                <h4 className="font-medium text-foreground mb-1">{plan.name}</h4>
                                <p className="text-sm text-primary font-medium mb-3">{plan.price}</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {plan.features.map((feature, index) => (
                                    <li key={index}>• {feature}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button 
                      variant="outline" 
                      onClick={previousStep}
                      disabled={currentStep === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    {currentStep < 3 ? (
                      <Button onClick={nextStep}>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={submitSupplierProfile}>
                        Create Profile
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>

                </CardContent>
              </Card>
            </motion.div>
            
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupplierSignup;