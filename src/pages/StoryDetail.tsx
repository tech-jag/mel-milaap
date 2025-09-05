"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  User, 
  ArrowLeft,
  Heart,
  Share2,
  Calendar
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";

// Mock story data - in production this would be fetched from the database
const getStoryBySlug = (slug: string) => {
  const stories = {
    "traditional-tamil-wedding-sydney": {
      id: 1,
      title: "A Traditional Tamil Wedding in Sydney",
      slug: "traditional-tamil-wedding-sydney",
      excerpt: "Priya and Arjun's beautiful three-day celebration blended ancient traditions with modern elegance in the heart of Sydney.",
      content: `
        <h2>A Love Story Begins</h2>
        <p>When Priya and Arjun first met at a mutual friend's gathering in Sydney, neither could have imagined that their connection would lead to one of the most beautiful Tamil weddings the city had ever seen. Their three-day celebration was a perfect blend of ancient traditions and modern elegance, showcasing the rich cultural heritage of Tamil weddings while embracing contemporary touches that made their celebration uniquely theirs.</p>
        
        <h2>Day One: The Engagement Ceremony</h2>
        <p>The celebration began with a traditional engagement ceremony at the bride's family home in Parramatta. The house was decorated with marigold flowers and mango leaves, creating an authentic South Indian atmosphere. Family members from both India and Australia came together, making it a truly multicultural celebration.</p>
        
        <h2>Day Two: Mehndi and Sangeet</h2>
        <p>The second day was dedicated to the mehndi and sangeet ceremonies. Held at a beautiful venue in the Inner West, the celebration featured traditional henna artists, live music, and dance performances from family and friends. The venue was transformed with vibrant colors, fairy lights, and traditional decor that transported guests to the heart of Tamil Nadu.</p>
        
        <h2>Day Three: The Wedding Ceremony</h2>
        <p>The main wedding ceremony took place at the Sri Ganesha Temple in Helensburgh. The morning began with the bride's preparation ritual, followed by the groom's arrival on a decorated horse. The ceremony itself was conducted entirely in Tamil, with the priest explaining each ritual in English for the benefit of non-Tamil speaking guests.</p>
        
        <h2>Reception: A Modern Celebration</h2>
        <p>The evening reception was held at the stunning Doltone House in Pyrmont, offering spectacular harbor views. The couple chose a more contemporary approach for the reception, with a live band, DJ, and a menu that featured both South Indian and international cuisine. The highlight of the evening was the couple's first dance, which seamlessly blended traditional Tamil music with contemporary hits.</p>
        
        <h2>Advice for Future Couples</h2>
        <p>"Planning a traditional Tamil wedding in Sydney requires patience and attention to detail," says Priya. "Start early, find vendors who understand your culture, and don't be afraid to adapt traditions to suit your circumstances. The most important thing is to stay true to your values while creating an experience that your guests will never forget."</p>
        
        <p>Arjun adds, "Involve both families in the planning process. Our wedding was successful because we made sure everyone felt included, regardless of their cultural background or familiarity with Tamil traditions."</p>
      `,
      cover_image: "/api/placeholder/1200/600",
      author_name: "Priya & Arjun",
      category: "Real Weddings",
      read_time_minutes: 8,
      published_at: "2024-02-15T10:00:00Z"
    },
    "essential-tips-planning-south-asian-wedding": {
      id: 2,
      title: "10 Essential Tips for Planning Your South Asian Wedding",
      slug: "essential-tips-planning-south-asian-wedding",
      excerpt: "From booking venues to coordinating multiple ceremonies, here's everything you need to know about planning your dream wedding.",
      content: `
        <h2>Planning Your Dream South Asian Wedding</h2>
        <p>Planning a South Asian wedding is both exciting and overwhelming. With multiple ceremonies, hundreds of guests, and rich cultural traditions to honor, there's a lot to consider. Here are our top 10 essential tips to help you navigate the planning process and create the wedding of your dreams.</p>
        
        <h2>1. Start Planning Early</h2>
        <p>South Asian weddings typically involve multiple events over several days. Start planning at least 12-18 months in advance to secure your preferred venues, vendors, and dates. Popular venues and photographers book out quickly, especially during peak wedding season.</p>
        
        <h2>2. Set a Realistic Budget</h2>
        <p>South Asian weddings can be expensive, with costs for venues, catering, decorations, and clothing adding up quickly. Create a detailed budget early and allocate funds based on your priorities. Don't forget to include costs for pre-wedding events like engagement ceremonies and mehndi parties.</p>
        
        <h2>3. Choose the Right Venue</h2>
        <p>Look for venues that can accommodate large guest lists and understand cultural requirements. Many South Asian weddings require specific setups for ceremonies, space for live cooking, and areas for different activities throughout the day.</p>
        
        <h2>4. Find Cultural-Aware Vendors</h2>
        <p>Work with photographers, decorators, and caterers who understand South Asian wedding traditions. They'll be better equipped to capture important moments, create appropriate decor, and serve authentic cuisine that your guests will appreciate.</p>
        
        <h2>5. Plan Your Guest List Strategically</h2>
        <p>South Asian weddings often have large guest lists. Create a system for organizing invitations, tracking RSVPs, and managing seating arrangements. Consider using digital tools to help manage the process.</p>
        
        <h2>6. Coordinate Multiple Ceremonies</h2>
        <p>Each ceremony has its own requirements for timing, setup, and activities. Create a detailed timeline for each event and communicate clearly with all vendors about what's needed when.</p>
        
        <h2>7. Plan Your Wedding Wardrobe</h2>
        <p>You'll likely need multiple outfits for different ceremonies. Start shopping early, especially if you're ordering from India or getting custom pieces made. Don't forget about accessories, jewelry, and shoes for each look.</p>
        
        <h2>8. Consider Dietary Requirements</h2>
        <p>South Asian weddings often feature elaborate vegetarian menus. Work with your caterer to create a diverse menu that accommodates different dietary preferences and restrictions while staying true to traditional flavors.</p>
        
        <h2>9. Hire Professional Help</h2>
        <p>Consider hiring a wedding planner who specializes in South Asian weddings. They can help coordinate vendors, manage timelines, and handle cultural requirements that general wedding planners might not understand.</p>
        
        <h2>10. Don't Forget Self-Care</h2>
        <p>Wedding planning can be stressful, especially when managing multiple ceremonies and large guest lists. Make time for self-care, delegate tasks to family and friends, and remember to enjoy the process of celebrating your love.</p>
      `,
      cover_image: "/api/placeholder/1200/600",
      author_name: "Wedding Planning Team",
      category: "Tips",
      read_time_minutes: 6,
      published_at: "2024-02-10T14:00:00Z"
    }
  };
  
  return stories[slug as keyof typeof stories];
};

const StoryDetail = () => {
  const { slug } = useParams();
  const story = getStoryBySlug(slug || '');

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Story Not Found</h1>
            <p className="text-muted-foreground mb-8">The story you're looking for doesn't exist.</p>
            <Link to="/stories">
              <Button variant="luxury">Back to Stories</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Real Weddings": return "bg-rose-100 text-rose-700";
      case "Tips": return "bg-blue-100 text-blue-700";
      case "Inspiration": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back Button */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Link to="/stories">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stories
            </Button>
          </Link>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative">
        <div className="h-96 lg:h-[500px] relative overflow-hidden">
          <img
            src={story.cover_image}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                className="max-w-4xl"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={fadeInUp}>
                  <Badge className={getCategoryColor(story.category)}>
                    {story.category}
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  className="text-luxury-lg text-white mt-4 mb-4"
                  variants={fadeInUp}
                >
                  {story.title}
                </motion.h1>
                
                <motion.div 
                  className="flex items-center gap-6 text-white/90"
                  variants={fadeInUp}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {story.author_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {story.read_time_minutes} min read
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Date(story.published_at).toLocaleDateString()}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* Main Content */}
              <motion.div className="lg:col-span-3" variants={fadeInUp}>
                <Card className="luxury-card">
                  <CardContent className="p-8">
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: story.content }}
                      style={{
                        fontSize: '18px',
                        lineHeight: '1.7',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div className="lg:col-span-1" variants={fadeInUp}>
                <div className="space-y-6 sticky top-8">
                  {/* Share */}
                  <Card className="luxury-card">
                    <CardContent className="p-6">
                      <h3 className="font-heading font-semibold text-foreground mb-4">
                        Share This Story
                      </h3>
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Stories */}
                  <Card className="luxury-card">
                    <CardContent className="p-6">
                      <h3 className="font-heading font-semibold text-foreground mb-4">
                        Related Stories
                      </h3>
                      <div className="space-y-4">
                        {/* Mock related stories */}
                        <Link to="/stories/mehndi-ceremony-ideas-inspiration" className="block">
                          <div className="text-sm">
                            <p className="font-medium text-foreground hover:text-primary transition-colors">
                              Mehndi Ceremony Ideas That Will Inspire Your Celebration
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">5 min read</p>
                          </div>
                        </Link>
                        <Link to="/stories/budget-friendly-wedding-decor-ideas" className="block">
                          <div className="text-sm">
                            <p className="font-medium text-foreground hover:text-primary transition-colors">
                              Budget-Friendly Wedding Decor Ideas
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">7 min read</p>
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-luxury-md text-foreground mb-6"
              variants={fadeInUp}
            >
              Start Planning Your Dream Wedding
            </motion.h2>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Ready to create your own beautiful wedding story? Browse our trusted suppliers and start planning today.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Link to="/suppliers">
                <Button variant="luxury" size="lg">
                  Find Suppliers
                </Button>
              </Link>
              <Link to="/stories">
                <Button variant="outline" size="lg">
                  Read More Stories
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoryDetail;