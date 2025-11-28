import { Flame, Zap, Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Header = () => {
  const userStats = {
    streak: 7,
    xp: 2450,
    level: 12,
    dailyGoal: 75,
    dailyProgress: 45,
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-cyan">
                <span className="text-xl font-bold text-background">J</span>
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-md -z-10"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Jaclang Academy
              </h1>
              <p className="text-xs text-muted-foreground">Master Object Spatial Programming</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            {/* Streak */}
            <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/30 rounded-lg">
              <Flame className="w-5 h-5 text-warning" />
              <div>
                <div className="text-sm font-bold text-warning">{userStats.streak}</div>
                <div className="text-xs text-warning/70">day streak</div>
              </div>
            </div>

            {/* XP & Level */}
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-bold text-primary">{userStats.xp} XP</div>
                <div className="text-xs text-primary/70">Level {userStats.level}</div>
              </div>
            </div>

            {/* Daily Goal */}
            <div className="flex items-center gap-3 px-3 py-2 bg-success/10 border border-success/30 rounded-lg min-w-[180px]">
              <Target className="w-5 h-5 text-success" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-success/70">Daily Goal</span>
                  <span className="text-xs font-bold text-success">{userStats.dailyProgress}/{userStats.dailyGoal}</span>
                </div>
                <Progress value={(userStats.dailyProgress / userStats.dailyGoal) * 100} className="h-1.5" />
              </div>
            </div>

            {/* Trophy */}
            <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
              <Trophy className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
