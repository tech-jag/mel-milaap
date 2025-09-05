// Stub for Stories page
"use client";

import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";

const Stories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Wedding Stories</h1>
          <p className="text-muted-foreground">Coming soon - Real wedding stories and inspiration</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Stories;