import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Loader2 } from "lucide-react";

interface Props {
  content: string;
  isGenerating: boolean;
}

export default function PlanOutput({ content, isGenerating }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/50 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">📊 Strategic Plan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">AI-generated consulting output</p>
        </div>
        {isGenerating && (
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <Loader2 className="w-3 h-3 animate-spin" />
            Generating...
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        {!content ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-6 gap-3 opacity-40">
            <FileText className="w-10 h-10 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">No plan generated yet</p>
              <p className="text-xs text-muted-foreground mt-1">Submit your idea to generate a strategic plan</p>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="prose prose-sm dark:prose-invert max-w-none
              prose-headings:text-foreground prose-headings:font-semibold
              prose-h1:text-lg prose-h1:border-b prose-h1:border-border/50 prose-h1:pb-2 prose-h1:mb-4
              prose-h2:text-base
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-li:text-muted-foreground
              prose-strong:text-foreground
              prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1 prose-code:rounded
              prose-table:text-sm
              prose-th:bg-muted/30 prose-th:px-3 prose-th:py-1.5
              prose-td:px-3 prose-td:py-1.5 prose-td:border-border/30
            ">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
