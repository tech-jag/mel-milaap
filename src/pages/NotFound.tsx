import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { 
  Home, 
  Search, 
  Heart,
  ArrowLeft,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <HelpCircle className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>
            
            <h1 className="text-6xl font-heading font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            
            <Link to="/match">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Find Matches
              </Button>
            </Link>
            
            <Link to="/planning">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Planning Tools
              </Button>
            </Link>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Need help? Our support team is here for you.
            </p>
            <Link to="/contact">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
