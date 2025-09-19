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
      <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {Icon && (
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end lg:self-auto">
            {children}
            <Link to={backUrl} className="shrink-0">
              <Button variant="outline" size="sm" className="lg:px-4 px-2">
                <ArrowLeft className="w-4 h-4 lg:mr-2" />
                <span className="hidden lg:inline">{backText}</span>
                <span className="lg:hidden">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}