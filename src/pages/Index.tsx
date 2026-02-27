import ChatInput from "@/components/ChatInput";

const AsciiMascot = () => (
  <pre className="text-primary text-sm leading-tight select-none mb-4 font-mono">
{`     ▀▄     ▄▀
      █████████
      █▄█████▄█
      █████████
      █ █   █ █`}
  </pre>
);

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dot-grid px-4">
      <div className="flex flex-col items-center mb-8">
        <AsciiMascot />
      </div>
      <ChatInput />
    </div>
  );
};

export default Index;
