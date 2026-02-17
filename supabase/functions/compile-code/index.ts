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

    if (code.length > 10000) {
      return new Response(JSON.stringify({ error: "Code too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mock execution logic
    console.log(`Compiling ${language} code...`);

    // In a real scenario, this would call a sandboxed environment or a specific compiler API
    let output = "";
    let success = true;

    if (language === "jaclang") {
      if (code.includes("print")) {
        // Simple mock of print statements
        const matches = code.match(/print\((.*?)\)/g);
        if (matches) {
          output = matches.map(m => m.replace(/print\(['"]?(.*?)['"]?\)/, "$1")).join("\n");
        } else {
          output = "Program executed successfully (no output).";
        }
      } else {
        output = "Program executed successfully.";
      }
    } else {
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
