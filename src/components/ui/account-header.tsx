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
        {/* Mobile: Stack vertically, Desktop: Horizontal when needed */}
        <div className="flex flex-col gap-4 sm:gap-3">
          
          {/* Top Row: Title and Back Button */}
          <div className="flex items-start justify-between gap-3">
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
                <p className="text-muted-foreground text-sm lg:text-base mt-1">
                  <span className="hidden sm:inline">{description}</span>
                  <span className="sm:hidden">{description.length > 30 ? description.substring(0, 30) + '...' : description}</span>
                </p>
              </div>
            </div>
            
            {/* Back Button - Always visible */}
            {backUrl && (
              <Link to={backUrl} className="flex-shrink-0">
                <Button variant="outline" size="sm" className="px-2 sm:px-4">
                  <ArrowLeft className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{backText}</span>
                  <span className="sm:hidden sr-only">Back</span>
                </Button>
              </Link>
            )}
          </div>
          
          {/* Bottom Row: Additional Actions (if any) */}
          {children && (
            <div className="flex gap-2 sm:justify-end">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}