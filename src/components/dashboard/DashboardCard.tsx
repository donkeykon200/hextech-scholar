import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "accent" | "success" | "warning" | "info" | "destructive";
  progress?: number;
  action?: string;
  onClick?: () => void;
  className?: string;
}

const colorVariants = {
  primary: {
    bg: "from-primary/20 to-primary/5",
    border: "border-primary/30",
    icon: "text-primary bg-primary/20",
    glow: "hover:shadow-[0_0_30px_hsl(var(--glow-cyan)/0.3)]",
  },
  accent: {
    bg: "from-accent/20 to-accent/5",
    border: "border-accent/30",
    icon: "text-accent bg-accent/20",
    glow: "hover:shadow-[0_0_30px_hsl(var(--glow-purple)/0.3)]",
  },
  success: {
    bg: "from-success/20 to-success/5",
    border: "border-success/30",
    icon: "text-success bg-success/20",
    glow: "hover:shadow-[0_0_30px_hsl(155_70%_50%/0.3)]",
  },
  warning: {
    bg: "from-warning/20 to-warning/5",
    border: "border-warning/30",
    icon: "text-warning bg-warning/20",
    glow: "hover:shadow-[0_0_30px_hsl(40_90%_55%/0.3)]",
  },
  info: {
    bg: "from-info/20 to-info/5",
    border: "border-info/30",
    icon: "text-info bg-info/20",
    glow: "hover:shadow-[0_0_30px_hsl(200_80%_55%/0.3)]",
  },
  destructive: {
    bg: "from-destructive/20 to-destructive/5",
    border: "border-destructive/30",
    icon: "text-destructive bg-destructive/20",
    glow: "hover:shadow-[0_0_30px_hsl(0_72%_55%/0.3)]",
  },
};

const DashboardCard = ({
  title,
  description,
  icon: Icon,
  color,
  progress,
  action,
  onClick,
  className,
}: DashboardCardProps) => {
  const variant = colorVariants[color];

  return (
    <button
      onClick={onClick}
      className={cn(
        "card-3d w-full text-left p-6 rounded-2xl glass-panel",
        "border transition-all duration-400",
        variant.border,
        variant.glow,
        className
      )}
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50 pointer-events-none",
        variant.bg
      )} />

      <div className="relative card-3d-inner">
        {/* Icon */}
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", variant.icon)}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", {
                  "bg-primary": color === "primary",
                  "bg-accent": color === "accent",
                  "bg-success": color === "success",
                  "bg-warning": color === "warning",
                  "bg-info": color === "info",
                  "bg-destructive": color === "destructive",
                })}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action */}
        {action && (
          <span className={cn(
            "text-sm font-medium",
            variant.icon.split(' ')[0] // Extract text color
          )}>
            {action} →
          </span>
        )}
      </div>

      {/* Glass Reflection */}
      <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
    </button>
  );
};

export default DashboardCard;
