import { useState } from "react";
import { Plus, ChevronDown, ArrowUp, Settings } from "lucide-react";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you want to build?"
            className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-base outline-none min-h-[48px] max-h-[200px]"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Plus className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground text-sm">
              <Settings className="w-3.5 h-3.5" />
              <span>Ask permissions</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground text-sm">
              <span>Sonnet 4.6</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                message.trim()
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 px-1">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm text-foreground">
          <span className="w-3.5 h-3.5 rounded border border-border" />
          <span>claude test</span>
        </button>
        <div className="ml-auto">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm text-muted-foreground">
            <span className="w-3.5 h-3.5 rounded border border-border" />
            <span>Local</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
