// Virtual Filesystem — in-browser file store with patch support

export interface VFile {
  path: string;
  content: string;
  language: string;
}

function detectLanguage(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    css: "css",
    html: "html",
    json: "json",
    md: "markdown",
    py: "python",
    rs: "rust",
    go: "go",
  };
  return map[ext] ?? "plaintext";
}

// ── Normalise line endings ──
function normalise(s: string): string {
  return s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function createVirtualFS(initial?: Record<string, string>) {
  const files = new Map<string, VFile>();

  if (initial) {
    for (const [path, content] of Object.entries(initial)) {
      files.set(path, { path, content, language: detectLanguage(path) });
    }
  }

  return {
    listFiles(): VFile[] {
      return Array.from(files.values()).sort((a, b) => a.path.localeCompare(b.path));
    },

    readFile(path: string): VFile | undefined {
      return files.get(path);
    },

    writeFile(path: string, content: string): string {
      files.set(path, { path, content, language: detectLanguage(path) });
      return `Successfully wrote '${path}'.`;
    },

    deleteFile(path: string): string {
      if (!files.has(path)) return `Error: File '${path}' not found.`;
      files.delete(path);
      return `Deleted '${path}'.`;
    },

    patchFile(path: string, contentBefore: string, contentAfter: string): string {
      const file = files.get(path);
      if (!file) return `Error: File '${path}' does not exist.`;

      const normContent = normalise(file.content);
      const normBefore = normalise(contentBefore);
      const normAfter = normalise(contentAfter);

      if (!normContent.includes(normBefore)) {
        return `Error: Could not find the 'content_before' block in ${path}. Ensure exact match.`;
      }

      const updated = normContent.replace(normBefore, normAfter);
      if (updated === normContent) {
        return `Notice: No changes applied to ${path}.`;
      }

      files.set(path, { path, content: updated, language: detectLanguage(path) });
      return `Successfully patched '${path}'.`;
    },

    getTreeStructure(): TreeNode[] {
      const root: TreeNode[] = [];
      for (const file of files.values()) {
        const parts = file.path.split("/");
        let current = root;
        for (let i = 0; i < parts.length; i++) {
          const name = parts[i];
          const isFile = i === parts.length - 1;
          let existing = current.find((n) => n.name === name);
          if (!existing) {
            existing = {
              name,
              path: parts.slice(0, i + 1).join("/"),
              type: isFile ? "file" : "folder",
              children: isFile ? undefined : [],
            };
            current.push(existing);
          }
          if (!isFile && existing.children) {
            current = existing.children;
          }
        }
      }
      return sortTree(root);
    },
  };
}

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
  return nodes
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .map((n) => (n.children ? { ...n, children: sortTree(n.children) } : n));
}

export type VirtualFS = ReturnType<typeof createVirtualFS>;
