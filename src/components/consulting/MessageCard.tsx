import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { User, Bot, ChevronRight, Code2 } from "lucide-react";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CodeFragment, ConsultingMessage } from "@/lib/types";

interface Props {
  message: ConsultingMessage;
  isActiveCodeFragment: boolean;
  onCodeFragmentClick: (codeFragment: CodeFragment) => void;
}

export default function MessageCard({
  message,
  isActiveCodeFragment,
  onCodeFragmentClick,
}: Props) {
  const { role, content, createdAt, codeFragment, imageUrl } = message;
  const isUser = role === "user";

  if (role === "assistant") {
    return (
      <div className="flex gap-3 px-4 py-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-muted text-muted-foreground">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-muted/50 rounded-xl px-4 py-2.5 text-sm leading-relaxed text-foreground">
            <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 max-w-none">
              <ReactMarkdown>{content.replace(/<br\s*\/?>/g, "\n")}</ReactMarkdown>
            </div>
          </div>

          {codeFragment && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCodeFragmentClick(codeFragment)}
              className={cn(
                "mt-2 gap-2 text-xs transition-all",
                isActiveCodeFragment && "border-primary bg-primary/10 text-primary"
              )}
            >
              <Code2 className="w-3.5 h-3.5" />
              {codeFragment.title}
              <ChevronRight className="w-3 h-3" />
            </Button>
          )}

          <p className="text-[10px] text-muted-foreground mt-1.5">
            {formatDistance(createdAt, new Date())} ago
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4 py-3 flex-row-reverse">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-primary/20 text-primary">
        <User className="w-3.5 h-3.5" />
      </div>
      <Card className="max-w-[85%] border-primary/20 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-sm">
        {imageUrl && (
          <div className="mb-2 rounded-lg overflow-hidden">
            <img src={imageUrl} alt="Uploaded" className="max-w-full h-auto max-h-48 object-cover rounded-lg" />
          </div>
        )}
        <p className="text-sm leading-relaxed">{content}</p>
        <p className="text-[10px] opacity-60 mt-1.5">
          {formatDistance(createdAt, new Date())} ago
        </p>
      </Card>
    </div>
  );
}
