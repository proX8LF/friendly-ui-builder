import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">AI Vibe Coder</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Built with care · Powered by Gemini & GPT-5
        </p>
      </div>
    </footer>
  );
}
