import React from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  Users, 
  Gift, 
  ClipboardList,
  Plus,
  ArrowUpRight,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const PlanningDashboard = () => {
  // Mock data for demonstration
  const planningProgress = 65;
  const budgetStats = {
    total: 25000,
    spent: 8750,
    remaining: 16250
  };

  const nextTasks = [
    { id: 1, task: "Book wedding venue", dueDate: "2 weeks", priority: "high" },
    { id: 2, task: "Send save the dates", dueDate: "1 month", priority: "medium" },
    { id: 3, task: "Taste test catering", dueDate: "3 weeks", priority: "medium" },
  ];

  const quickStats = [
    { label: "Guest List", value: "85/120", icon: Users },
    { label: "Budget Used", value: "35%", icon: DollarSign },
    { label: "Tasks Done", value: "12/25", icon: CheckCircle },
    { label: "Days to Go", value: "157", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Planning Dashboard</h1>
          <p className="text-muted-foreground">Organize your perfect wedding with our planning tools</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Free Member
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Wedding Planning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall completion</span>
              <span className="text-sm text-muted-foreground">{planningProgress}%</span>
            </div>
            <Progress value={planningProgress} className="w-full" />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/planning/checklist">View Full Checklist</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/planning/timeline">Wedding Timeline</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget Summary
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/planning/budget">View Details</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-primary">
                ${budgetStats.total.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-2xl font-bold text-destructive">
                ${budgetStats.spent.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-success">
                ${budgetStats.remaining.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Next Tasks
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/planning/checklist">
                  <Plus className="w-4 h-4" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-muted-foreground">Due in {task.dueDate}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={task.priority === "high" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/planning/checklist">View All Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Planning Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <Link to="/planning/guests">
                  <Users className="w-6 h-6" />
                  <span>Guest List</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <Link to="/planning/budget">
                  <DollarSign className="w-6 h-6" />
                  <span>Budget</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <Link to="/planning/registry">
                  <Gift className="w-6 h-6" />
                  <span>Registry</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <Link to="/suppliers">
                  <ArrowUpRight className="w-6 h-6" />
                  <span>Suppliers</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registry Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Gift Registry
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/planning/registry">Manage Registry</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Create your gift registry to help guests choose the perfect gifts
            </p>
            <Button variant="luxury" asChild>
              <Link to="/planning/registry">
                Create Registry
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningDashboard;