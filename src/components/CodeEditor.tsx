import { useState } from "react";
import { Play, RotateCcw, Sparkles, CheckCircle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
  exercise?: {
    title: string;
    instructions: string;
    expectedOutput: string;
  };
}

const CodeEditor = ({ initialCode = "", initialLanguage = "jaclang", exercise }: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setIsCorrect(false);

    try {
      const { data, error } = await supabase.functions.invoke('compile-code', {
        body: { code, language },
      });

      if (error) throw error;

      setOutput(data.output);

      if (exercise && data.output.includes(exercise.expectedOutput)) {
        setIsCorrect(true);
        toast.success("Correct! Well done.");
      }
    } catch (error: any) {
      console.error("Error running code:", error);
      setOutput(`Error: ${error.message || "Failed to execute code"}`);
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput("");
    setIsCorrect(false);
  };

  const getHint = () => {
    const hints: Record<string, string> = {
      jaclang: "💡 Hint: Remember to use the 'walker' keyword for traversing nodes!",
      python: "💡 Hint: Python uses indentation to define blocks of code.",
      javascript: "💡 Hint: Use console.log() for output in JavaScript.",
      java: "💡 Hint: Java requires a class and a main method.",
    };
    setOutput(hints[language] || "💡 Hint: Check your syntax and try again!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <Card className="p-6 bg-card border-primary/30">
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {exercise ? exercise.title : "Code Editor"}
            </h3>
            {exercise && (
              <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
            )}
          </div>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] bg-background">
              <Code className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jaclang">Jaclang</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono text-sm min-h-[350px] bg-background border-border resize-none"
          placeholder={`// Write your ${language} code here...`}
        />

        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="bg-primary hover:bg-primary/90 text-primary-foreground glow-cyan"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running..." : "Run Code"}
          </Button>

          <Button onClick={resetCode} variant="secondary">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button onClick={getHint} variant="outline" className="ml-auto">
            <Sparkles className="w-4 h-4 mr-2" />
            Get Hint
          </Button>
        </div>
      </Card>

      {/* Output & Results */}
      <Card className="p-6 bg-card border-primary/30">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Output</h3>
          {isCorrect && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-bold">Correct!</span>
            </div>
          )}
        </div>

        <div className="bg-background border border-border rounded-lg p-4 min-h-[350px] font-mono text-sm overflow-auto">
          {output ? (
            <pre className="whitespace-pre-wrap text-foreground">{output}</pre>
          ) : (
            <p className="text-muted-foreground">Output will appear here...</p>
          )}
        </div>

        {exercise && (
          <div className="mt-4 p-4 bg-muted/30 border border-border rounded-lg">
            <h4 className="text-sm font-bold text-foreground mb-2">Expected Output:</h4>
            <pre className="text-xs text-muted-foreground font-mono">{exercise.expectedOutput}</pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CodeEditor;
