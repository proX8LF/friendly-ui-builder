import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { PanelLeftClose, PanelLeft, Plus, Trash2 } from "lucide-react";
import ChatPanel from "@/components/agent/ChatPanel";
import CodeEditor from "@/components/agent/CodeEditor";
import FileTree from "@/components/agent/FileTree";
import ModelSelector from "@/components/agent/ModelSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { createVirtualFS } from "@/lib/virtual-fs";
import { streamGroqChat, type Msg } from "@/lib/groq-stream";
import { parseToolCalls, stripToolCalls } from "@/lib/tool-parser";
import { cn } from "@/lib/utils";

const STARTER_FILES: Record<string, string> = {
  "src/main.ts": `console.log("Hello from the coding agent!");`,
  "src/utils.ts": `export function add(a: number, b: number): number {\n  return a + b;\n}`,
  "package.json": `{\n  "name": "my-project",\n  "version": "1.0.0",\n  "main": "src/main.ts"\n}`,
};

export default function Agent() {
  const [fs] = useState(() => createVirtualFS(STARTER_FILES));
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>("src/main.ts");
  const [model, setModel] = useState("google/gemini-3-flash-preview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setTick] = useState(0); // force re-render after fs changes
  const refresh = () => setTick((t) => t + 1);

  const currentFile = selectedFile ? fs.readFile(selectedFile) : null;
  const tree = useMemo(() => fs.getTreeStructure(), [fs, messages, selectedFile]);

  const executeToolCalls = useCallback(
    (text: string): string[] => {
      const calls = parseToolCalls(text);
      const results: string[] = [];
      for (const call of calls) {
        const args = call.arguments;
        switch (call.name) {
          case "write_file":
            results.push(fs.writeFile(args.file_path, args.content));
            if (!selectedFile) setSelectedFile(args.file_path);
            break;
          case "patch_file":
            results.push(fs.patchFile(args.file_path, args.content_before, args.content_after));
            break;
          case "read_file": {
            const f = fs.readFile(args.file_path);
            results.push(f ? `Contents of ${args.file_path}:\n${f.content}` : `File not found: ${args.file_path}`);
            break;
          }
          default:
            results.push(`Unknown tool: ${call.name}`);
        }
      }
      if (results.length > 0) refresh();
      return results;
    },
    [fs, selectedFile]
  );

  const handleSend = useCallback(
    async (text: string) => {
      // Include context about current files
      const fileList = fs.listFiles().map((f) => f.path).join("\n");
      const contextMsg: Msg = {
        role: "system",
        content: `Current project files:\n${fileList}\n\n${
          selectedFile && currentFile
            ? `Currently viewing: ${selectedFile}\n\`\`\`\n${currentFile.content}\n\`\`\``
            : ""
        }`,
      };

      const userMsg: Msg = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      let assistantText = "";
      const allMessages = [...messages, contextMsg, userMsg];

      const upsertAssistant = (chunk: string) => {
        assistantText += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantText } : m));
          }
          return [...prev, { role: "assistant", content: assistantText }];
        });
      };

      await streamGroqChat({
        messages: allMessages,
        model,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => {
          setIsLoading(false);
          // Execute tool calls
          const results = executeToolCalls(assistantText);
          if (results.length > 0) {
            toast.success(`Executed ${results.length} tool call(s)`);
          }
        },
        onError: (err) => {
          setIsLoading(false);
          toast.error(err);
        },
      });
    },
    [messages, model, fs, selectedFile, currentFile, executeToolCalls]
  );

  const handleNewFile = () => {
    const name = prompt("File path (e.g. src/index.ts):");
    if (!name) return;
    fs.writeFile(name, "");
    setSelectedFile(name);
    refresh();
  };

  const handleDeleteFile = () => {
    if (!selectedFile) return;
    fs.deleteFile(selectedFile);
    setSelectedFile(null);
    refresh();
  };

  const handleFileChange = (value: string) => {
    if (selectedFile) {
      fs.writeFile(selectedFile, value);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">Coding Agent</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector value={model} onChange={setModel} />
          <ThemeToggle />
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar / File tree */}
        {sidebarOpen && (
          <div className="w-56 border-r border-border flex flex-col shrink-0 bg-card/50">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Files</span>
              <div className="flex gap-1">
                <button
                  onClick={handleNewFile}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground transition-colors"
                  title="New file"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDeleteFile}
                  disabled={!selectedFile}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                  title="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              <FileTree nodes={tree} selectedFile={selectedFile} onSelectFile={setSelectedFile} />
            </div>
          </div>
        )}

        {/* Chat panel */}
        <div className="w-[380px] border-r border-border shrink-0 flex flex-col bg-card/30">
          <ChatPanel messages={messages} isLoading={isLoading} onSend={handleSend} />
        </div>

        {/* Code editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {currentFile ? (
            <>
              <div className="h-9 border-b border-border flex items-center px-3 bg-card/50 shrink-0">
                <span className="text-xs font-mono text-muted-foreground">{currentFile.path}</span>
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  content={currentFile.content}
                  language={currentFile.language}
                  onChange={handleFileChange}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a file to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
