import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Sparkles, BookOpen, Cpu, Trophy } from "lucide-react";
import Header from "@/components/Header";
import LessonPath from "@/components/LessonPath";
import CodeEditor from "@/components/CodeEditor";
import AIAssistant from "@/components/AIAssistant";
import AchievementsGrid from "@/components/AchievementsGrid";

const Index = () => {
  const sampleExercise = {
    title: "Your First Walker",
    instructions: "Create a walker that prints 'Hello from Jaclang!' when it visits a node.",
    expectedOutput: "Hello from Jaclang!",
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Hero */}
        <div className="mb-12 text-center relative">
          <div className="absolute inset-0 bg-gradient-radial opacity-50"></div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Master Jaclang
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn Object Spatial Programming with interactive lessons, AI-powered assistance, and hands-on coding exercises
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8 bg-card border border-border">
            <TabsTrigger value="lessons" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="w-4 h-4 mr-2" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Code2 className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Help
            </TabsTrigger>
            <TabsTrigger value="compiler" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Cpu className="w-4 h-4 mr-2" />
              Compiler
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Your Learning Path</h3>
                <p className="text-muted-foreground">Complete lessons to unlock new concepts and earn XP</p>
              </div>
              <LessonPath />
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-0">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Interactive Code Editor</h3>
                <p className="text-muted-foreground">Practice Jaclang with instant feedback</p>
              </div>
              <CodeEditor initialCode={sampleCode} exercise={sampleExercise} />
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">AI Learning Assistant</h3>
                <p className="text-muted-foreground">Get instant help from your AI tutor powered by Bi-LLM</p>
              </div>
              <AIAssistant />
            </div>
          </TabsContent>

          <TabsContent value="compiler" className="mt-0">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Jaclang Compiler</h3>
                <p className="text-muted-foreground">Compile and run your Jaclang code with AI-powered debugging</p>
              </div>
              <CodeEditor 
                initialCode={sampleCode}
              />
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-0">
            <div className="max-w-7xl mx-auto">
              <AchievementsGrid />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
