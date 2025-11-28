import { useState } from "react";
import { Play, RotateCcw, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

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

  const runCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput("Code executed successfully!\nOutput: Hello from Jaclang!");
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
    setOutput("💡 Hint: Remember to use the 'walker' keyword for traversing nodes in Jaclang!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <Card className="p-6 bg-card border-primary/30">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {exercise ? exercise.title : "Code Editor"}
          </h3>
          {exercise && (
            <p className="text-sm text-muted-foreground mb-4">{exercise.instructions}</p>
          )}
        </div>

        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono text-sm min-h-[300px] bg-background border-border resize-none"
          placeholder="// Write your Jaclang code here..."
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

        <div className="bg-background border border-border rounded-lg p-4 min-h-[300px] font-mono text-sm">
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
