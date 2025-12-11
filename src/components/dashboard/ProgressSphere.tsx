import { cn } from "@/lib/utils";

interface ProgressSphereProps {
  percentage: number;
  label: string;
  sublabel?: string;
  className?: string;
}

const ProgressSphere = ({ percentage, label, sublabel, className }: ProgressSphereProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("rounded-xl bg-card border border-border/20 p-6", className)}>
      <div className="flex flex-col items-center">
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full progress-ring" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              className="progress-ring-track"
              cx="50"
              cy="50"
              r="45"
              strokeWidth="4"
            />
            {/* Progress arc */}
            <circle
              className="progress-ring-progress"
              cx="50"
              cy="50"
              r="45"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-foreground">{percentage}%</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Complete</span>
          </div>
        </div>

        {/* Labels */}
        <h4 className="text-sm font-medium text-foreground mb-0.5">{label}</h4>
        {sublabel && (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        )}
      </div>
    </div>
  );
};

export default ProgressSphere;
