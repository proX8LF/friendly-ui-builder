import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">AI-Powered Development Platform</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] mb-6">
          Build with{" "}
          <span className="text-primary relative">
            AI Vibe
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
              <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
            </svg>
          </span>
          <br />
          Ship faster, think bigger
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Your AI consulting & coding companion. Upload ideas, get strategic plans,
          generate code, and run it in live sandboxes — all in one session.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate("/consulting")}
            className="gap-2 px-8 h-12 text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Start Consulting
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/agent")}
            className="gap-2 px-8 h-12 text-base rounded-xl"
          >
            Open Agent
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
