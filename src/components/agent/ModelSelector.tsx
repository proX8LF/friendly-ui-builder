import { GROQ_MODELS } from "@/lib/groq-stream";
import { ChevronDown, Sparkles } from "lucide-react";

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const current = GROQ_MODELS.find((m) => m.id === value) ?? GROQ_MODELS[0];

  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-card border border-border rounded-lg pl-8 pr-7 py-1.5 text-xs font-medium text-foreground cursor-pointer hover:bg-muted transition-colors outline-none"
      >
        {GROQ_MODELS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
      <Sparkles className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
    </div>
  );
}
