import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  language: string;
}

const HeroSection = ({ language }: HeroSectionProps) => {
  const languageName = language.charAt(0).toUpperCase() + language.slice(1);

  return (
    <section className="relative py-12 px-8 rounded-3xl glass-panel overflow-hidden volumetric-light">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40 animate-particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/10 to-transparent blur-3xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-subtle">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">AI-Powered Learning</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-foreground">Master </span>
            <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent text-glow">
              {languageName}
            </span>
            <br />
            <span className="text-foreground">Your Way</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg">
            Learn {language === 'jaclang' ? 'Object Spatial Programming' : languageName} through interactive lessons, hands-on projects,
            and AI-guided assistance in your personal coding dojo.
          </p>

          <div className="flex items-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-info hover:opacity-90 shadow-glow-md">
              Start Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-border/50 hover:bg-secondary/50">
              View Roadmap
            </Button>
          </div>
        </div>

        {/* 3D Emblem */}
        <div className="relative flex-shrink-0">
          <div className="relative w-64 h-64 float">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border border-accent/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            
            {/* Main Sphere */}
            <div className="absolute inset-8 rounded-full progress-sphere flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-b from-primary to-info bg-clip-text text-transparent">
                  {languageName.charAt(0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">{languageName}</div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary/60 float-delayed" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent/60 float" />
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-2 h-2 rounded-full bg-info/60 float-delayed" />
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 rounded-full bg-success/60 float" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
