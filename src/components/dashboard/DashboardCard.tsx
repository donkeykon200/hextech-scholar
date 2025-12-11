import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: "primary" | "accent" | "success" | "warning" | "info" | "destructive";
  progress?: number;
  action?: string;
  onClick?: () => void;
  className?: string;
}

const DashboardCard = ({
  title,
  description,
  icon: Icon,
  color = "primary",
  progress,
  action,
  onClick,
  className,
}: DashboardCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "card-minimal w-full text-left p-5 rounded-xl bg-card border border-border/20",
        "transition-all duration-550 group",
        "hover:border-border/40",
        className
      )}
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-secondary/80 flex items-center justify-center mb-4 transition-all duration-400 group-hover:bg-secondary">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-400" />
      </div>

      {/* Content */}
      <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{description}</p>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full rounded-full bg-primary/60 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action */}
      {action && (
        <span className="text-xs text-primary font-medium group-hover:text-primary/80 transition-colors duration-400">
          {action} →
        </span>
      )}
    </button>
  );
};

export default DashboardCard;
