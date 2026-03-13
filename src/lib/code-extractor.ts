import { CodeFragment } from "./types";

let fragmentCounter = 0;

/**
 * Extract code blocks from AI markdown responses and create CodeFragment objects
 */
export function extractCodeFragments(content: string): CodeFragment[] {
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  const fragments: CodeFragment[] = [];
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || "typescript";
    const code = match[2].trim();

    // Skip very short code blocks (likely inline examples)
    if (code.split("\n").length < 3) continue;

    fragmentCounter++;
    const ext = getExtension(language);
    const filePath = inferFilePath(code, language, ext);

    fragments.push({
      id: `fragment-${fragmentCounter}-${Date.now()}`,
      title: inferTitle(code, language),
      filePath,
      code,
      language,
      template: language === "python" ? "code-interpreter-v1" : "nextjs-developer",
    });
  }

  return fragments;
}

function getExtension(lang: string): string {
  const map: Record<string, string> = {
    typescript: "tsx",
    tsx: "tsx",
    javascript: "js",
    jsx: "jsx",
    python: "py",
    css: "css",
    html: "html",
    json: "json",
  };
  return map[lang] || "ts";
}

function inferFilePath(code: string, language: string, ext: string): string {
  // Try to find component/function name
  const componentMatch = code.match(/(?:export\s+(?:default\s+)?)?function\s+(\w+)/);
  const classMatch = code.match(/(?:export\s+)?class\s+(\w+)/);
  const name = componentMatch?.[1] || classMatch?.[1] || "index";

  if (language === "python") return `app.py`;
  if (ext === "tsx" || ext === "jsx") return `pages/${name.toLowerCase()}.${ext}`;
  return `src/${name.toLowerCase()}.${ext}`;
}

function inferTitle(code: string, language: string): string {
  const componentMatch = code.match(/(?:export\s+(?:default\s+)?)?function\s+(\w+)/);
  const classMatch = code.match(/(?:export\s+)?class\s+(\w+)/);
  return componentMatch?.[1] || classMatch?.[1] || `${language} snippet`;
}
