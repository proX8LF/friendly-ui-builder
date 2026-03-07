// Parse <tool_call> blocks from agent responses

export interface ToolCall {
  name: string;
  arguments: Record<string, string>;
}

export function parseToolCalls(text: string): ToolCall[] {
  const calls: ToolCall[] = [];
  const regex = /<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.name && parsed.arguments) {
        calls.push(parsed as ToolCall);
      }
    } catch {
      // skip malformed
    }
  }

  return calls;
}

export function stripToolCalls(text: string): string {
  return text.replace(/<tool_call>\s*[\s\S]*?\s*<\/tool_call>/g, "").trim();
}
