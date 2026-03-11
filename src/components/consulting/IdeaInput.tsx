import { useState, useCallback } from "react";
import { Upload, FileText, Send, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: (idea: string, files: File[]) => void;
  isAnalyzing: boolean;
}

export default function IdeaInput({ onSubmit, isAnalyzing }: Props) {
  const [idea, setIdea] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!idea.trim() && files.length === 0) return;
    onSubmit(idea, files);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/50 shrink-0">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">🚀 Your Idea</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Describe your project or upload docs</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Idea textarea */}
        <div className="flex-1 min-h-[200px]">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={"Describe your project idea...\n\nExamples:\n• A SaaS platform for team collaboration\n• An AI-powered content management system\n• A marketplace for freelance developers\n\nPress Ctrl+Enter to analyze"}
            className="w-full h-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-primary/50 transition-colors text-foreground placeholder:text-muted-foreground leading-relaxed"
            disabled={isAnalyzing}
          />
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border/50 hover:border-muted-foreground/30",
            isAnalyzing && "opacity-50 pointer-events-none"
          )}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop files here or <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">PDF, docs, text, images</p>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.md,.json,.csv"
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 text-xs">
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span className="text-foreground truncate max-w-[120px]">{f.name}</span>
                <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="p-4 border-t border-border/50 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={(!idea.trim() && files.length === 0) || isAnalyzing}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Start AI Consulting Session
            </>
          )}
        </button>
      </div>
    </div>
  );
}
