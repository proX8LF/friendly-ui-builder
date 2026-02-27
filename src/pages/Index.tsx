import ChatInput from "@/components/ChatInput";

const AsciiMascot = () => (
  <pre
    className="text-primary leading-[1.15] select-none mb-6 font-mono text-base tracking-tight"
    style={{ fontFamily: "'JetBrains Mono', monospace" }}
  >
{`    ▀▄     ▄▀
     █████████
     █▄█████▄█
     █████████
     █ █   █ █`}
  </pre>
);

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dot-grid px-4">
      <div className="flex flex-col items-center">
        <AsciiMascot />
      </div>
      <ChatInput />
      <p className="mt-6 text-xs text-muted-foreground/60">
        Built with care · Powered by AI
      </p>
    </div>
  );
};

export default Index;
