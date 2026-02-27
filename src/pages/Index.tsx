import mascot from "@/assets/mascot.png";
import ChatInput from "@/components/ChatInput";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dot-grid px-4">
      <div className="flex flex-col items-center mb-8">
        <img
          src={mascot}
          alt="Mascot"
          className="w-16 h-16 mb-2 object-contain"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <ChatInput />
    </div>
  );
};

export default Index;
