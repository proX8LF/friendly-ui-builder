import { useNavigate } from "react-router-dom";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen dot-grid px-4">
      <ThemeToggle />
      <div className="w-full max-w-2xl mx-auto">
        <pre
          className="text-border leading-[1.1] select-none font-mono text-sm ml-8 mb-0 relative z-10"
          style={{ fontFamily: "'JetBrains Mono', monospace", bottom: "-1px" }}
        >
{`▀▄     ▄▀
 █████████
 █▄█████▄█
 █████████
 █ █   █ █`}
        </pre>
        <ChatInput />
      </div>
      <button
        onClick={() => navigate("/agent")}
        className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:opacity-90 active:scale-95 transition-all"
      >
        Open Coding Agent
        <ArrowRight className="w-4 h-4" />
      </button>
      <p className="mt-4 text-xs text-muted-foreground/60">
        Built with care · Powered by AI
      </p>
    </div>
  );
};

export default Index;
