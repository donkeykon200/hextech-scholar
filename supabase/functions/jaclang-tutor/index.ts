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
    const { messages, systemPrompt: customSystemPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Starting Jaclang tutor request with", messages.length, "messages");

    const defaultSystemPrompt = `You are an expert Jaclang tutor and AI learning assistant for the Jaclang Academy. Your role is to help students learn Jaclang programming language and the Object Spatial Paradigm (OSP).

## Your Knowledge Areas:
- **Jaclang Syntax**: Modern Python-like syntax with unique constructs
- **Object Spatial Paradigm (OSP)**: Nodes, Walkers, Edges, and Abilities
- **Bi-LLM Integration**: How to add AI capabilities to Jaclang apps
- **Graph-based Programming**: Building data structures with nodes and edges

## Key Jaclang Concepts to Teach:
1. **Nodes**: Data containers in the graph (like objects but spatial)
2. **Walkers**: Mobile agents that traverse nodes and perform actions
3. **Edges**: Connections between nodes with optional data
4. **Abilities**: Methods attached to nodes that walkers can invoke
5. **Entry Points**: Where program execution begins

## Example Jaclang Code:
\`\`\`jaclang
node Person {
    has name: str;
    has age: int;
}

walker Greeter {
    can greet with Person entry {
        print(f"Hello, {here.name}!");
    }
}

with entry {
    p = Person(name="Alice", age=25);
    root ++> p;
    Greeter() spawn root;
}
\`\`\`

## Teaching Style:
- Be encouraging and supportive like a friendly mentor
- Use code examples frequently
- Break complex concepts into digestible pieces
- Relate OSP concepts to familiar OOP patterns when helpful
- Celebrate progress and achievements
- Keep responses concise but informative`;

    const finalSystemPrompt = customSystemPrompt || defaultSystemPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash",
        messages: [
          { role: "system", content: finalSystemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Jaclang tutor error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
