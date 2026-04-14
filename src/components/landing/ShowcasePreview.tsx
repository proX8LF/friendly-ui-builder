const codeLines = [
  { num: 1, text: 'import Hero from "../components/Hero";', type: "add" },
  { num: 2, text: 'import PlanPanel from "../components/PlanPanel";', type: "add" },
  { num: 3, text: 'import ChatPanel from "../components/ChatPanel";', type: "add" },
  { num: 4, text: 'import CodePreview from "../components/CodePreview";', type: "add" },
  { num: 5, text: '', type: "normal" },
  { num: 6, text: 'export default function App() {', type: "normal" },
  { num: 7, text: '  return (', type: "normal" },
  { num: 8, text: '    <div className="app-layout">', type: "add" },
  { num: 9, text: '      <ChatPanel />', type: "add" },
  { num: 10, text: '      <PlanPanel />', type: "add" },
  { num: 11, text: '      <CodePreview />', type: "add" },
  { num: 12, text: '    </div>', type: "add" },
  { num: 13, text: '  );', type: "normal" },
  { num: 14, text: '}', type: "normal" },
];

const taskItems = [
  { id: "TSK-001", title: "Generate strategic plan", status: "done" },
  { id: "TSK-002", title: "Extract code fragments", status: "done" },
  { id: "TSK-003", title: "Run in E2B sandbox", status: "progress" },
  { id: "TSK-004", title: "Review architecture", status: "review" },
  { id: "TSK-005", title: "Deploy to production", status: "todo" },
];

const statusColors: Record<string, string> = {
  done: "bg-primary",
  progress: "bg-ring",
  review: "bg-destructive",
  todo: "bg-muted-foreground/30",
};

const statusLabels: Record<string, string> = {
  done: "Done",
  progress: "In Progress",
  review: "In Review",
  todo: "Todo",
};

export default function ShowcasePreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Code Review Card */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Review code changes</h3>
            <p className="text-sm text-muted-foreground">Inspect AI generated code with diffs</p>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
                <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/40" />
                <span className="text-[11px] font-mono text-muted-foreground">./src/pages/App.tsx</span>
                <span className="ml-auto text-[10px] text-primary font-medium">+11 -3</span>
              </div>
              <div className="p-0 text-[11px] font-mono leading-5">
                {codeLines.map((line) => (
                  <div
                    key={line.num}
                    className={`flex px-3 ${
                      line.type === "add"
                        ? "bg-primary/8 text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="w-6 shrink-0 text-muted-foreground/50 select-none">{line.num}</span>
                    <span className="w-4 shrink-0 select-none">{line.type === "add" ? "+" : " "}</span>
                    <span className="whitespace-pre">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">QA in live sandboxes</h3>
            <p className="text-sm text-muted-foreground">Start dev servers, preview instantly</p>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono ml-2">localhost:3000</span>
              </div>
              <div className="p-6 min-h-[200px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-lg font-bold">V</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">AI Vibe Coder</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Your project is running ✨</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-medium">
                    Get Started
                  </div>
                  <div className="px-3 py-1 rounded-md border border-border text-[10px] font-medium text-muted-foreground">
                    Learn More
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Management Card */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Organise your work</h3>
            <p className="text-sm text-muted-foreground">Track tasks from idea to deployment</p>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-3 py-2 border-b border-border bg-muted/50 flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Tasks</span>
                <span className="text-[10px] text-primary font-medium">5 items</span>
              </div>
              <div className="divide-y divide-border">
                {taskItems.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${statusColors[task.status]}`} />
                    <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">{task.id}</span>
                    <span className="text-[12px] text-foreground truncate flex-1">{task.title}</span>
                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                      {statusLabels[task.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
