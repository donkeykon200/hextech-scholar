import { Trophy, Zap, Target, Star, Crown, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  icon: React.ElementType;
  unlocked: boolean;
}

const achievements: Achievement[] = [
  { id: "first-lesson", name: "First Lesson", icon: Star, unlocked: true },
  { id: "quick-learner", name: "Quick Learner", icon: Zap, unlocked: true },
  { id: "streak-7", name: "7-Day Streak", icon: Flame, unlocked: true },
  { id: "bug-hunter", name: "Bug Hunter", icon: Target, unlocked: false },
  { id: "pro-coder", name: "Pro Coder", icon: Trophy, unlocked: false },
  { id: "master", name: "Jaclang Master", icon: Crown, unlocked: false },
];

const AchievementTotem = () => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="rounded-xl bg-card border border-border/20 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Achievements</h3>
        <span className="text-xs text-muted-foreground">{unlockedCount}/{achievements.length}</span>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-6 gap-2">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center transition-all duration-400",
                achievement.unlocked 
                  ? "bg-primary/10 border border-primary/20" 
                  : "bg-secondary/50 border border-border/20"
              )}
              title={achievement.name}
            >
              <Icon 
                className={cn(
                  "w-4 h-4 transition-colors duration-400",
                  achievement.unlocked ? "text-primary" : "text-muted-foreground/30"
                )} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementTotem;
