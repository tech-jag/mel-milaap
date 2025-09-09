import React from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap, Heart, MessageCircle, Eye, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Gold",
    duration: "1 Month",
    price: "AUD 103",
    originalPrice: "AUD 133",
    popular: false,
    features: [
      "Send unlimited Messages",
      "View upto 150 Contact Numbers",
      "1 Stand Live passess (worth AUD60)",
      "Enhanced Customer Service"
    ],
    icon: <Star className="h-6 w-6" />,
    color: "from-yellow-400 to-yellow-600"
  },
  {
    name: "Gold Plus",
    duration: "3 Months", 
    price: "AUD 133",
    originalPrice: "AUD 199",
    popular: true,
    features: [
      "Send unlimited Messages",
      "View upto 150 Contact Numbers", 
      "1 Stand Live passess (worth AUD60)",
      "Standard from other Premium Users",
      "Enhanced Customer Service"
    ],
    icon: <Crown className="h-6 w-6" />,
    color: "from-orange-400 to-orange-600"
  },
  {
    name: "Diamond",
    duration: "6 Months",
    price: "AUD 155", 
    originalPrice: "AUD 299",
    popular: false,
    features: [
      "Send unlimited Messages",
      "Send unlimited Messages", 
      "1 Stand Live passess (worth AUD60)",
      "Standard from other Premium Users",
      "Enhanced Customer Service"
    ],
    icon: <Zap className="h-6 w-6" />,
    color: "from-blue-400 to-blue-600"
  },
  {
    name: "Diamond Plus",
    duration: "6 Months",
    price: "AUD 199",
    originalPrice: "AUD 399", 
    popular: false,
    features: [
      "Send unlimited Messages",
      "Send unlimited Messages",
      "1 Stand Live passess (worth AUD60)",
      "Standard from other Premium Users", 
      "Enhanced Customer Service"
    ],
    icon: <Crown className="h-6 w-6" />,
    color: "from-purple-400 to-purple-600"
  },
  {
    name: "Platinum Plus",
    duration: "12 Months",
    price: "AUD 288",
    originalPrice: "AUD 599",
    popular: false,
    features: [
      "Send unlimited Messages", 
      "View upto 600 Contact Numbers",
      "1 Stand Live passess (worth AUD60)",
      "Standard from other Premium Users",
      "Enhanced Customer Service"
    ],
    icon: <Star className="h-6 w-6" />,
    color: "from-gray-400 to-gray-600"
  }
];

const benefits = [
  {
    icon: <Heart className="h-8 w-8 text-red-500" />,
    title: "5x Success",
    description: "Premium members are 5 times more likely to find their perfect match"
  },
  {
    icon: <Shield className="h-8 w-8 text-green-500" />, 
    title: "100% Privacy",
    description: "Your personal information is completely secure and protected"
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
    title: "50K+ VIPs",
    description: "Connect with verified premium members for quality interactions"
  },
  {
    icon: <Eye className="h-8 w-8 text-purple-500" />,
    title: "Top Consultant",
    description: "Get expert guidance from our relationship consultants"
  }
];

const faqs = [
  {
    question: "What are some of the benefits of Premium plans?",
    answer: "As a Premium member, you can chat unlimited with your Matches, view their contact details and view hidden photos. You also get Premium Assistance on priority. These benefits will help you to accelerate your partner search to a great extent!"
  },
  {
    question: "What offers and discounts can I avail?", 
    answer: "We keep you informed from time to time whenever you are eligible for different discounts and offers. Login frequently to check and avail the best available offer."
  },
  {
    question: "What payment options do you offer?",
    answer: "We offer multiple Online and Offline payment options for your convenience. Choose your preferred plan and move forward to see the various options available to you."
  },
  {
    question: "How can I be safe on Shaadi.com?",
    answer: "We go to great lengths to make sure you get the best possible experience here. Every single profile is manually verified to ensure you meet genuine people who match your preferences. But if you still have any unpleasant experience please do report the same to us."
  }
];

export default function PremiumPlans() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4">Premium Plans</Badge>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Upgrade now & Get Premium benefits!
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upgrade to any of our Premium Plans and we'll ensure you'll find a match! Go through our detailed profiles we have in store for you.
            </p>
            <div className="text-sm text-muted-foreground">
              ⏰ For Prime Users Only • 📞 Help: 1800-000-0000
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-4`}>
                      {plan.icon}
                    </div>
                    <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.duration}</p>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-primary">{plan.price}</div>
                      <div className="text-sm text-muted-foreground line-through">{plan.originalPrice}</div>
                      <div className="text-xs text-muted-foreground">AUD per month</div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"}>
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-4">{benefit.icon}</div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Money Back Guarantee</h3>
                <p className="text-muted-foreground mb-6">
                  Get a full refund within 30 days if you don't find a match!
                </p>
                <Button size="lg">
                  Book a FREE Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                You have <span className="text-primary">questions</span>. We have the <span className="text-secondary">answers...</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                  Didn't find what you are looking for? Feel free to call us or{" "}
                  <Link to="/help" className="text-primary hover:underline">
                    Help page
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                The <span className="text-primary">safest</span>, <span className="text-secondary">smartest</span> and the{" "}
                <span className="text-primary">most secure</span> matchmaking service in Australia
              </h3>
              
              <div className="bg-background p-8 rounded-lg mt-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h4 className="font-semibold mb-2">Money Back Guarantee</h4>
                <p className="text-sm text-muted-foreground">
                  Get a full refund within 30 days if you don't find a match.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}