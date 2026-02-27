import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen dot-grid px-4">
      <ThemeToggle />
      <div className="w-full max-w-2xl mx-auto">
        {/* Robot sitting on top of the input border */}
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
      <p className="mt-6 text-xs text-muted-foreground/60">
        Built with care · Powered by AI
      </p>
    </div>
  );
};

export default Index;
