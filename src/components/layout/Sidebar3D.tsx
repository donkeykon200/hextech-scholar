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
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "playground", label: "Playground", icon: Code2 },
  { id: "ai-tutor", label: "AI Tutor", icon: Sparkles },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "cheatsheets", label: "Cheatsheets", icon: FileText },
  { id: "summaries", label: "Summaries", icon: ListChecks },
  { id: "bug-games", label: "Bug Games", icon: Bug },
  { id: "mistakes", label: "Mistakes", icon: RotateCcw },
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
        "fixed left-0 top-14 bottom-0 z-40 glass-panel border-r border-border/20 transition-all duration-550",
        isCollapsed ? "w-14" : "w-56"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-card border border-border/30 flex items-center justify-center hover:bg-secondary transition-all duration-400"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Navigation Items */}
      <nav className="p-2 space-y-0.5 mt-4">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "w-full sidebar-item rounded-lg p-2.5 flex items-center gap-3 relative",
                "transition-all duration-400",
                isActive 
                  ? "bg-secondary/80 text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ 
                animationDelay: `${index * 30}ms`,
              }}
            >
              {/* Active Line Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary" />
              )}

              <div 
                className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center transition-all duration-400",
                  isActive 
                    ? "bg-primary/10" 
                    : "bg-transparent"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-colors duration-400",
                  isActive ? "text-primary" : ""
                )} />
              </div>
              
              {!isCollapsed && (
                <span className={cn(
                  "text-sm transition-all duration-400",
                  isActive ? "font-medium" : ""
                )}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section - Streak */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-2 right-2">
          <div className="rounded-lg bg-secondary/50 border border-border/20 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-foreground">7</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar3D;
