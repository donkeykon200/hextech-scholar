import { useState } from "react";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Trigger glitch on hover
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card
      onClick={isLocked ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden transition-all duration-300 graffiti-border spray-texture scanlines
        ${isLocked ? "opacity-40 cursor-not-allowed grayscale" : "cursor-pointer"}
        ${isCompleted ? "border-success" : "border-primary/30"}
        ${!isLocked && isHovered ? "scale-105 z-10" : ""}
        ${isGlitching ? "animate-glitch" : ""}
        ${!isLocked ? "animate-phase" : ""}
      `}
      style={{
        clipPath: isHovered 
          ? "polygon(0 0, 100% 2%, 98% 100%, 2% 98%)" 
          : "polygon(2% 0, 98% 0, 100% 100%, 0 100%)",
      }}
    >
      {/* Animated Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-60"></div>
      
      {/* Spray Paint Drips */}
      <div className="absolute top-0 left-[20%] w-1 h-12 bg-gradient-to-b from-primary/60 to-transparent animate-spray-flicker"></div>
      <div className="absolute top-0 right-[30%] w-0.5 h-8 bg-gradient-to-b from-accent/60 to-transparent animate-spray-flicker" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Glowing Border Effect */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--glow-cyan) / 0.3), transparent)',
          animation: isHovered ? 'scanline 1.5s linear infinite' : 'none',
        }}
      ></div>

      {/* Scratchy Edge Overlay */}
      <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-lg m-1 pointer-events-none"></div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 
              className={`text-lg font-bold mb-1 tracking-wide ${!isLocked ? 'animate-neon-pulse' : 'text-muted-foreground'}`}
              style={{
                fontFamily: 'system-ui',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {title}
            </h3>
            <p className="text-sm text-muted-foreground italic">{description}</p>
          </div>

          {/* Status Icon with Glitch Effect */}
          <div className={`ml-4 ${isHovered && !isLocked ? 'animate-glitch' : ''}`}>
            {isLocked && (
              <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center border border-muted-foreground/30">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            {isCompleted && (
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center glow-cyan relative">
                <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                <div className="absolute inset-0 rounded-full bg-success/50 animate-ping"></div>
              </div>
            )}
            {status === "available" && (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center glow-cyan relative overflow-hidden">
                <Play className="w-5 h-5 text-primary-foreground relative z-10" />
                {/* Rotating glow inside */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'spin 2s linear infinite',
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar with Graffiti Style */}
        {!isLocked && (
          <div className="mb-3">
            <div className="relative">
              <Progress value={progress} className="h-2" />
              {/* Drip effect at progress end */}
              <div 
                className="absolute top-full h-2 w-0.5 bg-primary/60"
                style={{ left: `${Math.min(progress, 95)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground font-mono">{progress}% COMPLETE</span>
              <span 
                className={`text-xs font-bold ${isHovered ? 'text-primary animate-neon-pulse' : 'text-primary'}`}
              >
                +{xp} XP
              </span>
            </div>
          </div>
        )}

        {/* Arcane Symbol Corners */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-sm"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent/50 rounded-tr-sm"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent/50 rounded-bl-sm"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-sm"></div>

        {/* Hextech Corner Accent with animation */}
        <div 
          className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/30 to-transparent rounded-bl-full transition-all duration-300 ${isHovered ? 'w-24 h-24 from-primary/50' : ''}`}
        ></div>
        <div 
          className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent/30 to-transparent rounded-tr-full transition-all duration-300 ${isHovered ? 'w-20 h-20 from-accent/50' : ''}`}
        ></div>
      </div>
    </Card>
  );
};

export default LessonCard;
