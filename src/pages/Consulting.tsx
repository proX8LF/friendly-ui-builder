import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ConsultingChatPanel from "@/components/consulting/ConsultingChatPanel";
import IdeaInput from "@/components/consulting/IdeaInput";
import PlanOutput from "@/components/consulting/PlanOutput";
import CodeFragmentPreview from "@/components/consulting/CodeFragmentPreview";
import ThemeToggle from "@/components/ThemeToggle";
import { streamConsulting } from "@/lib/consulting-stream";
import { extractCodeFragments } from "@/lib/code-extractor";
import { Sparkles, Code2 } from "lucide-react";
import type { ConsultingMessage, CodeFragment } from "@/lib/types";

export default function Consulting() {
  const [chatMessages, setChatMessages] = useState<ConsultingMessage[]>([]);
  const [planContent, setPlanContent] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [ideaContext, setIdeaContext] = useState("");
  const [activeCodeFragment, setActiveCodeFragment] = useState<CodeFragment | null>(null);
  const [showCodePanel, setShowCodePanel] = useState(false);

  const handleCodeFragmentClick = useCallback((fragment: CodeFragment) => {
    setActiveCodeFragment(fragment);
    setShowCodePanel(true);
  }, []);

  const handleIdeaSubmit = useCallback(async (idea: string, files: File[]) => {
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

    setChatMessages([
      { role: "system", content: `The user submitted this project idea:\n\n${context}`, createdAt: new Date() },
      {
        role: "assistant",
        content: "I've analyzed your idea and generated a strategic plan in the right panel. Feel free to ask me any questions about the project, tech stack, timeline, or strategy!",
        createdAt: new Date(),
      },
    ]);
  }, []);

  const handleChatSend = useCallback(async (text: string) => {
    const userMsg: ConsultingMessage = { role: "user", content: text, createdAt: new Date() };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    let assistantText = "";
    const allMessages = [
      ...(ideaContext ? [{ role: "system" as const, content: `User's project idea:\n${ideaContext}` }] : []),
      ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: userMsg.role, content: userMsg.content },
    ];

    await streamConsulting({
      messages: allMessages,
      mode: "chat",
      onDelta: (chunk) => {
        assistantText += chunk;
        setChatMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.indexOf(last) === prev.length - 1) {
            return prev.map((m, i) =>
              i === prev.length - 1
                ? { ...m, content: assistantText, codeFragment: extractCodeFragments(assistantText)[0] || null }
                : m
            );
          }
          return [
            ...prev,
            {
              role: "assistant",
              content: assistantText,
              createdAt: new Date(),
              codeFragment: extractCodeFragments(assistantText)[0] || null,
            },
          ];
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
        <div className="flex items-center gap-2">
          {!showCodePanel && activeCodeFragment && (
            <button
              onClick={() => setShowCodePanel(true)}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              Show Code
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Multi-panel layout */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left: Chat */}
          <ResizablePanel defaultSize={25} minSize={18} maxSize={35}>
            <div className="h-full border-r border-border/30 bg-card/30 backdrop-blur-sm">
              <ConsultingChatPanel
                messages={chatMessages}
                isLoading={isChatLoading}
                onSend={handleChatSend}
                activeCodeFragment={activeCodeFragment}
                onCodeFragmentClick={handleCodeFragmentClick}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border/20 hover:bg-primary/20 transition-colors" />

          {/* Center: Idea Input */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <div className="h-full border-r border-border/30 bg-card/20 backdrop-blur-sm">
              <IdeaInput onSubmit={handleIdeaSubmit} isAnalyzing={isPlanLoading} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border/20 hover:bg-primary/20 transition-colors" />

          {/* Right: Plan Output */}
          <ResizablePanel defaultSize={showCodePanel ? 25 : 50} minSize={20}>
            <div className="h-full bg-card/10 backdrop-blur-sm">
              <PlanOutput content={planContent} isGenerating={isPlanLoading} />
            </div>
          </ResizablePanel>

          {/* Optional: Code Fragment Panel */}
          {showCodePanel && (
            <>
              <ResizableHandle withHandle className="bg-border/20 hover:bg-primary/20 transition-colors" />
              <ResizablePanel defaultSize={25} minSize={18}>
                <div className="h-full border-l border-border/30 bg-card/20 backdrop-blur-sm">
                  <CodeFragmentPreview
                    fragment={activeCodeFragment}
                    onClose={() => setShowCodePanel(false)}
                  />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
