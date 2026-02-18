import { 
  BookOpen, 
  Code2, 
  Sparkles, 
  Map, 
  FolderKanban, 
  FileText, 
  ListChecks, 
  Bug, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Users,
  Brain,
  Zap
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "lessons", label: "Lessons", icon: BookOpen, color: "text-primary" },
  { id: "playground", label: "Code Playground", icon: Code2, color: "text-info" },
  { id: "collab", label: "Collab Workspace", icon: Users, color: "text-purple-400" },
  { id: "ai-tutor", label: "AI Tutor", icon: Sparkles, color: "text-accent" },
  { id: "roadmap", label: "Course Roadmap", icon: Map, color: "text-success" },
  { id: "projects", label: "Mini Projects", icon: FolderKanban, color: "text-warning" },
  { id: "summaries", label: "Knowledge Summaries", icon: Brain, color: "text-cyan-400" },
  { id: "skill-tests", label: "Skill Tests", icon: Zap, color: "text-yellow-400" },
  { id: "bug-games", label: "Fun Bug Games", icon: Bug, color: "text-destructive" },
  { id: "mistakes", label: "Mistake Workouts", icon: RotateCcw, color: "text-accent" },
];

interface Sidebar3DProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

const Sidebar3D = ({ activeItem, onItemClick }: Sidebar3DProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 glass-panel border-r border-border/30 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full glass-panel border border-border/50 flex items-center justify-center hover:bg-secondary transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Navigation Items */}
      <nav className="p-3 space-y-1 mt-4">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "w-full sidebar-item-3d rounded-xl p-3 flex items-center gap-3 group",
                "transition-all duration-300 ease-out",
                isActive 
                  ? "glass-panel border border-primary/30 glow-soft" 
                  : "hover:bg-secondary/50 border border-transparent"
              )}
              style={{ 
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div 
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                  isActive 
                    ? "bg-primary/20 shadow-glow-sm" 
                    : "bg-secondary/50 group-hover:bg-secondary"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? item.color : "text-muted-foreground group-hover:text-foreground")} />
              </div>
              
              {!isCollapsed && (
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.label}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-3 right-3">
          <div className="glass-panel-subtle rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Daily Streak</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-warning">7</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar3D;
