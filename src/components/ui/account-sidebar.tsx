import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  User, 
  Camera, 
  Shield, 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  Heart, 
  Settings,
  CreditCard,
  Home,
  Users,
  LogOut,
  MessageCircle
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "./badge";
import { Button } from "./button";
import { supabase } from "@/integrations/supabase/client";

const planningItems = [
  { title: "Guest List", url: "/account/planning/guests", icon: Users },
  { title: "To-Do List", url: "/account/planning/todo", icon: CheckSquare },
  { title: "Budget", url: "/account/planning/budget", icon: DollarSign },
];

const accountItems = [
  { title: "Overview", url: "/account", icon: Home },
  { title: "Profile", url: "/account/profile", icon: User },
  { title: "Photos", url: "/account/photos", icon: Camera },
  { title: "Partner Preferences", url: "/partner-preferences", icon: Heart },
  { title: "Messages", url: "/account/messages", icon: MessageCircle },
  { title: "Verification", url: "/account/verification", icon: Shield },
  { title: "Favorites", url: "/account/favorites", icon: Heart },
  { title: "Collaborators", url: "/account/collaborators", icon: Users },
  { title: "Security", url: "/account/security", icon: Settings },
  { title: "Billing", url: "/account/billing", icon: CreditCard },
];

export function AccountSidebar() {
  const location = useLocation();
  const [userPlan, setUserPlan] = React.useState('free');
  const currentPath = location.pathname;

  React.useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('plan')
          .eq('id', user.id)
          .single();
        
        if (data?.plan) {
          setUserPlan(data.plan);
        }
      }
    };

    fetchUserPlan();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (path: string) => currentPath === path;
  
  const getNavClasses = (path: string) => 
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50";

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        {/* Plan Status */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={userPlan === 'free' ? 'secondary' : 'default'}>
                {userPlan.toUpperCase()}
              </Badge>
            </div>
            {userPlan === 'free' && (
              <Link to="/account/billing">
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">
                  Upgrade
                </Badge>
              </Link>
            )}
          </div>
        </div>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Planning Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Planning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {planningItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="p-4 border-t mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}