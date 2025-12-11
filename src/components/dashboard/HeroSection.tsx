import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative py-16 px-10 rounded-2xl bg-card border border-border/20 overflow-hidden atmospheric-bg">
      {/* Atmospheric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft gradient orb */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-b from-primary/[0.02] to-transparent blur-3xl animate-breathe" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-gradient-to-t from-accent/[0.015] to-transparent blur-3xl animate-breathe" style={{ animationDelay: '-3s' }} />
        
        {/* Abstract floating shape - WebGL-inspired */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-40 h-40 float-gentle">
          <div className="relative w-full h-full">
            {/* Layered circles creating depth */}
            <div className="absolute inset-0 rounded-full border border-primary/5" />
            <div className="absolute inset-4 rounded-full border border-primary/10 animate-breathe" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="absolute inset-12 rounded-full border border-accent/10" />
            <div className="absolute inset-14 rounded-full bg-primary/5" />
          </div>
        </div>
      </div>

      <div className="relative max-w-2xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/30 mb-6">
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse-subtle" />
          <span className="text-xs text-muted-foreground tracking-wide">Object Spatial Programming</span>
        </div>
        
        {/* Headline */}
        <h1 className="text-4xl font-medium leading-tight tracking-tight mb-4">
          <span className="text-foreground">Master Jaclang,</span>
          <br />
          <span className="text-muted-foreground">One Layer at a Time</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
          Learn graph-based programming through interactive lessons, 
          AI-guided practice, and hands-on projects.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Button 
            className="h-10 px-5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all duration-400"
          >
            Start Learning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            variant="ghost" 
            className="h-10 px-5 text-muted-foreground hover:text-foreground transition-all duration-400"
          >
            View Roadmap
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
