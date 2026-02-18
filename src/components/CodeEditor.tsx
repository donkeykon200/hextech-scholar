import { useState } from "react";
import { Play, RotateCcw, Sparkles, CheckCircle, Github, Bug, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CodeEditorProps {
  initialCode?: string;
  exercise?: {
    title: string;
    instructions: string;
    expectedOutput: string;
  };
}

const CodeEditor = ({ initialCode = "", exercise }: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [language, setLanguage] = useState("Jaclang");

  const runCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(`[${language}] Executing...\nCode executed successfully!\nOutput: Hello from ${language}!`);
      setIsRunning(false);
      if (exercise && output.includes(exercise.expectedOutput)) {
        setIsCorrect(true);
      }
    }, 1000);
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput("");
    setIsCorrect(false);
  };

  const getHint = () => {
    setOutput(`💡 Hint: Check your ${language} syntax for any missing brackets or keywords!`);
  };

  const pushToGithub = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Authenticating with GitHub...',
        success: 'Successfully pushed to your repository: student/jaclang-projects',
        error: 'Failed to push. Check your credentials.',
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <Card className="p-6 bg-card border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
          <Bug size={80} />
        </div>

        <div className="mb-4 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {exercise ? exercise.title : "Cyber Sandbox"}
            </h3>
            {exercise && (
              <p className="text-sm text-muted-foreground mb-2">{exercise.instructions}</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-primary/5">
                {language} <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-panel">
              {["Jaclang", "Python", "JavaScript", "C++", "Java"].map((lang) => (
                <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className="hover:bg-primary/20 cursor-pointer">
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono text-sm min-h-[350px] bg-black/40 border-primary/20 resize-none text-primary-foreground focus:ring-1 focus:ring-primary shadow-inner"
          placeholder={`// Start coding in ${language}...`}
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] animate-pulse-slow"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>

          <Button onClick={resetCode} variant="secondary" className="bg-secondary/50">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button onClick={pushToGithub} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Github className="w-4 h-4 mr-2" />
            Push to Git
          </Button>

          <Button onClick={getHint} variant="ghost" className="ml-auto text-muted-foreground hover:text-accent">
            <Sparkles className="w-4 h-4 mr-2" />
            Hint
          </Button>
        </div>
      </Card>

      {/* Output & Results */}
      <Card className="p-6 bg-card border-primary/30 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            Terminal <span className="text-[10px] font-mono text-primary animate-pulse">● LIVE</span>
          </h3>
          {isCorrect && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-bold">Exercise Complete</span>
            </div>
          )}
        </div>

        <div className="bg-black/60 border border-primary/10 rounded-lg p-4 flex-1 font-mono text-sm overflow-auto shadow-inner">
          {output ? (
            <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
          ) : (
            <p className="text-muted-foreground italic opacity-50 font-mono">{`root@jaclang:~# system_ready --mode=${language.toLowerCase()}`}</p>
          )}
        </div>

        {exercise && (
          <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Requirement:</h4>
            <pre className="text-xs text-muted-foreground font-mono">{`output.contains("${exercise.expectedOutput}")`}</pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CodeEditor;
