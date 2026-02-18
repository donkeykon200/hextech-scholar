import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, language = "jaclang" } = await req.json();

    // Input Validation
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (messages.length > 20) {
      return new Response(JSON.stringify({ error: "Too many messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalLength = messages.reduce((acc, m) => acc + (m.content?.length || 0), 0);
    if (totalLength > 4000) {
      return new Response(JSON.stringify({ error: "Messages too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Starting ${language} tutor request with`, messages.length, "messages");

    let systemPrompt = `You are an expert ${language} tutor and AI learning assistant for the Jaclang Academy. Your role is to help students learn ${language} programming.`;

    if (language === "jaclang") {
      systemPrompt += `
## Your Knowledge Areas:
- **Jaclang Syntax**: Modern Python-like syntax with unique constructs
- **Object Spatial Paradigm (OSP)**: Nodes, Walkers, Edges, and Abilities
- **Bi-LLM Integration**: How to add AI capabilities to Jaclang apps

## Key Jaclang Concepts:
1. **Nodes**: Data containers in the graph
2. **Walkers**: Mobile agents that traverse nodes
3. **Edges**: Connections between nodes
4. **Abilities**: Methods attached to nodes
5. **Entry Points**: Program execution start

## Example Jaclang Code:
\`\`\`jaclang
node Person { has name: str; }
walker Greeter { can greet with Person entry { print(f"Hello, {here.name}!"); } }
with entry { p = Person(name="Alice"); root ++> p; Greeter() spawn root; }
\`\`\`
`;
    }

    systemPrompt += `
## Teaching Style:
- Be encouraging and supportive
- Use code examples frequently
- Break complex concepts into digestible pieces
- Keep responses concise but informative`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Tutor error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
