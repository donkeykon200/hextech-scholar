import { Trophy, Star, Flame, Zap, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/localDb";

interface Achievement {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  unlocked: boolean;
}

const achievements: Achievement[] = [
  { id: "xp", icon: Zap, label: "Total XP", value: "2,450", color: "text-warning", unlocked: true },
  { id: "streak", icon: Flame, label: "Streak", value: "7", color: "text-destructive", unlocked: true },
  { id: "lessons", icon: Target, label: "Lessons", value: "12", color: "text-success", unlocked: true },
  { id: "stars", icon: Star, label: "Stars", value: "34", color: "text-primary", unlocked: true },
  { id: "badges", icon: Award, label: "Badges", value: "5", color: "text-accent", unlocked: true },
  { id: "trophies", icon: Trophy, label: "Trophies", value: "2", color: "text-info", unlocked: false },
];

const AchievementTotem = () => {
  const localAchievements = useLiveQuery(() => db.achievements.toArray());

  // Map icons to IDs
  const iconMap: Record<string, any> = {
    xp: Zap,
    streak: Flame,
    lessons: Target,
    stars: Star,
    badges: Award,
    trophies: Trophy
  };

  const displayAchievements = (localAchievements || []).length > 0
    ? localAchievements!.map(a => ({
        ...a,
        icon: iconMap[a.id] || Award
      }))
    : achievements;

  return (
    <div className="glass-panel rounded-2xl p-4">
      <h3 className="text-sm font-medium text-foreground mb-4 px-2">Achievements</h3>
      
      <div className="space-y-2">
        {displayAchievements.map((achievement, index) => {
          const Icon = achievement.icon;
          
          return (
            <div
              key={achievement.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                achievement.unlocked 
                  ? "hover:bg-secondary/50 cursor-pointer" 
                  : "opacity-40 cursor-not-allowed"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                achievement.unlocked ? "bg-secondary" : "bg-secondary/50"
              )}>
                <Icon className={cn("w-5 h-5", achievement.unlocked ? achievement.color : "text-muted-foreground")} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{achievement.label}</p>
                <p className={cn(
                  "text-lg font-semibold",
                  achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                )}>
                  {achievement.value}
                </p>
              </div>

              {achievement.unlocked && (
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementTotem;
