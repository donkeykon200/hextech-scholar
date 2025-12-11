import { Sparkles, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DailyChallenge = () => {
  return (
    <div className="rounded-xl bg-card border border-border/20 p-5 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/[0.02] blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Daily Challenge</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>12h left</span>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="mb-4">
          <h4 className="text-base font-medium text-foreground mb-1">Walker Navigation</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create a walker that visits all nodes in a graph and collects data from each.
          </p>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="text-primary font-medium">+50</span> XP
          </span>
          <span className="flex items-center gap-1">
            <span className="text-primary font-medium">+1</span> Streak
          </span>
        </div>

        {/* CTA */}
        <Button 
          className="w-full h-9 text-xs bg-secondary/80 hover:bg-secondary text-foreground border border-border/30 transition-all duration-400"
        >
          Start Challenge
          <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DailyChallenge;
