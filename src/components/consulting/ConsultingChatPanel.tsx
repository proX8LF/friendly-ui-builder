import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { type Msg } from "@/lib/consulting-stream";
import MessageBubble from "./MessageBubble";
import VoiceButton from "./VoiceButton";

interface Props {
  messages: Msg[];
  isLoading: boolean;
  onSend: (text: string) => void;
}

export default function ConsultingChatPanel({ messages, isLoading, onSend }: Props) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    onSend(trimmed);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/50 shrink-0">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">💬 Consulting Chat</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Ask about your project strategy</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-2">
        {messages.filter(m => m.role !== "system").length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-2 opacity-50">
            <Bot className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Submit an idea to start consulting</p>
          </div>
        )}
        {messages.filter(m => m.role !== "system").map((m, i) => (
          <MessageBubble key={i} role={m.role as "user" | "assistant"} content={m.content} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="px-4 py-3 flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
            </div>
            <div className="bg-muted/50 rounded-xl px-4 py-2.5 text-sm text-muted-foreground">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border/50 shrink-0">
        <div className="flex gap-2 items-end">
          <VoiceButton onTranscript={(t) => setInput((prev) => prev + (prev ? " " : "") + t)} disabled={isLoading} />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask a consulting question..."
            className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:border-primary/50 transition-colors min-h-[40px] max-h-[100px] text-foreground placeholder:text-muted-foreground"
            rows={1}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = "auto";
              t.style.height = t.scrollHeight + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Re-export for convenience
import { Bot } from "lucide-react";
