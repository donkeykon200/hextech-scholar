import { CheckCircle2, Circle, Lock, Sparkles, Code2, GitBranch, Cpu, Brain } from "lucide-react";

interface RoadmapStage {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "locked";
  skills: string[];
}

const stages: RoadmapStage[] = [
  {
    id: 1,
    title: "Foundations",
    description: "Learn Jaclang basics & syntax",
    icon: <Code2 className="w-6 h-6" />,
    status: "completed",
    skills: ["Variables & Types", "Functions", "Control Flow", "Basic I/O"],
  },
  {
    id: 2,
    title: "Nodes & Data",
    description: "Master node-based data structures",
    icon: <Circle className="w-6 h-6" />,
    status: "completed",
    skills: ["Node Creation", "Properties", "Node Types", "Data Modeling"],
  },
  {
    id: 3,
    title: "Walkers",
    description: "Build mobile agents that traverse graphs",
    icon: <GitBranch className="w-6 h-6" />,
    status: "current",
    skills: ["Walker Basics", "Traversal", "Abilities", "State Management"],
  },
  {
    id: 4,
    title: "Edges & Graphs",
    description: "Connect nodes into powerful structures",
    icon: <GitBranch className="w-6 h-6 rotate-90" />,
    status: "locked",
    skills: ["Edge Types", "Graph Building", "Pathfinding", "Complex Queries"],
  },
  {
    id: 5,
    title: "Advanced OSP",
    description: "Master Object Spatial Paradigm patterns",
    icon: <Cpu className="w-6 h-6" />,
    status: "locked",
    skills: ["Design Patterns", "Optimization", "Best Practices", "Real Apps"],
  },
  {
    id: 6,
    title: "Bi-LLM & AI",
    description: "Add AI capabilities to your apps",
    icon: <Brain className="w-6 h-6" />,
    status: "locked",
    skills: ["AI Integration", "Prompt Design", "RAG Systems", "AI Agents"],
  },
];

const LearningRoadmap = () => {
  return (
    <div className="relative py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4 border border-primary/30">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Your Learning Journey</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Jaclang Mastery Roadmap</h2>
        <p className="text-muted-foreground">Follow the path to become a Jaclang expert</p>
      </div>

      {/* Roadmap Grid */}
      <div className="relative max-w-5xl mx-auto">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-500
                ${stage.status === "completed" 
                  ? "bg-success/10 border-success/50" 
                  : stage.status === "current"
                  ? "bg-primary/10 border-primary animate-border-glow"
                  : "bg-muted/30 border-muted/50 opacity-60"
                }
                ${stage.status !== "locked" ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed"}
              `}
            >
              {/* Stage Number */}
              <div 
                className={`
                  absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${stage.status === "completed" 
                    ? "bg-success text-success-foreground" 
                    : stage.status === "current"
                    ? "bg-primary text-primary-foreground glow-cyan"
                    : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {stage.id}
              </div>

              {/* Status Icon */}
              <div className="absolute -top-3 -right-3">
                {stage.status === "completed" && (
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                  </div>
                )}
                {stage.status === "current" && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                {stage.status === "locked" && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className={`
                    p-3 rounded-lg
                    ${stage.status === "completed" 
                      ? "bg-success/20 text-success" 
                      : stage.status === "current"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/50 text-muted-foreground"
                    }
                  `}
                >
                  {stage.icon}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {stage.skills.map((skill, i) => (
                  <span
                    key={i}
                    className={`
                      text-xs px-2 py-1 rounded-full
                      ${stage.status === "completed" 
                        ? "bg-success/20 text-success" 
                        : stage.status === "current"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted/50 text-muted-foreground"
                      }
                    `}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Progress indicator for current stage */}
              {stage.status === "current" && (
                <div className="mt-4 pt-4 border-t border-primary/30">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-bold">65%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-12 flex justify-center gap-8 text-center">
        <div className="px-6 py-4 bg-card rounded-xl border border-border">
          <div className="text-2xl font-bold text-success">2/6</div>
          <div className="text-xs text-muted-foreground">Stages Complete</div>
        </div>
        <div className="px-6 py-4 bg-card rounded-xl border border-border">
          <div className="text-2xl font-bold text-primary">33%</div>
          <div className="text-xs text-muted-foreground">Overall Progress</div>
        </div>
        <div className="px-6 py-4 bg-card rounded-xl border border-border">
          <div className="text-2xl font-bold text-warning">~4 weeks</div>
          <div className="text-xs text-muted-foreground">Est. to Complete</div>
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmap;
