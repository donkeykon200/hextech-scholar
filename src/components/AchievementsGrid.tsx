import { useState } from "react";
import AchievementCard, { Achievement } from "./AchievementCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";

const mockAchievements: Achievement[] = [
  // Streak Achievements
  {
    id: "streak-3",
    title: "Getting Started",
    description: "Maintain a 3-day learning streak",
    icon: "flame",
    category: "streak",
    tier: "bronze",
    unlocked: true,
    progress: 3,
    maxProgress: 3,
    xpReward: 50,
    unlockedAt: "2 days ago",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "flame",
    category: "streak",
    tier: "silver",
    unlocked: true,
    progress: 7,
    maxProgress: 7,
    xpReward: 100,
    unlockedAt: "Today",
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Maintain a 30-day learning streak",
    icon: "flame",
    category: "streak",
    tier: "gold",
    unlocked: false,
    progress: 7,
    maxProgress: 30,
    xpReward: 500,
  },
  {
    id: "streak-100",
    title: "Centurion",
    description: "Maintain a 100-day learning streak",
    icon: "crown",
    category: "streak",
    tier: "platinum",
    unlocked: false,
    progress: 7,
    maxProgress: 100,
    xpReward: 2000,
  },
  {
    id: "streak-365",
    title: "Year Champion",
    description: "Maintain a 365-day learning streak",
    icon: "crown",
    category: "streak",
    tier: "diamond",
    unlocked: false,
    progress: 7,
    maxProgress: 365,
    xpReward: 10000,
  },

  // XP Achievements
  {
    id: "xp-1000",
    title: "Rising Star",
    description: "Earn 1,000 total XP",
    icon: "star",
    category: "xp",
    tier: "bronze",
    unlocked: true,
    progress: 2450,
    maxProgress: 1000,
    xpReward: 100,
    unlockedAt: "1 week ago",
  },
  {
    id: "xp-5000",
    title: "Power Surge",
    description: "Earn 5,000 total XP",
    icon: "zap",
    category: "xp",
    tier: "silver",
    unlocked: false,
    progress: 2450,
    maxProgress: 5000,
    xpReward: 250,
  },
  {
    id: "xp-10000",
    title: "Elite Learner",
    description: "Earn 10,000 total XP",
    icon: "zap",
    category: "xp",
    tier: "gold",
    unlocked: false,
    progress: 2450,
    maxProgress: 10000,
    xpReward: 500,
  },

  // Lesson Achievements
  {
    id: "lessons-5",
    title: "First Steps",
    description: "Complete 5 lessons",
    icon: "target",
    category: "lessons",
    tier: "bronze",
    unlocked: true,
    progress: 8,
    maxProgress: 5,
    xpReward: 75,
    unlockedAt: "3 days ago",
  },
  {
    id: "lessons-25",
    title: "Knowledge Seeker",
    description: "Complete 25 lessons",
    icon: "target",
    category: "lessons",
    tier: "silver",
    unlocked: false,
    progress: 8,
    maxProgress: 25,
    xpReward: 200,
  },
  {
    id: "lessons-50",
    title: "Dedicated Student",
    description: "Complete 50 lessons",
    icon: "award",
    category: "lessons",
    tier: "gold",
    unlocked: false,
    progress: 8,
    maxProgress: 50,
    xpReward: 500,
  },

  // Mastery Achievements
  {
    id: "perfect-lesson",
    title: "Perfectionist",
    description: "Complete a lesson with 100% accuracy",
    icon: "trophy",
    category: "mastery",
    tier: "silver",
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    xpReward: 150,
    unlockedAt: "Yesterday",
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Complete 5 lessons in one day",
    icon: "zap",
    category: "mastery",
    tier: "gold",
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    xpReward: 300,
  },

  // Special Achievements
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Complete a lesson before 8 AM",
    icon: "star",
    category: "special",
    tier: "bronze",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 50,
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Complete a lesson after 10 PM",
    icon: "star",
    category: "special",
    tier: "bronze",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 50,
  },
  {
    id: "first-compiler",
    title: "Compiler Master",
    description: "Successfully compile your first Jaclang program",
    icon: "shield",
    category: "special",
    tier: "silver",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 200,
  },
];

const AchievementsGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredAchievements = selectedCategory === "all" 
    ? mockAchievements 
    : mockAchievements.filter(a => a.category === selectedCategory);

  const totalAchievements = mockAchievements.length;
  const unlockedAchievements = mockAchievements.filter(a => a.unlocked).length;
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <Card className="p-6 border-primary/30 glow-cyan">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Achievement Collection
            </h2>
            <p className="text-muted-foreground text-sm">
              Unlock badges and earn rewards as you master Jaclang
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">
                  {unlockedAchievements}/{totalAchievements}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-3xl font-bold text-success">
                  {completionPercentage}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6 bg-card border border-border">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="streak">Streaks</TabsTrigger>
          <TabsTrigger value="xp">XP</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="mastery">Mastery</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementsGrid;
