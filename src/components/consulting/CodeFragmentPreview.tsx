import { useState } from "react";
import { Code2, Play, Loader2, ExternalLink, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { CodeFragment, SandboxResult } from "@/lib/types";
import { runInSandbox } from "@/lib/e2b-client";
import { toast } from "sonner";

interface Props {
  fragment: CodeFragment | null;
  onClose: () => void;
}

export default function CodeFragmentPreview({ fragment, onClose }: Props) {
  const [sandboxResult, setSandboxResult] = useState<SandboxResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!fragment) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center px-6 gap-3 opacity-40">
        <Code2 className="w-10 h-10 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground font-medium">No code fragment selected</p>
          <p className="text-xs text-muted-foreground mt-1">Click a code fragment in the chat to preview it</p>
        </div>
      </div>
    );
  }

  const handleRun = async () => {
    setIsRunning(true);
    setSandboxResult(null);
    try {
      const result = await runInSandbox(fragment);
      setSandboxResult(result);
      toast.success("Sandbox ready!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to run sandbox");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fragment.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-primary shrink-0" />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground tracking-tight truncate">
              {fragment.title}
            </h2>
            <p className="text-[10px] text-muted-foreground font-mono truncate">{fragment.filePath}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {fragment.language}
          </Badge>
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Code */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="relative group">
            <pre className="bg-muted/50 border border-border/50 rounded-lg p-4 text-xs font-mono leading-relaxed overflow-x-auto text-foreground">
              <code>{fragment.code}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Sandbox preview */}
        {sandboxResult?.url && (
          <div className="px-4 pb-4">
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border/50">
                <span className="text-[10px] font-mono text-muted-foreground truncate">{sandboxResult.url}</span>
                <a href={sandboxResult.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </a>
              </div>
              <iframe
                src={sandboxResult.url}
                className="w-full h-[400px] bg-background"
                sandbox="allow-scripts allow-same-origin allow-popups"
                title="Sandbox Preview"
              />
            </div>
          </div>
        )}

        {/* Execution output for code-interpreter */}
        {sandboxResult && !sandboxResult.url && (
          <div className="px-4 pb-4 space-y-2">
            {sandboxResult.stdout && sandboxResult.stdout.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-1">Output:</p>
                <pre className="bg-muted/50 rounded-lg p-3 text-xs font-mono text-primary">
                  {sandboxResult.stdout.join("\n")}
                </pre>
              </div>
            )}
            {sandboxResult.stderr && sandboxResult.stderr.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-destructive mb-1">Errors:</p>
                <pre className="bg-destructive/10 rounded-lg p-3 text-xs font-mono text-destructive">
                  {sandboxResult.stderr.join("\n")}
                </pre>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Actions */}
      <div className="p-3 border-t border-border/50 shrink-0 flex gap-2">
        <Button onClick={handleRun} disabled={isRunning} className="flex-1 gap-2" size="sm">
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Starting Sandbox...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Run in Sandbox
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
