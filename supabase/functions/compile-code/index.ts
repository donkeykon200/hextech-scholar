import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language = "jaclang" } = await req.json();

    if (!code) {
      return new Response(JSON.stringify({ error: "No code provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Compiling ${language} code...`);

    let output = "";
    const success = true;

    // Enhanced Mock Logic for multiple languages
    const extractPrint = (code: string, pattern: RegExp) => {
      const matches = code.match(pattern);
      if (matches) {
        return matches.map(m => {
          const match = m.match(pattern);
          return match ? match[1] : "";
        }).join("\n");
      }
      return null;
    };

    switch (language.toLowerCase()) {
      case "python":
        output = extractPrint(code, /print\(['"]?(.*?)['"]?\)/g) || "Python program executed (no output).";
        break;
      case "javascript":
      case "typescript":
        output = extractPrint(code, /console\.log\(['"]?(.*?)['"]?\)/g) || "JS program executed (no output).";
        break;
      case "java":
        output = extractPrint(code, /System\.out\.println\(['"]?(.*?)['"]?\)/g) || "Java program executed (no output).";
        break;
      case "cpp":
      case "c++":
        output = extractPrint(code, /cout\s*<<\s*['"]?(.*?)['"]?;/g) || "C++ program executed (no output).";
        break;
      case "jaclang":
        output = extractPrint(code, /print\(['"]?(.*?)['"]?\)/g) || "Jaclang program executed (no output).";
        break;
      default:
        output = `Mock output for ${language}:\nProgram executed successfully.`;
    }

    return new Response(JSON.stringify({
      success,
      output,
      language,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Compiler error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
