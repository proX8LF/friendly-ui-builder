import { Brain, Cpu, Sparkles, Star, Zap } from "lucide-react";

const models = [
  { icon: Sparkles, name: "Gemini 3 Flash", color: "bg-primary" },
  { icon: Brain, name: "Gemini 2.5 Pro", color: "bg-primary/90" },
  { icon: Star, name: "GPT-5 Mini", color: "bg-primary/80" },
  { icon: Cpu, name: "GPT-5", color: "bg-primary/70" },
  { icon: Zap, name: "Gemini Flash Lite", color: "bg-primary/60" },
];

export default function ModelShowcase() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight mb-3">
              Switch between top AI models
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Don't get locked in while AI is constantly evolving. Seamlessly switch
              between Gemini, GPT-5, and more — pick the best model for each task.
            </p>
          </div>

          {/* Right icons grid */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            {models.map((m) => (
              <div
                key={m.name}
                className="group relative w-20 h-20 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer"
              >
                <m.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {m.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
