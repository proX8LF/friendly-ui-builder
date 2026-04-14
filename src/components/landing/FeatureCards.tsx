import { Code2, Eye, GitBranch, LayoutDashboard, MessageSquare, Play } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Consulting Chat",
    description: "Chat with a senior AI architect about your project ideas, tech stack, and strategy.",
  },
  {
    icon: LayoutDashboard,
    title: "Strategic Plan Generation",
    description: "Get structured roadmaps, risk analysis, and architecture recommendations in real-time.",
  },
  {
    icon: Code2,
    title: "Code Fragment Extraction",
    description: "AI generates code snippets that are automatically extracted and ready to preview.",
  },
  {
    icon: Play,
    title: "Live Sandbox Execution",
    description: "Run generated code in E2B sandboxes — Next.js, Python, and more with live preview.",
  },
  {
    icon: Eye,
    title: "Review Code Changes",
    description: "Inspect AI-generated code with syntax highlighting before running in sandboxes.",
  },
  {
    icon: GitBranch,
    title: "Virtual Filesystem",
    description: "Full in-browser filesystem. The AI agent reads, writes, and patches files directly.",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-20 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-3">
            Everything you need to vibe code
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From idea to execution — plan, code, and deploy with AI assistance at every step.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-border/50 bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
