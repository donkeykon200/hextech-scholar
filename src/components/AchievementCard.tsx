import { Trophy, Star, Flame, Zap, Target, Award, Crown, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "streak" | "xp" | "lessons" | "mastery" | "special";
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  xpReward: number;
  unlockedAt?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  zap: Zap,
  target: Target,
  award: Award,
  crown: Crown,
  shield: Shield,
};

const tierColors = {
  bronze: "from-orange-700 to-orange-500",
  silver: "from-gray-400 to-gray-200",
  gold: "from-yellow-500 to-yellow-300",
  platinum: "from-cyan-400 to-blue-300",
  diamond: "from-purple-400 to-pink-300",
};

const tierGlow = {
  bronze: "shadow-orange-500/50",
  silver: "shadow-gray-300/50",
  gold: "shadow-yellow-400/50",
  platinum: "shadow-cyan-400/50",
  diamond: "shadow-purple-400/50",
};

const AchievementCard = ({ achievement, onClick }: AchievementCardProps) => {
  const Icon = iconMap[achievement.icon as keyof typeof iconMap] || Trophy;
  const isComplete = achievement.unlocked;
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <Card
      onClick={onClick}
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer
        ${isComplete ? "hover:scale-105" : "hover:scale-102"}
        ${isComplete ? "border-primary glow-cyan" : "border-muted opacity-75"}
        ${isComplete ? tierGlow[achievement.tier] : ""}
      `}
    >
      {/* Background Effects */}
      <div className={`absolute inset-0 bg-gradient-to-br ${isComplete ? tierColors[achievement.tier] : "from-muted to-background"} opacity-20`}></div>
      
      {isComplete && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/30 to-transparent rounded-bl-full"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl -z-10 animate-pulse"></div>
        </>
      )}

      {/* Lock Overlay for Incomplete */}
      {!isComplete && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="text-muted-foreground text-xs font-bold opacity-50">LOCKED</div>
        </div>
      )}

      {/* Content */}
      <div className="relative p-4">
        {/* Header with Icon and Tier */}
        <div className="flex items-start justify-between mb-3">
          <div className={`
            w-14 h-14 rounded-lg flex items-center justify-center
            ${isComplete ? `bg-gradient-to-br ${tierColors[achievement.tier]}` : "bg-muted"}
            ${isComplete ? "glow-cyan" : ""}
          `}>
            <Icon className={`w-7 h-7 ${isComplete ? "text-white" : "text-muted-foreground"}`} />
          </div>

          <Badge 
            variant={isComplete ? "default" : "secondary"}
            className={`text-xs uppercase ${isComplete ? tierGlow[achievement.tier] : ""}`}
          >
            {achievement.tier}
          </Badge>
        </div>

        {/* Title and Description */}
        <h3 className={`text-base font-bold mb-1 ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
          {achievement.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {achievement.description}
        </p>

        {/* Progress or Completion Date */}
        {!isComplete ? (
          <div className="space-y-1">
            <Progress value={progressPercentage} className="h-1.5" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {achievement.progress}/{achievement.maxProgress}
              </span>
              <span className="text-xs font-bold text-primary">+{achievement.xpReward} XP</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-success font-medium">
              {achievement.unlockedAt ? `Unlocked ${achievement.unlockedAt}` : "Unlocked"}
            </span>
            <span className="text-xs font-bold text-primary">+{achievement.xpReward} XP</span>
          </div>
        )}

        {/* Hextech Accents */}
        {isComplete && (
          <>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-lg"></div>
          </>
        )}
      </div>
    </Card>
  );
};

export default AchievementCard;
