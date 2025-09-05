"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Calculator, 
  Users, 
  Download, 
  Plus,
  Trash2,
  DollarSign,
  Heart,
  Utensils,
  Camera,
  Music
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

// Mock data for budget categories
const budgetCategories = [
  { name: "Venue", planned: 15000, actual: 0, icon: Heart },
  { name: "Catering", planned: 8000, actual: 0, icon: Utensils },
  { name: "Photography", planned: 3500, actual: 0, icon: Camera },
  { name: "Music & Entertainment", planned: 2500, actual: 0, icon: Music },
  { name: "Decorations", planned: 4000, actual: 0, icon: Heart },
  { name: "Outfits & Jewelry", planned: 5000, actual: 0, icon: Heart },
];

const Planning = () => {
  const [activeTab, setActiveTab] = React.useState<'budget' | 'guests'>('budget');
  const [budgetItems, setBudgetItems] = React.useState(budgetCategories);
  const [guests, setGuests] = React.useState([
    { name: "Priya Sharma", side: "Bride", rsvp: "Yes", dietary: "Vegetarian" },
    { name: "Raj Patel", side: "Groom", rsvp: "Pending", dietary: "None" },
  ]);

  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-luxury-lg text-foreground mb-6"
              variants={fadeInUp}
            >
              Planning Tools
            </motion.h1>
            <motion.p 
              className="text-body-lg text-muted-foreground mb-8"
              variants={fadeInUp}
            >
              Organize your perfect wedding with our budget tracker and guest list manager
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Planning Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-card rounded-lg p-1 border border-border">
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'budget' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Budget Tracker
              </button>
              <button
                onClick={() => setActiveTab('guests')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'guests' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Guest List
              </button>
            </div>
          </div>

          {/* Budget Tracker */}
          {activeTab === 'budget' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="luxury-card mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Wedding Budget Overview</span>
                    <Button variant="champagne" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-foreground">
                        ${totalPlanned.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Total Planned</div>
                    </div>
                    <div className="text-center p-6 bg-success/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-foreground">
                        ${totalActual.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="text-center p-6 bg-warning/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-foreground">
                        ${(totalPlanned - totalActual).toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Remaining</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {budgetItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-medium">${item.planned.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">Planned</div>
                            </div>
                            <div className="text-right">
                              <Input 
                                type="number" 
                                placeholder="0"
                                value={item.actual || ''}
                                onChange={(e) => {
                                  const newItems = [...budgetItems];
                                  newItems[index].actual = parseInt(e.target.value) || 0;
                                  setBudgetItems(newItems);
                                }}
                                className="w-24 text-right"
                              />
                              <div className="text-sm text-muted-foreground">Actual</div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button variant="luxury" className="mt-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Budget Item
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Guest List */}
          {activeTab === 'guests' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Guest List Manager</span>
                    <Button variant="champagne" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-foreground">
                        {guests.length}
                      </div>
                      <div className="text-muted-foreground">Total Guests</div>
                    </div>
                    <div className="text-center p-6 bg-success/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-foreground">
                        {guests.filter(g => g.rsvp === 'Yes').length}
                      </div>
                      <div className="text-muted-foreground">Confirmed</div>
                    </div>
                    <div className="text-center p-6 bg-warning/5 rounded-lg">
                      <div className="text-2xl font-heading font-bold text-foreground">
                        {guests.filter(g => g.rsvp === 'Pending').length}
                      </div>
                      <div className="text-muted-foreground">Pending</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {guests.map((guest, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{guest.name}</div>
                          <div className="text-sm text-muted-foreground">{guest.side} Side</div>
                        </div>
                        <div className="text-center">
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            guest.rsvp === 'Yes' ? 'bg-success/10 text-success' :
                            guest.rsvp === 'No' ? 'bg-destructive/10 text-destructive' :
                            'bg-warning/10 text-warning'
                          }`}>
                            {guest.rsvp}
                          </div>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <div className="text-sm">{guest.dietary}</div>
                          <div className="text-xs text-muted-foreground">Dietary</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button variant="luxury" className="mt-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Planning;