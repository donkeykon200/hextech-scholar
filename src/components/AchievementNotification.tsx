import { useCallback, useEffect, useState } from "react";
import { Trophy, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Achievement } from "./AchievementCard";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [handleClose]);

  return (
    <div className={`
      fixed top-24 right-6 z-50 transition-all duration-300 ease-out
      ${isVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}
    `}>
      <Card className="w-96 border-primary glow-cyan overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[slide-in-right_2s_ease-in-out_infinite]"></div>

        {/* Sparkles Effect */}
        <div className="absolute top-2 right-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="absolute top-4 left-4 animate-pulse animation-delay-200">
          <Sparkles className="w-3 h-3 text-accent" />
        </div>

        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center glow-cyan flex-shrink-0">
              <Trophy className="w-8 h-8 text-white" />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-foreground">Achievement Unlocked!</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 -mt-1"
                  onClick={handleClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-base font-bold text-primary mb-1">
                {achievement.title}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {achievement.description}
              </p>
              
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-primary/20 rounded text-xs font-bold text-primary">
                  +{achievement.xpReward} XP
                </div>
                <div className="px-2 py-1 bg-accent/20 rounded text-xs font-bold text-accent uppercase">
                  {achievement.tier}
                </div>
              </div>
            </div>
          </div>

          {/* Hextech Corner Accents */}
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full"></div>
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/30 rounded-tr-lg"></div>
        </div>
      </Card>
    </div>
  );
};

export default AchievementNotification;
