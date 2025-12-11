import { cn } from "@/lib/utils";

interface ProgressSphereProps {
  percentage: number;
  label: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-40 h-40",
};

const ProgressSphere = ({ percentage, label, sublabel, size = "md" }: ProgressSphereProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center">
      <div className={cn("relative", sizes[size])}>
        {/* Background Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/20 to-transparent blur-xl" />
        
        {/* SVG Progress Ring */}
        <svg className="relative w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{percentage}%</span>
        </div>

        {/* Floating Indicator */}
        <div 
          className="absolute w-3 h-3 rounded-full bg-primary shadow-glow-sm"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${(percentage / 100) * 360 - 90}deg) translateY(-45px) translate(-50%, -50%)`,
            transformOrigin: '0 0',
          }}
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
};

export default ProgressSphere;
