"use client";



import * as React from "react";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";

import { Link } from "react-router-dom";

import { FloralBranding } from "@/components/ui/FloralBranding";



import { 

  Heart, 

  Shield, 

  Users, 

  Star, 

  Sparkles,

  CheckCircle,

  ArrowRight,

  Globe,

  Award,

  TrendingUp,

  MapPin,

  Camera,

  Building2,

  Utensils,

  Palette,

  HomeIcon,

  Crown,

  UserCheck,

  Lock,

  MessageCircle,

  AlertTriangle,

  Clock,

  DollarSign,

  Target,

  Link2,

  Zap,

  Phone,

  Mail,

  Calendar,

  Gem

} from "lucide-react";

import { fadeInUp, staggerChildren, cardHover } from "@/lib/motion";

import { SEO } from "@/utils/seo";

import MelMilaapText from "@/components/brand/MelMilaapText";



import heroImage from "@/assets/hero-wedding-couple.jpg";



// ANZ Platform Features

const anzPlatformFeatures = [

  {

    icon: Link2,

    title: "ANZ-Specialized Matching",

    description: "Advanced matching designed specifically for Australia & New Zealand's South Asian diaspora, considering regional lifestyle and cultural integration"

  },

  {

    icon: Star,

    title: "Local Cultural Understanding", 

    description: "Deep understanding of South Asian community life in Australia & New Zealand - from Diwali celebrations to weekend temple visits"

  },

  {

    icon: Building2,

    title: "Regional Wedding Expertise",

    description: "Connected to Australia & New Zealand's best South Asian wedding vendors, venues, and cultural specialists"

  },

  {

    icon: Crown,

    title: "Local Premium Partners",

    description: "Hand-selected Australian & New Zealand vendors who understand South Asian celebrations and cultural requirements"

  }

];



// How It Works Steps

const howItWorksSteps = [

  {

    number: "01",

    icon: UserCheck,

    title: "MEET",

    subtitle: "Create your profile and browse verified matches",

    description: "Build a comprehensive profile with photos, preferences, and cultural background. Connect with genuine, quality conscious individuals who share your values and expectations.",

    features: ["Profile verification required", "Photo authentication", "Background checks"]

  },

  {

    number: "02", 

    icon: Heart,

    title: "MATCH",

    subtitle: "Connect with compatible South Asian singles in Australia & New Zealand",

    description: "Our advanced matching algorithm considers cultural compatibility, regional preferences, and family values to suggest the most suitable matches for a lasting relationship.",

    features: ["Advanced compatibility", "Cultural alignment", "Regional focus"]

  },

  {

    number: "03",

    icon: Crown,

    title: "MARRY", 

    subtitle: "Build meaningful connections that lead to marriage",

    description: "Engage in safe, monitored communication with family involvement. Focus on serious matrimonial intentions and build trust via traditional engagement methods.",

    features: ["Safe communication", "Family involvement", "Matrimonial focus"]

  },

  {

    number: "04",

    icon: Sparkles,

    title: "CELEBRATE",

    subtitle: "Plan your dream wedding with our vendor network",

    description: "Access our curated network of premium wedding vendors across Australia & New Zealand. Dream, plan, and execute your beautiful South Asian celebration ceremony.",

    features: ["Premium vendor network", "Wedding planning", "Celebration management"]

  }

];



// Perfect Match Features

const perfectMatchFeatures = [

  {

    icon: UserCheck,

    title: "Verified Premium Profiles",

    description: "Every profile undergoes thorough verification and background checks. Connect with genuine, quality conscious individuals who share your values and expectations."

  },

  {

    icon: Heart,

    title: "Cultural Compatibility", 

    description: "Deep understanding of South Asian matrimonial traditions, family values, and cultural nuances. Find matches who truly understand your heritage and modern lifestyle."

  },

  {

    icon: MapPin,

    title: "Australia & NZ Expertise",

    description: "Specialized focus on the unique diaspora dynamics in Australia and New Zealand. Local cultural understanding meets global South Asian heritage."

  },

  {

    icon: Users,

    title: "Personalized Matching",

    description: "Advanced algorithms combined with human insight. Cultural preferences, regional values, and lifestyle compatibility ensure meaningful connections."

  },

  {

    icon: Shield,

    title: "Privacy & Safety First",

    description: "Best-in-class security, complete privacy controls, and family-friendly environment. Your personal information and matching preferences stay secure."

  },

  {

    icon: Crown,

    title: "Premium Experience",

    description: "Quality over quantity, dedicated support, and success stories that speak to our commitment to your happiness."

  }

];



// Safety Features

const safetyFeatures = [

  {

    icon: UserCheck,

    title: "100% Profile Verification",

    description: "Comprehensive verification process including government ID verification for authentic connections",

    stats: ["ID verification", "Photo authentication", "Background screening"]

  },

  {

    icon: Lock,

    title: "Advanced Privacy Control", 

    description: "You control who sees your photos and personal information with granular privacy settings",

    stats: ["Private photo control", "Selective visibility", "Information control"]

  },

  {

    icon: AlertTriangle,

    title: "Safe Communication",

    description: "All communications happen securely within the platform with continuous safety monitoring",

    stats: ["Monitored messaging", "Report & block features", "Safe environment"]

  },

  {

    icon: Phone,

    title: "Scam Prevention",

    description: "Advanced fraud detection and prevention systems help maintain an authentic community",

    stats: ["Fraud detection", "Authentic profiles", "Scam prevention"]

  }

];



// Trust Statistics 

const trustStats = [

  { value: "87%", label: "Match success rate within 6 months", sublabel: "Based on member surveys" },

  { value: "50,000+", label: "Verified premium profiles across ANZ", sublabel: "Growing community" },

  { value: "4.9★", label: "Average user satisfaction rating", sublabel: "From verified reviews" }

];



// Market Statistics

const marketStats = [

  { value: "$75,000+", label: "Average wedding budget in Australia & NZ", color: "text-lux-champagne" },

  { value: "150,000+", label: "South Asian families across both regions", color: "text-lux-champagne" },

  { value: "25%", label: "Annual growth in premium wedding spending", color: "text-lux-champagne" }

];



// Supplier Partnership Benefits 

const partnerBenefits = [

  {

    title: "Premium Client Base",

    description: "Access to families with higher budgets and quality expectations"

  },

  {

    title: "Cultural Specialization", 

    description: "Clients who value authentic South Asian wedding traditions"

  },

  {

    title: "Regional Expertise",

    description: "Dominate the Australia & New Zealand luxury wedding market"

  },

  {

    title: "Marketing Support",

    description: "Featured listings, promotional opportunities, and platform marketing"

  }

];



// Platform Benefits for Suppliers

const platformBenefits = [

  {

    title: "Easy Booking Management",

    description: "Streamlined client communication and booking workflow"

  },

  {

    title: "Portfolio Showcase",

    description: "Professional gallery to display your best work to engaged couples" 

  },

  {

    title: "Verified Reviews",

    description: "Build trust with authentic client testimonials and ratings"

  },

  {

    title: "Analytics & Insights", 

    description: "Track performance and optimize your listing for better results"

  }

];



// Supplier Service Categories

const supplierCategories = [

  {

    icon: Camera,

    title: "Photography & Videography",

    description: "Capture premium celebrations with discerning clients who value excellence"

  },

  {

    icon: Building2,

    title: "Premium Venues",

    description: "Showcase your venue to families planning luxury multi-day celebrations"

  },

  {

    icon: Utensils,

    title: "Catering & Events", 

    description: "Serve authentic cuisine to guests who appreciate cultural traditions"

  },

  {

    icon: Palette,

    title: "Wedding Services",

    description: "From decor to music - connect with premium South Asian families"

  }

];



// Success Stories

const successStories = [

  {

    quote: "We found each other through Mēl Milaap and couldn't be happier. The platform truly understands our cultural values.",

    names: "Priya & Arjun",

    location: "Sydney, Australia"

  },

  {

    quote: "The wedding planning tools made our celebration perfect. Everything in one place!",

    names: "Kavya & Vikram", 

    location: "Melbourne, Australia"

  },

  {

    quote: "Our families loved being involved in the process. Mēl Milaap respects our traditions.",

    names: "Anisha & Raj",

    location: "Auckland, New Zealand"

  }

];



// Key features

const features = [

  { 

    icon: Users, 

    title: "Verified Profiles", 

    description: "All members are verified for authenticity and safety"

  },

  { 

    icon: Shield, 

    title: "Privacy First", 

    description: "Your personal information is protected with highest security"

  },

  { 

    icon: Heart, 

    title: "Smart Matching", 

    description: "Advanced algorithm finds your most compatible matches"

  },

  { 

    icon: Globe, 

    title: "ANZ Community", 

    description: "Focused on Australia & New Zealand South Asian community"

  },

];



// Success stats

const stats = [

  { icon: Users, value: "50,000+", label: "Active Members" },

  { icon: Heart, value: "15,000+", label: "Success Stories" }, 

  { icon: MapPin, value: "100+", label: "Cities Covered" },

  { icon: Award, value: "6+", label: "Years of Trust" }

];



const Home = () => {

  return (

    <div className="min-h-screen bg-background">



      <SEO 

        title="Mēl Milaap - Australia & New Zealand's Premier South Asian Matrimony Platform"

        description="Find your perfect match in Australia & New Zealand's most trusted South Asian matrimony platform. Join thousands of verified members today."

      />



            {/* Place the single branding component here with z-0 */}

      <FloralBranding variant="homepage" className="z-0" />



      {/* Wrap all page content in a main tag with a higher z-index */}

      <main className="relative z-10 flex flex-col min-h-screen">

        

      {/* Hero Section */}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background Image */}

        <div className="absolute inset-0 z-0">

          <img 

            src={heroImage} 

            alt="Beautiful South Asian wedding couple"

            className="w-full h-full object-cover"

          />

          <div className="absolute inset-0 bg-gradient-to-r from-lux-onyx/70 via-lux-onyx/50 to-transparent" />

        </div>

        

        {/* Hero Content */}

        <div className="relative z-10 container mx-auto px-4 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 30 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.8 }}

            className="max-w-4xl"

          >

            <Badge 

              variant="secondary" 

              className="mb-8 px-6 py-2 text-base bg-lux-porcelain/20 text-lux-porcelain border-lux-champagne/30"

            >

              <Heart className="w-4 h-4 mr-2" />

              Australia & New Zealand's #1 South Asian Matrimony Platform

            </Badge>



            {/* Brand Logo */}

            <div className="mb-8">

              <h1 

                className="text-lux-porcelain font-bold mb-6"

                style={{ 

                  fontFamily: 'Georgia, "Times New Roman", serif',

                  fontSize: 'clamp(3rem, 8vw, 7rem)',

                  letterSpacing: '-0.02em',

                  lineHeight: '0.9'

                }}

              >

                Mēl <span className="text-lux-champagne">Milaap</span>

              </h1>

            </div>

            

            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-lux-porcelain mb-8 leading-tight">

              Find Your Perfect Match

            </h2>

            

            <p className="text-xl md:text-2xl text-lux-porcelain/90 mb-12 leading-relaxed max-w-3xl font-light">

              Join thousands of verified South Asian singles in Australia & New Zealand. 

              <br className="hidden md:block" />

              Discover meaningful connections with those who share your values and traditions.

            </p>

            

            <motion.div

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.8, delay: 0.3 }}

              className="flex flex-wrap gap-4"

            >

              <Button 

                asChild

                variant="luxury" 

                size="xl" 

                className="bg-lux-champagne text-lux-onyx hover:bg-lux-champagne/90 shadow-champagne"

              >

                <Link to="/register">

                  <Heart className="w-5 h-5 mr-2" />

                  Join Now - It's Free

                </Link>

              </Button>

              <Button 

                asChild

                variant="glass" 

                size="xl" 

                className="text-lux-porcelain border-lux-porcelain/30 hover:bg-lux-porcelain/10"

              >

                <Link to="/how-it-works">

                  <ArrowRight className="w-5 h-5 mr-2" />

                  How It Works

                </Link>

              </Button>

            </motion.div>

          </motion.div>

        </div>



        {/* Scroll Indicator */}

        <motion.div

          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          transition={{ delay: 1, duration: 0.5 }}

        >

          <div className="w-6 h-10 border-2 border-lux-porcelain/50 rounded-full flex justify-center">

            <motion.div

              className="w-1 h-3 bg-lux-champagne rounded-full mt-2"

              animate={{ y: [0, 12, 0] }}

              transition={{ duration: 1.5, repeat: Infinity }}

            />

          </div>

        </motion.div>

      </section>



      {/* ANZ Platform Features Section */}

      <section className="py-24 bg-card">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="text-center mb-16"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <h2 className="text-luxury-lg text-foreground mb-6">

              Why Choose Australia & New Zealand's #1 Platform

            </h2>

            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">

              Unlike global platforms that treat Australia as an afterthought, we're built specifically for 

              South Asian communities in ANZ. Local expertise meets premium matrimonial matching.

            </p>

          </motion.div>



          <motion.div

            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"

            variants={staggerChildren}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            {anzPlatformFeatures.map((feature, index) => (

              <motion.div

                key={feature.title}

                variants={{...fadeInUp, ...cardHover}}

                whileHover="hover"

                className="group"

              >

                <Card className="luxury-card h-full text-center group-hover:shadow-luxury transition-all duration-300">

                  <CardContent className="p-8">

                    <div className="w-16 h-16 bg-lux-champagne/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-lux-champagne/20 transition-colors duration-300">

                      <feature.icon className="w-8 h-8 text-lux-champagne" />

                    </div>

                    <h3 className="font-heading font-semibold text-foreground mb-4 text-lg">

                      {feature.title}

                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-sm">

                      {feature.description}

                    </p>

                  </CardContent>

                </Card>

              </motion.div>

            ))}

          </motion.div>

        </div>

      </section>



      {/* How It Works Section */}

      <section className="py-24 bg-gradient-hero">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="text-center mb-16"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <Badge 

              variant="secondary" 

              className="mb-6 px-4 py-2 bg-lux-champagne/10 text-lux-champagne border-lux-champagne/20"

            >

              <Heart className="w-4 h-4 mr-2" />

              Your Journey

            </Badge>

            <h2 className="text-luxury-lg text-foreground mb-6">

              How <MelMilaapText size="lg" melClassName="text-foreground" /> Works

            </h2>

            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">

              Your journey from meeting your perfect match to celebrating your dream wedding

              - simplified into four elegant steps designed for serious matrimonial connections.

            </p>

          </motion.div>



          <motion.div

            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"

            variants={staggerChildren}

            initial="initial"  

            whileInView="animate"

            viewport={{ once: true }}

          >

            {howItWorksSteps.map((step, index) => (

              <motion.div

                key={step.title}

                variants={{...fadeInUp, ...cardHover}}

                whileHover="hover"

                className="group relative"

              >

                <Card className="luxury-card h-full text-center group-hover:shadow-luxury transition-all duration-300 relative overflow-hidden">

                  <div className="absolute top-4 right-4 text-6xl font-bold text-lux-champagne/10 group-hover:text-lux-champagne/20 transition-colors duration-300">

                    {step.number}

                  </div>

                  <CardContent className="p-8 relative z-10">

                  <div className="w-16 h-16 bg-brand-burgundy/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-burgundy/20 transition-colors duration-300">

                    <step.icon className="w-8 h-8 text-brand-burgundy" />

                    </div>

                    <h3 className="font-heading font-bold text-foreground mb-2 text-xl tracking-wider">

                      {step.title}

                    </h3>

                    <p className="font-medium text-accent mb-4 text-sm">

                      {step.subtitle}

                    </p>

                    <p className="text-muted-foreground leading-relaxed text-sm mb-6">

                      {step.description}

                    </p>

                    <div className="space-y-2">

                      {step.features.map((feature, i) => (

                        <div key={i} className="flex items-center justify-center text-xs text-muted-foreground">

                          <CheckCircle className="w-3 h-3 text-lux-champagne mr-2" />

                          {feature}

                        </div>

                      ))}

                    </div>

                  </CardContent>

                </Card>

                

                {/* Connector Line for larger screens */}

                {index < howItWorksSteps.length - 1 && (

                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-lux-champagne/30 transform -translate-y-1/2 z-20" />

                )}

              </motion.div>

            ))}

          </motion.div>

        </div>

      </section>



      {/* Perfect Match Features Section */}

      <section className="py-24 bg-background">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="text-center mb-16"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <h2 className="text-luxury-lg text-foreground mb-6">

              Why Choose <MelMilaapText size="lg" melClassName="text-foreground" /> for Your Perfect Match?

            </h2>

            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto mb-8">

              Experience the premium difference in matrimonial matchmaking designed 

              specifically for South Asian communities in Australia & New Zealand.

            </p>

            <p className="text-brand-burgundy font-medium">

              Unlike generic platforms like shaadi.com, we understand your regional culture 

              and premium expectations.

            </p>

          </motion.div>



          <motion.div

            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"

            variants={staggerChildren}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            {perfectMatchFeatures.map((feature) => (

              <motion.div

                key={feature.title}

                variants={{...fadeInUp, ...cardHover}}

                whileHover="hover"

                className="group"

              >

                <Card className="luxury-card h-full text-center group-hover:shadow-luxury transition-all duration-300">

                  <CardContent className="p-8">

                    <div className="w-16 h-16 bg-lux-champagne/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-lux-champagne/20 transition-colors duration-300">

                      <feature.icon className="w-8 h-8 text-lux-champagne" />

                    </div>

                    <h3 className="font-heading font-semibold text-foreground mb-4 text-lg">

                      {feature.title}

                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-sm">

                      {feature.description}

                    </p>

                  </CardContent>

                </Card>

              </motion.div>

            ))}

          </motion.div>



          {/* Trust Statistics */}

          <motion.div

            className="bg-lux-champagne/5 rounded-2xl p-12"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <div className="text-center mb-8">

              <h3 className="text-2xl font-heading font-bold text-brand-burgundy mb-4">

                Trusted by Australia & New Zealand's South Asian Community

              </h3>

            </div>

            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {trustStats.map((stat, index) => (

                <motion.div

                  key={stat.label}

                  className="text-center"

                  variants={fadeInUp}

                  custom={index}

                >

                  <div className="text-4xl lg:text-5xl font-bold text-lux-champagne mb-2">

                    {stat.value}

                  </div>

                  <div className="font-medium text-foreground mb-1">

                    {stat.label}

                  </div>

                  <div className="text-sm text-muted-foreground">

                    {stat.sublabel}

                  </div>

                </motion.div>

              ))}

            </div>



            <motion.div

              className="text-center mt-12"

              variants={fadeInUp}

            >

              <Button 

                asChild

                variant="luxury" 

                size="xl" 

                className="bg-brand-burgundy text-white hover:bg-brand-burgundy/90 shadow-luxury mr-4"

              >

                <Link to="/register">

                  <Heart className="w-5 h-5 mr-2" />

                  Start Your Journey

                </Link>

              </Button>

              <Button 

                asChild

                variant="outline" 

                size="xl"

                className="border-muted-foreground/30"

              >

                <Link to="/stories">

                  View Success Stories

                </Link>

              </Button>

            </motion.div>

          </motion.div>

        </div>

      </section>



      {/* Safety Section */}

      <section className="py-24 bg-card">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="text-center mb-16"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <Badge 

              variant="secondary" 

              className="mb-6 px-4 py-2 bg-brand-burgundy/10 text-brand-burgundy border-brand-burgundy/20"

            >

              <Shield className="w-4 h-4 mr-2" />

              Security First

            </Badge>

            <h2 className="text-luxury-lg text-foreground mb-6">

              Your Safety is Our <span className="text-brand-burgundy">Priority</span>

            </h2>

            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">

              Australia and New Zealand's most trusted matrimonial platform. Every profile is 

              verified, every message is monitored, and your privacy is protected with bank-

              level security.

            </p>

          </motion.div>



          <motion.div

            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"

            variants={staggerChildren}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            {safetyFeatures.map((feature) => (

              <motion.div

                key={feature.title}

                variants={{...fadeInUp, ...cardHover}}

                whileHover="hover"

                className="group"

              >

                <Card className="luxury-card h-full text-center group-hover:shadow-luxury transition-all duration-300">

                  <CardContent className="p-8">

                  <div className="w-16 h-16 bg-brand-burgundy/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-burgundy/20 transition-colors duration-300">

                    <feature.icon className="w-8 h-8 text-brand-burgundy" />

                    </div>

                    <h3 className="font-heading font-semibold text-foreground mb-4 text-lg">

                      {feature.title}

                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-sm mb-6">

                      {feature.description}

                    </p>

                    <div className="space-y-2">

                      {feature.stats.map((stat, i) => (

                        <div key={i} className="flex items-center justify-center text-xs text-muted-foreground">

                          <CheckCircle className="w-3 h-3 text-lux-champagne mr-2" />

                          {stat}

                        </div>

                      ))}

                    </div>

                  </CardContent>

                </Card>

              </motion.div>

            ))}

          </motion.div>



          {/* Safety Statistics */}

          <motion.div

            className="bg-brand-burgundy/5 rounded-2xl p-12"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <div className="text-center mb-8">

              <h3 className="text-2xl font-heading font-bold text-brand-burgundy mb-4">

                Trusted by 50,000+ Verified Members

              </h3>

            </div>

            

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

              <div className="text-center">

                <div className="text-3xl font-bold text-lux-champagne mb-2">99.2%</div>

                <div className="text-sm text-muted-foreground">Safety Rating</div>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-lux-champagne mb-2">2hrs</div>

                <div className="text-sm text-muted-foreground">Avg Response Time</div>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-lux-champagne mb-2">98.8%</div>

                <div className="text-sm text-muted-foreground">Member Satisfaction</div>

              </div>

              <div className="text-center">

                <div className="text-3xl font-bold text-lux-champagne mb-2">0%</div>

                <div className="text-sm text-muted-foreground">Tolerance for Scams</div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>



      {/* Trust Badges Section - Scrolling */}

      <section className="py-16 bg-gradient-to-r from-brand-cream to-brand-ivory">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="text-center mb-12"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <h2 className="text-2xl font-heading font-bold text-brand-burgundy mb-4">

              Trusted Across Australia & New Zealand

            </h2>

            <p className="text-muted-foreground">

              The most secure and verified matrimonial platform serving South Asian 

              communities in ANZ since 2018

            </p>

          </motion.div>



          {/* Scrolling Trust Badges */}

          <div className="w-full overflow-hidden mb-12 -mx-8 px-8">

            <motion.div

              animate={{ x: [0, -2400] }}

              transition={{ 

                duration: 40, 

                repeat: Infinity, 

                ease: "linear" 

              }}

              className="flex gap-6 items-center whitespace-nowrap min-w-max"

            >

              {[

                { icon: "⭐", text: "5.9★ Rating", subtitle: "User reviews", bg: "bg-blue-50" },

                { icon: "🔒", text: "SSL Secured", subtitle: "256-bit encryption", bg: "bg-green-50" },

                { icon: "🛡️", text: "Data Protected", subtitle: "Privacy compliant", bg: "bg-purple-50" },

                { icon: "✔️", text: "100% Verified", subtitle: "Background checks", bg: "bg-indigo-50" },

                { 

                  icon: "🇦🇺", 

                  text: "Australia Focused", 

                  subtitle: "Local expertise", 

                  bg: "bg-orange-50",

                  flag: "🇦🇺"

                },

                { 

                  icon: "🇳🇿", 

                  text: "New Zealand", 

                  subtitle: "Nationwide coverage", 

                  bg: "bg-pink-50",

                  flag: "🇳🇿"

                },

                { icon: "❤️", text: "50,000+ Users", subtitle: "Active community", bg: "bg-rose-50" },

                { icon: "✅", text: "15,000+ Matches", subtitle: "Success stories", bg: "bg-emerald-50" },

                { icon: "📍", text: "100+ Cities", subtitle: "Cities covered", bg: "bg-yellow-50" },

                { icon: "🎯", text: "6+ Years", subtitle: "Years of trust", bg: "bg-cyan-50" },

                { icon: "📱", text: "Mobile Ready", subtitle: "iOS & Android", bg: "bg-teal-50" },

                { icon: "🏆", text: "Premium Service", subtitle: "Verified profiles", bg: "bg-amber-50" },

                // Repeat for seamless loop

                { icon: "⭐", text: "5.9★ Rating", subtitle: "User reviews", bg: "bg-blue-50" },

                { icon: "🔒", text: "SSL Secured", subtitle: "256-bit encryption", bg: "bg-green-50" },

                { icon: "🛡️", text: "Data Protected", subtitle: "Privacy compliant", bg: "bg-purple-50" },

                { icon: "✔️", text: "100% Verified", subtitle: "Background checks", bg: "bg-indigo-50" }

              ].map((badge, index) => (

                <div 

                  key={index} 

                  className={`flex items-center gap-3 ${badge.bg} backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105`}

                >

                  <span className="text-2xl">

                    {badge.flag ? badge.flag : badge.icon}

                  </span>

                  <div className="text-left">

                    <div className="font-semibold text-brand-burgundy text-sm">{badge.text}</div>

                    <div className="text-xs text-gray-600">{badge.subtitle}</div>

                  </div>

                </div>

              ))}

            </motion.div>

          </div>



          <motion.div

            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"

            variants={staggerChildren}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            {stats.map((stat) => (

              <motion.div

                key={stat.label}

                className="text-center"

                variants={fadeInUp}

              >

                <div className="w-16 h-16 bg-lux-champagne/10 rounded-xl flex items-center justify-center mx-auto mb-4">

                  <stat.icon className="w-8 h-8 text-lux-champagne" />

                </div>

                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-2">

                  {stat.value}

                </div>

                <div className="text-muted-foreground text-sm">

                  {stat.label}

                </div>

              </motion.div>

            ))}

          </motion.div>

        </div>

      </section>



      {/* Success Stories Section */}

      <section className="py-24 bg-gradient-to-br from-brand-burgundy to-brand-burgundy/90 text-white">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="text-center mb-16"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <h2 className="text-luxury-lg text-white mb-6">

              Over 50,000 Success Stories

            </h2>

            <p className="text-xl text-white/90 max-w-3xl mx-auto">

              Join thousands of couples across Australia & New Zealand who found their perfect 

              match through Mēl Milaap's regional expertise

            </p>

          </motion.div>



          <motion.div

            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"

            variants={staggerChildren}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            {successStories.map((story, index) => (

              <motion.div

                key={index}

                variants={{...fadeInUp, ...cardHover}}

                whileHover="hover"

                className="group"

              >

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full group-hover:bg-white/20 transition-all duration-300">

                  <CardContent className="p-8">

                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">

                      <div className="w-8 h-8 bg-white/30 rounded-full" />

                    </div>

                    <p className="text-white/90 leading-relaxed mb-6 italic">

                      "{story.quote}"

                    </p>

                    <div className="text-center">

                      <div className="font-semibold text-lux-champagne mb-1">

                        {story.names}

                      </div>

                      <div className="text-white/70 text-sm">

                        {story.location}

                      </div>

                    </div>

                  </CardContent>

                </Card>

              </motion.div>

            ))}

          </motion.div>



          <motion.div

            className="text-center"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <p className="text-white/90 mb-8 text-lg">

              Join 50,000+ South Asian singles across Australia & New Zealand who trust Mēl Milaap as their premier 

              regional matrimonial platform

            </p>

            <Button 

              asChild

              variant="luxury" 

              size="xl" 

              className="bg-white text-brand-burgundy hover:bg-white/90 shadow-luxury"

            >

              <Link to="/register">

                Join Free Today

              </Link>

            </Button>

          </motion.div>

        </div>

      </section>



      {/* Market Statistics Section */}

      <section className="py-24 bg-background">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="bg-gradient-to-br from-lux-champagne/5 to-lux-champagne/10 rounded-3xl p-12"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <div className="text-center mb-16">

              <h2 className="text-luxury-lg text-brand-burgundy mb-6">

                The Premium South Asian Wedding Market

              </h2>

            </div>



            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

              {marketStats.map((stat, index) => (

                <motion.div

                  key={stat.label}

                  className="text-center"

                  variants={fadeInUp}

                  custom={index}

                >

                  <div className={`text-5xl lg:text-6xl font-bold mb-4 ${stat.color}`}>

                    {stat.value}

                  </div>

                  <div className="text-foreground font-medium">

                    {stat.label}

                  </div>

                </motion.div>

              ))}

            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              <div>

                <h3 className="text-xl font-heading font-bold text-foreground mb-6">

                  Why Partner With <MelMilaapText size="md" melClassName="text-foreground" />?

                </h3>

                <div className="space-y-4">

                  {partnerBenefits.map((benefit, index) => (

                    <div key={index} className="flex items-start space-x-3">

                      <CheckCircle className="w-5 h-5 text-lux-champagne mt-0.5 flex-shrink-0" />

                      <div>

                        <h4 className="font-semibold text-foreground mb-1">

                          {benefit.title}

                        </h4>

                        <p className="text-muted-foreground text-sm">

                          {benefit.description}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>



              <div>

                <h3 className="text-xl font-heading font-bold text-foreground mb-6">

                  Platform Benefits

                </h3>

                <div className="space-y-4">

                  {platformBenefits.map((benefit, index) => (

                    <div key={index} className="flex items-start space-x-3">

                      <CheckCircle className="w-5 h-5 text-lux-champagne mt-0.5 flex-shrink-0" />

                      <div>

                        <h4 className="font-semibold text-foreground mb-1">

                          {benefit.title}

                        </h4>

                        <p className="text-muted-foreground text-sm">

                          {benefit.description}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>



      {/* Supplier Partnership Section */}

      <section className="py-24 bg-card">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="text-center mb-16"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <h2 className="text-luxury-lg text-foreground mb-6">

              Partner With <MelMilaapText size="lg" melClassName="text-brand-burgundy" />

            </h2>

            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto mb-8">

              Join Australia and New Zealand's premier South Asian matrimonial platform. Connect with 

              premium clients planning luxury celebrations worth $50,000+ and grow your business.

            </p>

            

            <div className="flex flex-wrap justify-center gap-6 mb-12">

              <Badge variant="secondary" className="px-4 py-2 bg-lux-champagne/10 text-lux-champagne border-lux-champagne/20">

                Australia

              </Badge>

              <Badge variant="secondary" className="px-4 py-2 bg-lux-champagne/10 text-lux-champagne border-lux-champagne/20">

                New Zealand  

              </Badge>

              <Badge variant="secondary" className="px-4 py-2 bg-lux-champagne/10 text-lux-champagne border-lux-champagne/20">

                Premium Weddings

              </Badge>

            </div>

          </motion.div>



          <motion.div

            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"

            variants={staggerChildren}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            {supplierCategories.map((category) => (

              <motion.div

                key={category.title}

                variants={{...fadeInUp, ...cardHover}}

                whileHover="hover"

                className="group"

              >

                <Card className="luxury-card h-full text-center group-hover:shadow-luxury transition-all duration-300">

                  <CardContent className="p-8">

                    <div className="w-16 h-16 bg-lux-champagne/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-lux-champagne/20 transition-colors duration-300">

                      <category.icon className="w-8 h-8 text-lux-champagne" />

                    </div>

                    <h3 className="font-heading font-semibold text-brand-burgundy mb-4 text-lg">

                      {category.title}

                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-sm">

                      {category.description}

                    </p>

                  </CardContent>

                </Card>

              </motion.div>

            ))}

          </motion.div>



          <motion.div

            className="bg-gradient-to-br from-brand-burgundy to-brand-saffron rounded-2xl p-12 text-white text-center"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <h3 className="text-2xl font-heading font-bold mb-4">

              Ready to Grow Your Wedding Business?

            </h3>

            <p className="text-white/90 mb-8 max-w-2xl mx-auto">

              Join the leading platform connecting premium South Asian couples with 

              exceptional wedding vendors across Australia and New Zealand.

            </p>

            

            <div className="flex flex-wrap justify-center gap-4">

                <Button 

                  asChild

                  variant="luxury" 

                  size="xl" 

                  className="bg-white text-brand-burgundy hover:bg-white/90 shadow-luxury"

                >

                <Link to="/supplier-signup">

                  Partner With Us

                </Link>

              </Button>

              <Button 

                asChild

                variant="outline" 

                size="xl"

                className="border-white/30 text-white hover:bg-white/10"

              >

                <Link to="/suppliers">

                  Learn More

                </Link>

              </Button>

            </div>

            

            <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm text-white/80">

              <div className="flex items-center">

                <CheckCircle className="w-4 h-4 mr-2" />

                Free to join

              </div>

              <div className="flex items-center">

                <CheckCircle className="w-4 h-4 mr-2" />

                Verified partner network

              </div>

              <div className="flex items-center">

                <CheckCircle className="w-4 h-4 mr-2" />

                Premium market access

              </div>

            </div>

          </motion.div>

        </div>

      </section>



      {/* Final CTA Section */}

      <section className="py-24 bg-background">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div

            className="text-center max-w-4xl mx-auto"

            variants={fadeInUp}

            initial="initial"

            whileInView="animate"

            viewport={{ once: true }}

          >

            <h2 className="text-luxury-lg text-foreground mb-6">

              Ready to Begin Your Journey?

            </h2>

            <p className="text-body-lg text-muted-foreground mb-12 max-w-2xl mx-auto">

              Join 50,000+ South Asian singles across Australia & New Zealand who trust Mēl Milaap as their premier 

              regional matrimonial platform

            </p>

            

            <div className="flex flex-wrap justify-center gap-4 mb-8">

              <Button 

                asChild

                variant="luxury" 

                size="xl" 

                className="bg-brand-burgundy text-white hover:bg-brand-burgundy/90 shadow-luxury"

              >

                <Link to="/register">

                  <Heart className="w-5 h-5 mr-2" />

                  Join Free Today

                </Link>

              </Button>

              <Button 

                asChild

                variant="outline" 

                size="xl"

              >

                <Link to="/stories">

                  <Star className="w-5 h-5 mr-2" />

                  See Success Stories

                </Link>

              </Button>

            </div>



            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">

              <div className="flex items-center">

                <CheckCircle className="w-4 h-4 mr-2 text-lux-champagne" />

                Free to join • No credit card required

              </div>

              <div className="flex items-center">

                <CheckCircle className="w-4 h-4 mr-2 text-lux-champagne" />

                Australia & New Zealand's most trusted platform

              </div>

            </div>

          </motion.div>

        </div>

      </section>



      </main>

    </div>

  );

};



export default Home;