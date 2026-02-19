import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { useSync } from "@/hooks/useSync";
import { type LocalLesson } from "@/db/localDb";

const Index = () => {
  const { user } = useAuth();
  useSync(user?.id);

  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<LocalLesson | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("jaclang");

  const sampleCode = {
    jaclang: `// Define a simple walker in Jaclang
walker greet {
    can visit {
        print("Hello from Jaclang!");
    }
}

node root {}

with entry {
    root spawn greet();
}`,
    python: `print("Hello from Python!")`,
    javascript: `console.log("Hello from JavaScript!");`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`,
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}`
  };

  const sampleExercise = {
    title: "Greeting the World",
    instructions: "Write a program that prints a greeting message.",
    expectedOutput: "Hello",
  };

  const handleLessonSelect = (lesson: LocalLesson) => {
    setSelectedLesson(lesson);
    setActiveSection("playground");
  };

  // Reset selected lesson if it doesn't match the selected language
  useEffect(() => {
    if (selectedLesson && selectedLesson.language !== selectedLanguage) {
      setSelectedLesson(null);
    }
  }, [selectedLanguage, selectedLesson]);

  const renderContent = () => {
    switch (activeSection) {
      case "lessons":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Learning Path
              </h2>
              <p className="text-muted-foreground">Complete lessons to unlock new concepts and earn XP</p>
            </div>
            <LessonPath language={selectedLanguage} onLessonSelect={handleLessonSelect} />
          </div>
        );
      case "playground":
        return (
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {selectedLesson ? selectedLesson.title : "Code Playground"}
              </h2>
              <p className="text-muted-foreground">
                {selectedLesson ? "Complete this exercise to earn XP" : `Experiment with ${selectedLanguage} in a safe sandbox environment`}
              </p>
            </div>
            <CodeEditor
              initialCode={selectedLesson?.code_template || sampleCode[selectedLanguage as keyof typeof sampleCode]}
              initialLanguage={selectedLanguage}
              lessonId={selectedLesson?.id}
              exercise={selectedLesson ? {
                title: selectedLesson.title,
                instructions: selectedLesson.content,
                expectedOutput: selectedLesson.expected_output
              } : sampleExercise}
            />
          </div>
        );
      case "ai-tutor":
        return (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">AI {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Tutor</h2>
              <p className="text-muted-foreground">Get instant help from your personal AI tutor</p>
            </div>
            <AIAssistant language={selectedLanguage} />
          </div>
        );
      case "roadmap":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">Course Roadmap</h2>
              <p className="text-muted-foreground">Your journey to {selectedLanguage} mastery</p>
            </div>
            <LearningRoadmap />
          </div>
        );
      case "projects":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">Mini Projects</h2>
              <p className="text-muted-foreground">Build real-world projects to solidify your knowledge</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Todo App", desc: "Build a task manager", difficulty: "Beginner", progress: 0 },
                { title: "Data Processor", desc: "Analyze data sets", difficulty: "Intermediate", progress: 0 },
                { title: "Network Chat", desc: "Communicate over sockets", difficulty: "Advanced", progress: 0 },
              ].map((project, i) => (
                <DashboardCard
                  key={i}
                  title={project.title}
                  description={project.desc}
                  icon={FolderKanban}
                  color={i === 0 ? "success" : i === 1 ? "warning" : "accent"}
                  progress={project.progress}
                  action="Start Project"
                />
              ))}
            </div>
          </div>
        );
      case "bug-games":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">Bug Hunt Games</h2>
              <p className="text-muted-foreground">Find and fix bugs in fun, gamified challenges</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  color="destructive"
                  action={`Level ${game.level}`}
                />
              ))}
            </div>
          </div>
        );
      case "mistakes":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">Mistake Workouts</h2>
              <p className="text-muted-foreground">Review and practice areas where you've struggled</p>
            </div>
            <div className="glass-panel rounded-2xl p-6 text-center">
              <RotateCcw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No mistakes yet!</h3>
              <p className="text-muted-foreground">Complete some lessons to see your areas for improvement.</p>
            </div>
          </div>
        );
      default:
        return <DashboardContent onNavigate={setActiveSection} language={selectedLanguage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <TopNavbar selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
      <Sidebar3D activeItem={activeSection === "dashboard" ? "" : activeSection} onItemClick={setActiveSection} />
      
      <main className="pl-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-8">
          {activeSection !== "dashboard" && (
            <button
              onClick={() => setActiveSection("dashboard")}
              className="mb-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
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
const DashboardContent = ({ onNavigate, language }: { onNavigate: (section: string) => void, language: string }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection language={language} />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <DashboardCard
          title="Continue Lesson"
          description={`Resume your ${language} journey`}
          icon={BookOpen}
          color="primary"
          progress={65}
          action="Resume"
          onClick={() => onNavigate("lessons")}
        />
        <DashboardCard
          title="Sandbox Mode"
          description="Experiment freely with code"
          icon={Code2}
          color="info"
          action="Open Sandbox"
          onClick={() => onNavigate("playground")}
        />
        <DashboardCard
          title="Mini Project"
          description="Apply your knowledge"
          icon={FolderKanban}
          color="warning"
          action="Browse Projects"
          onClick={() => onNavigate("projects")}
        />
        <DashboardCard
          title="Bug Hunt"
          description="Debug and earn rewards"
          icon={Bug}
          color="destructive"
          action="Play Now"
          onClick={() => onNavigate("bug-games")}
        />
        <DashboardCard
          title="Review Mistakes"
          description="Strengthen weak areas"
          icon={RotateCcw}
          color="accent"
          action="Start Review"
          onClick={() => onNavigate("mistakes")}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Stats */}
        <div className="space-y-6">
          <ProgressSphere 
            percentage={42} 
            label="Overall Progress" 
            sublabel="42% Complete" 
          />
          <AchievementTotem />
        </div>

        {/* Center Column - Daily Challenge & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <DailyChallenge />
          
          {/* Recent Lessons */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Recent {language.charAt(0).toUpperCase() + language.slice(1)} Lessons</h3>
              <button 
                onClick={() => onNavigate("lessons")}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { title: `Introduction to ${language}`, progress: 100, time: "15 min" },
                { title: `${language} Data Types`, progress: 75, time: "20 min" },
                { title: "Advanced Concepts", progress: 30, time: "25 min" },
              ].map((lesson, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">{lesson.time}</p>
                  </div>
                  <div className="w-20">
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right mt-1">{lesson.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="glass-panel-subtle rounded-2xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Tip</h3>
            <p className="text-foreground">
              💡 <span className="text-primary font-medium">{language.charAt(0).toUpperCase() + language.slice(1)}</span> is a powerful language.
              Keep practicing to master its nuances!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
