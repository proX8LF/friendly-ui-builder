import { useState } from "react";
import { Plus, ChevronDown, ArrowUp, Globe, Sparkles, Paperclip } from "lucide-react";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full">
      {/* Main input card */}
      <div className="rounded-2xl border border-border bg-card shadow-[0_2px_12px_-2px_hsl(var(--foreground)/0.06)] overflow-hidden transition-shadow hover:shadow-[0_4px_20px_-4px_hsl(var(--foreground)/0.1)]">
        <div className="px-5 pt-4 pb-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you want to build?"
            className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-[15px] leading-relaxed outline-none min-h-[52px] max-h-[200px]"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground" title="Attach file">
              <Plus className="w-[18px] h-[18px]" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted active:scale-[0.97] transition-all text-muted-foreground hover:text-foreground text-[13px] font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>Ask permissions</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted active:scale-[0.97] transition-all text-muted-foreground hover:text-foreground text-[13px] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sonnet 4.6</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>
            <button
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-90 ${
                message.trim()
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground cursor-default"
              }`}
            >
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom tabs */}
      <div className="flex items-center gap-2 mt-3 px-1">
        <button className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted hover:border-muted-foreground/20 active:scale-[0.97] transition-all text-sm text-foreground shadow-sm">
          <span className="w-4 h-4 rounded border-2 border-primary/40 group-hover:border-primary transition-colors" />
          <span className="font-medium">claude test</span>
        </button>
        <div className="ml-auto">
          <button className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted hover:border-muted-foreground/20 active:scale-[0.97] transition-all text-sm text-muted-foreground shadow-sm">
            <Paperclip className="w-3.5 h-3.5" />
            <span className="font-medium">Local</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
