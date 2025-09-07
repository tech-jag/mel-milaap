import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart,
  MessageCircle,
  Star,
  Users,
  Shield,
  Crown,
  Search,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { Helmet } from "react-helmet-async";

const Match = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Find Your Match - Mēl Milaap</title>
        <meta name="description" content="Discover compatible matches for your perfect wedding partner" />
      </Helmet>

      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
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
                Match Dashboard
              </Badge>
              <h1 className="text-luxury-xl text-foreground mb-6">
                Your Match Dashboard
              </h1>
              <p className="text-body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover compatible matches and manage your connections in one place
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {[
                { icon: Heart, label: "Likes Received", value: "12", color: "text-red-500" },
                { icon: MessageCircle, label: "New Messages", value: "3", color: "text-blue-500" },
                { icon: Star, label: "Favorites", value: "8", color: "text-yellow-500" },
                { icon: Users, label: "Profile Views", value: "47", color: "text-green-500" }
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                      <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Activity */}
              <motion.div className="lg:col-span-2" variants={fadeInUp}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          type: "like",
                          message: "Sarah M. liked your profile",
                          time: "2 hours ago",
                          action: "View Profile"
                        },
                        {
                          type: "message",
                          message: "New message from Alex K.",
                          time: "5 hours ago",
                          action: "Reply"
                        },
                        {
                          type: "view",
                          message: "Emma L. viewed your profile",
                          time: "1 day ago",
                          action: "View Profile"
                        },
                        {
                          type: "match",
                          message: "New match with David R.",
                          time: "2 days ago",
                          action: "Send Message"
                        }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              activity.type === 'like' ? 'bg-red-100 text-red-500' :
                              activity.type === 'message' ? 'bg-blue-100 text-blue-500' :
                              activity.type === 'view' ? 'bg-green-100 text-green-500' :
                              'bg-purple-100 text-purple-500'
                            }`}>
                              {activity.type === 'like' && <Heart className="w-4 h-4" />}
                              {activity.type === 'message' && <MessageCircle className="w-4 h-4" />}
                              {activity.type === 'view' && <Search className="w-4 h-4" />}
                              {activity.type === 'match' && <Users className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{activity.message}</p>
                              <p className="text-sm text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            {activity.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div className="space-y-6" variants={fadeInUp}>
                
                {/* Profile Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Profile Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Profile Completeness</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      
                      <div className="space-y-3 mt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Verification</span>
                          <Badge variant="outline">
                            <Shield className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Membership</span>
                          <Badge variant="secondary">
                            Free
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-6">
                        <Link to="/account/profile">
                          <Button variant="outline" size="sm" className="w-full">
                            Complete Profile
                          </Button>
                        </Link>
                        <Link to="/account/verification">
                          <Button variant="outline" size="sm" className="w-full">
                            Verify Account
                          </Button>
                        </Link>
                        <Link to="/premium">
                          <Button size="sm" className="w-full">
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade Plan
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Search */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Profiles
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Near Me
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Star className="w-4 h-4 mr-2" />
                        Premium Members
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="w-4 h-4 mr-2" />
                        Recently Active
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Match;