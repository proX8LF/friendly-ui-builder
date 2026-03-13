// Code fragment extracted from AI responses
export interface CodeFragment {
  id: string;
  title: string;
  filePath: string;
  code: string;
  language: string;
  template: string; // e.g. 'nextjs-developer'
}

// Enhanced message type
export interface ConsultingMessage {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  codeFragment?: CodeFragment | null;
  imageUrl?: string;
}

// E2B sandbox result
export interface SandboxResult {
  sbxId: string;
  template: string;
  url?: string;
  stdout?: string[];
  stderr?: string[];
  error?: string;
}

// Available sandbox templates
export const SANDBOX_TEMPLATES = [
  { id: "nextjs-developer", name: "Next.js", port: 3000 },
  { id: "code-interpreter-v1", name: "Python", port: null },
] as const;
