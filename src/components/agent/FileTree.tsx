import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import { useState } from "react";
import type { TreeNode } from "@/lib/virtual-fs";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  nodes: TreeNode[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

export default function FileTree({ nodes, selectedFile, onSelectFile }: FileTreeProps) {
  return (
    <div className="text-sm font-mono">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          depth={0}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}

function FileTreeNode({
  node,
  depth,
  selectedFile,
  onSelectFile,
}: {
  node: TreeNode;
  depth: number;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isFolder = node.type === "folder";
  const isSelected = selectedFile === node.path;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setOpen(!open);
          else onSelectFile(node.path);
        }}
        className={cn(
          "flex items-center gap-1.5 w-full px-2 py-1 hover:bg-muted/60 rounded text-left transition-colors",
          isSelected && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          open ? (
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <FileText className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        )}
        {isFolder ? (
          <Folder className="w-3.5 h-3.5 shrink-0 text-primary/60" />
        ) : null}
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && open && node.children?.map((child) => (
        <FileTreeNode
          key={child.path}
          node={child}
          depth={depth + 1}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}
