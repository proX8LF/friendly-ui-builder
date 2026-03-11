import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ConsultingChatPanel from "@/components/consulting/ConsultingChatPanel";
import IdeaInput from "@/components/consulting/IdeaInput";
import PlanOutput from "@/components/consulting/PlanOutput";
import ThemeToggle from "@/components/ThemeToggle";
import { streamConsulting, type Msg } from "@/lib/consulting-stream";
import { Sparkles } from "lucide-react";

export default function Consulting() {
  const [chatMessages, setChatMessages] = useState<Msg[]>([]);
  const [planContent, setPlanContent] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [ideaContext, setIdeaContext] = useState("");

  const handleIdeaSubmit = useCallback(async (idea: string, files: File[]) => {
    // Build context from files
    let context = idea;
    for (const file of files) {
      try {
        const text = await file.text();
        context += `\n\n--- File: ${file.name} ---\n${text}`;
      } catch {
        context += `\n\n[File: ${file.name} - could not read]`;
      }
    }

    setIdeaContext(context);
    setPlanContent("");
    setIsPlanLoading(true);

    // Generate plan on right panel
    let planText = "";
    await streamConsulting({
      messages: [{ role: "user", content: context }],
      mode: "plan",
      onDelta: (chunk) => {
        planText += chunk;
        setPlanContent(planText);
      },
      onDone: () => setIsPlanLoading(false),
      onError: (err) => {
        setIsPlanLoading(false);
        toast.error(err);
      },
    });

    // Also add to chat as context
    setChatMessages([
      { role: "system", content: `The user submitted this project idea:\n\n${context}` },
      { role: "assistant", content: "I've analyzed your idea and generated a strategic plan in the right panel. Feel free to ask me any questions about the project, tech stack, timeline, or strategy!" },
    ]);
  }, []);

  const handleChatSend = useCallback(async (text: string) => {
    const userMsg: Msg = { role: "user", content: text };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    let assistantText = "";
    const allMessages = [
      ...(ideaContext ? [{ role: "system" as const, content: `User's project idea:\n${ideaContext}` }] : []),
      ...chatMessages,
      userMsg,
    ];

    await streamConsulting({
      messages: allMessages,
      mode: "chat",
      onDelta: (chunk) => {
        assistantText += chunk;
        setChatMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.indexOf(last) === prev.length - 1) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantText } : m));
          }
          return [...prev, { role: "assistant", content: assistantText }];
        });
      },
      onDone: () => setIsChatLoading(false),
      onError: (err) => {
        setIsChatLoading(false);
        toast.error(err);
      },
    });
  }, [chatMessages, ideaContext]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-border/50 flex items-center justify-between px-4 shrink-0 backdrop-blur-sm bg-background/80">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-sm font-semibold text-foreground tracking-tight">AI Consulting Session</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* 3-panel layout */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left: Chat */}
          <ResizablePanel defaultSize={28} minSize={20} maxSize={40}>
            <div className="h-full border-r border-border/30 bg-card/30 backdrop-blur-sm">
              <ConsultingChatPanel
                messages={chatMessages}
                isLoading={isChatLoading}
                onSend={handleChatSend}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border/20 hover:bg-primary/20 transition-colors" />

          {/* Center: Idea Input */}
          <ResizablePanel defaultSize={32} minSize={25} maxSize={45}>
            <div className="h-full border-r border-border/30 bg-card/20 backdrop-blur-sm">
              <IdeaInput onSubmit={handleIdeaSubmit} isAnalyzing={isPlanLoading} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border/20 hover:bg-primary/20 transition-colors" />

          {/* Right: Plan Output */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="h-full bg-card/10 backdrop-blur-sm">
              <PlanOutput content={planContent} isGenerating={isPlanLoading} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
