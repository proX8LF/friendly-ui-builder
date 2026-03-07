// Streaming client for the Groq edge function

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/groq-chat`;

export type Msg = { role: "user" | "assistant" | "system"; content: string };

export const GROQ_MODELS = [
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B" },
  { id: "meta-llama/llama-4-maverick-17b-128e-instruct", label: "Llama 4 Maverick" },
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", label: "Llama 4 Scout" },
  { id: "meta-llama/llama-guard-4-12b", label: "Llama Guard 4" },
] as const;

export async function streamGroqChat({
  messages,
  model,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  model: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, model }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({ error: "Request failed" }));
      onError(errData.error || `Error ${resp.status}`);
      return;
    }

    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }

    // flush remaining
    if (buffer.trim()) {
      for (let raw of buffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {}
      }
    }

    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Stream error");
  }
}
