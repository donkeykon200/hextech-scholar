import { Clock, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyChallengeProps {
  onClick?: () => void;
}

const DailyChallenge = ({ onClick }: DailyChallengeProps) => {
  return (
    <div
      className="hologram rounded-2xl p-6 relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Daily Challenge</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>12:34:56</span>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-foreground mb-1">
            Walker Navigation
          </h4>
          <p className="text-sm text-muted-foreground">
            Create a walker that traverses a binary tree and collects all node values.
          </p>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-secondary/30">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">XP Reward</p>
            <p className="text-lg font-bold text-warning">+150</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Bonus</p>
            <p className="text-lg font-bold text-primary">2x</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Difficulty</p>
            <p className="text-sm font-medium text-success">Medium</p>
          </div>
        </div>

        {/* Action */}
        <Button
          className="w-full bg-gradient-to-r from-primary to-info hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Start Challenge
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DailyChallenge;
