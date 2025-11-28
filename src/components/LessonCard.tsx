import { Lock, CheckCircle2, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LessonCardProps {
  title: string;
  description: string;
  progress: number;
  status: "locked" | "available" | "completed";
  xp: number;
  onClick?: () => void;
}

const LessonCard = ({ title, description, progress, status, xp, onClick }: LessonCardProps) => {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  return (
    <Card
      onClick={isLocked ? undefined : onClick}
      className={`
        relative overflow-hidden transition-all duration-300
        ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
        ${isCompleted ? "border-success bg-success/5" : "border-primary/30 hover:border-primary"}
        ${!isLocked && !isCompleted ? "glow-cyan" : ""}
      `}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Status Icon */}
          <div className="ml-4">
            {isLocked && (
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            {isCompleted && (
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success-foreground" />
              </div>
            )}
            {status === "available" && (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center glow-cyan">
                <Play className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {!isLocked && (
          <div className="mb-3">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{progress}% Complete</span>
              <span className="text-xs font-bold text-primary">+{xp} XP</span>
            </div>
          </div>
        )}

        {/* Hextech Corner Accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full"></div>
      </div>
    </Card>
  );
};

export default LessonCard;
