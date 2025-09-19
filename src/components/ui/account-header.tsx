import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface AccountHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  backUrl?: string;
  backText?: string;
  children?: React.ReactNode;
}

export function AccountHeader({ 
  title, 
  description, 
  icon: Icon, 
  backUrl = "/account", 
  backText = "Back to Dashboard",
  children 
}: AccountHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {children}
            <Link to={backUrl}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}