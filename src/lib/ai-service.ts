
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jaclang-tutor`;

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface StreamAIOptions {
  messages: Message[];
  systemPrompt?: string;
  onChunk?: (chunk: string) => void;
}

export const streamAIResponse = async ({
  messages,
  systemPrompt,
  onChunk,
}: StreamAIOptions): Promise<string> => {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({
      messages,
      systemPrompt,
    }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    if (resp.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    if (resp.status === 402) {
      throw new Error("AI credits depleted. Please add more credits to continue.");
    }
    throw new Error(errorData.error || "Failed to get response from AI tutor");
  }

  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let fullContent = "";

  const processLine = (line: string) => {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith(":") || !cleanLine.startsWith("data: ")) return;

    const jsonStr = cleanLine.slice(6).trim();
    if (jsonStr === "[DONE]") return;

    try {
      const parsed = JSON.parse(jsonStr);
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) {
        fullContent += content;
        onChunk?.(content);
      }
    } catch (e) {
      // Partial JSON, wait for more chunks
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

  return fullContent;
};
