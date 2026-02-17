import { useState } from "react";
import { Play, RotateCcw, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jaclang-tutor`;

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
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const callAI = async (
    systemPrompt: string,
    userPrompt: string,
    onChunk?: (chunk: string) => void
  ) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to connect to the Jaclang AI engine");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let assistantContent = "";
    let textBuffer = "";

    const processLine = (line: string) => {
      const cleanLine = line.trim();
      if (!cleanLine || cleanLine.startsWith(":") || !cleanLine.startsWith("data: ")) return;

      const jsonStr = cleanLine.slice(6).trim();
      if (jsonStr === "[DONE]") return;

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          assistantContent += content;
          onChunk?.(content);
        }
      } catch (e) {
        // partial json, ignore
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });
      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        const line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        processLine(line);
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      textBuffer.split("\n").forEach(processLine);
    }

    return assistantContent;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setIsCorrect(false);

    try {
      const systemPrompt = `You are a Jaclang code executor. Simulate the execution of the provided Jaclang code.
      Output the results exactly as they would appear in a terminal.
      If there are errors, describe them clearly.
      Do not provide any explanation other than the terminal output.`;

      const userPrompt = `Execute this Jaclang code:\n\n\`\`\`jaclang\n${code}\n\`\`\``;

      let accumulatedOutput = "";
      const result = await callAI(systemPrompt, userPrompt, (chunk) => {
        accumulatedOutput += chunk;
        setOutput(accumulatedOutput);
      });

      if (exercise && result.toLowerCase().includes(exercise.expectedOutput.toLowerCase())) {
        setIsCorrect(true);
        toast.success("Exercise completed correctly!");
      }
    } catch (error) {
      console.error(error);
      setOutput((prev) => prev + "\nError: " + (error instanceof Error ? error.message : "Failed to run code"));
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput("");
    setIsCorrect(false);
  };

  const getHint = async () => {
    setIsGettingHint(true);
    try {
      console.log("Getting hint for exercise:", exercise?.title);
      const systemPrompt = `You are an expert Jaclang tutor. Provide a brief, helpful hint for the following exercise based on the user's current code.
      Keep the hint concise and encouraging. Do not give away the full solution.`;

      const userPrompt = `Exercise: ${exercise?.title || "Jaclang Coding"}\nInstructions: ${exercise?.instructions || "Write Jaclang code."}\nExpected Output: ${exercise?.expectedOutput || ""}\n\nMy current code:\n\`\`\`jaclang\n${code}\n\`\`\``;

      const HINT_PREFIX = "\n\nHint: ";
      let hintAccumulated = HINT_PREFIX;

      // Initial append of the prefix
      setOutput((prev) => prev + HINT_PREFIX);

      const result = await callAI(systemPrompt, userPrompt, (chunk) => {
        hintAccumulated += chunk;
        setOutput((prev) => {
          const index = prev.lastIndexOf(HINT_PREFIX);
          if (index === -1) return prev + chunk;
          return prev.substring(0, index) + hintAccumulated;
        });
      });
      console.log("Hint generation complete length:", result.length);
    } catch (error) {
      console.error("Hint error:", error);
      toast.error("Failed to get hint");
    } finally {
      setIsGettingHint(false);
    }
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
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isRunning ? "Running..." : "Run Code"}
          </Button>

          <Button onClick={resetCode} variant="secondary" disabled={isRunning}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={getHint}
            disabled={isGettingHint || isRunning}
            variant="outline"
            className="ml-auto"
          >
            {isGettingHint ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isGettingHint ? "Getting Hint..." : "Get Hint"}
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

        <div className="bg-background border border-border rounded-lg p-4 min-h-[300px] font-mono text-sm overflow-auto">
          {output ? (
            <pre className="whitespace-pre-wrap text-foreground" data-testid="output-area">{output}</pre>
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
