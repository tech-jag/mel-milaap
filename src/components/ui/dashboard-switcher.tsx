import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardSwitcherProps {
  currentMode: 'match' | 'planning';
  onModeChange: (mode: 'match' | 'planning') => void;
}

export const DashboardSwitcher = ({ currentMode, onModeChange }: DashboardSwitcherProps) => {
  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={currentMode === 'match' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('match')}
            className="flex items-center space-x-2"
          >
            <Heart className="w-4 h-4" />
            <span>Match</span>
          </Button>
          <Button
            variant={currentMode === 'planning' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('planning')}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Planning</span>
          </Button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${
            currentMode === 'match' ? 'ring-2 ring-primary' : ''
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Match Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Find your perfect partner</p>
                  </div>
                </div>
                <Badge variant="secondary">3 new</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile views this week</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New matches</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="font-medium">12</span>
                </div>
              </div>

              <Link to="/match">
                <Button variant="outline" size="sm" className="w-full">
                  View Match Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${
            currentMode === 'planning' ? 'ring-2 ring-primary' : ''
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Planning Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Organize your wedding</p>
                  </div>
                </div>
                <Badge variant="secondary">68% complete</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget planned</span>
                  <span className="font-medium">$42,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guests invited</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tasks completed</span>
                  <span className="font-medium">23/34</span>
                </div>
              </div>

              <Link to="/planning">
                <Button variant="outline" size="sm" className="w-full">
                  View Planning Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};