import { useState } from "react";
import { 
  BookOpen, 
  Code2, 
  FolderKanban, 
  Bug, 
  RotateCcw,
  Play,
  ArrowRight
} from "lucide-react";
import TopNavbar from "@/components/layout/TopNavbar";
import Sidebar3D from "@/components/layout/Sidebar3D";
import HeroSection from "@/components/dashboard/HeroSection";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProgressSphere from "@/components/dashboard/ProgressSphere";
import AchievementTotem from "@/components/dashboard/AchievementTotem";
import DailyChallenge from "@/components/dashboard/DailyChallenge";
import ParticleBackground from "@/components/dashboard/ParticleBackground";
import LessonPath from "@/components/LessonPath";
import CodeEditor from "@/components/CodeEditor";
import AIAssistant from "@/components/AIAssistant";
import LearningRoadmap from "@/components/LearningRoadmap";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const sampleCode = `// Define a simple walker in Jaclang
walker greet {
    can visit {
        print("Hello from Jaclang!");
    }
}

// Create a root node
node root {}

// Execute the walker
with entry {
    root spawn greet();
}`;

  const sampleExercise = {
    title: "Your First Walker",
    instructions: "Create a walker that prints 'Hello from Jaclang!' when it visits a node.",
    expectedOutput: "Hello from Jaclang!",
  };

  const renderContent = () => {
    switch (activeSection) {
      case "lessons":
        return (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-foreground mb-2">Your Learning Path</h2>
              <p className="text-sm text-muted-foreground">Complete lessons to unlock new concepts and earn XP</p>
            </div>
            <LessonPath />
          </div>
        );
      case "playground":
        return (
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-foreground mb-2">Code Playground</h2>
              <p className="text-sm text-muted-foreground">Experiment with Jaclang in a safe sandbox environment</p>
            </div>
            <CodeEditor initialCode={sampleCode} exercise={sampleExercise} />
          </div>
        );
      case "ai-tutor":
        return (
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-foreground mb-2">AI Tutor</h2>
              <p className="text-sm text-muted-foreground">Get instant help from your personal AI tutor</p>
            </div>
            <AIAssistant />
          </div>
        );
      case "roadmap":
        return (
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-foreground mb-2">Course Roadmap</h2>
              <p className="text-sm text-muted-foreground">Your journey to Jaclang mastery</p>
            </div>
            <LearningRoadmap />
          </div>
        );
      case "projects":
        return (
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-foreground mb-2">Mini Projects</h2>
              <p className="text-sm text-muted-foreground">Build real-world projects to solidify your knowledge</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Todo App", desc: "Build a task manager with walkers", difficulty: "Beginner", progress: 0 },
                { title: "Graph Visualizer", desc: "Create interactive node graphs", difficulty: "Intermediate", progress: 0 },
                { title: "Chat Bot", desc: "AI-powered conversational agent", difficulty: "Advanced", progress: 0 },
              ].map((project, i) => (
                <DashboardCard
                  key={i}
                  title={project.title}
                  description={project.desc}
                  icon={FolderKanban}
                  progress={project.progress}
                  action="Start Project"
                />
              ))}
            </div>
          </div>
        );
      case "bug-games":
        return (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-foreground mb-2">Bug Hunt Games</h2>
              <p className="text-sm text-muted-foreground">Find and fix bugs in fun, gamified challenges</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Syntax Safari", desc: "Hunt syntax errors in the wild", level: 1 },
                { title: "Logic Labyrinth", desc: "Navigate through logical bugs", level: 2 },
                { title: "Memory Maze", desc: "Fix memory-related issues", level: 3 },
              ].map((game, i) => (
                <DashboardCard
                  key={i}
                  title={game.title}
                  description={game.desc}
                  icon={Bug}
                  action={`Level ${game.level}`}
                />
              ))}
            </div>
          </div>
        );
      case "mistakes":
        return (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-foreground mb-2">Mistake Review</h2>
              <p className="text-sm text-muted-foreground">Review and practice areas where you've struggled</p>
            </div>
            <div className="rounded-xl bg-card border border-border/20 p-8 text-center">
              <RotateCcw className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-foreground mb-2">No mistakes yet</h3>
              <p className="text-xs text-muted-foreground">Complete some lessons to see your areas for improvement.</p>
            </div>
          </div>
        );
      default:
        return <DashboardContent onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <TopNavbar />
      <Sidebar3D activeItem={activeSection === "dashboard" ? "" : activeSection} onItemClick={setActiveSection} />
      
      <main className="pl-56 pt-14 min-h-screen transition-all duration-550">
        <div className="p-6">
          {activeSection !== "dashboard" && (
            <button
              onClick={() => setActiveSection("dashboard")}
              className="mb-6 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors duration-400"
            >
              ← Back to Dashboard
            </button>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <DashboardCard
          title="Continue Lesson"
          description="Pick up where you left off"
          icon={BookOpen}
          progress={65}
          action="Resume"
          onClick={() => onNavigate("lessons")}
        />
        <DashboardCard
          title="Sandbox"
          description="Experiment freely with code"
          icon={Code2}
          action="Open"
          onClick={() => onNavigate("playground")}
        />
        <DashboardCard
          title="Mini Project"
          description="Apply your knowledge"
          icon={FolderKanban}
          action="Browse"
          onClick={() => onNavigate("projects")}
        />
        <DashboardCard
          title="Bug Hunt"
          description="Debug and earn rewards"
          icon={Bug}
          action="Play"
          onClick={() => onNavigate("bug-games")}
        />
        <DashboardCard
          title="Review"
          description="Strengthen weak areas"
          icon={RotateCcw}
          action="Start"
          onClick={() => onNavigate("mistakes")}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Progress & Achievements */}
        <div className="space-y-4">
          <ProgressSphere 
            percentage={42} 
            label="Overall Progress" 
            sublabel="Keep going!" 
          />
          <AchievementTotem />
        </div>

        {/* Center Column - Daily Challenge & Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <DailyChallenge />
          
          {/* Recent Lessons */}
          <div className="rounded-xl bg-card border border-border/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Recent Lessons</h3>
              <button 
                onClick={() => onNavigate("lessons")}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors duration-400"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-2">
              {[
                { title: "Introduction to Walkers", progress: 100, time: "15 min" },
                { title: "Node Data Types", progress: 75, time: "20 min" },
                { title: "Edge Connections", progress: 30, time: "25 min" },
              ].map((lesson, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-all duration-400 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors duration-400">
                    <Play className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors duration-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{lesson.title}</p>
                    <p className="text-[10px] text-muted-foreground">{lesson.time}</p>
                  </div>
                  <div className="w-16">
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-primary/60 transition-all duration-700"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right mt-1">{lesson.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tip */}
          <div className="rounded-xl bg-secondary/30 border border-border/20 p-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Quick Tip</span>
            <p className="text-sm text-foreground mt-1.5 leading-relaxed">
              <span className="text-primary">Walkers</span> are the primary way to traverse graphs in Jaclang. 
              They can carry data and execute abilities when visiting nodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
