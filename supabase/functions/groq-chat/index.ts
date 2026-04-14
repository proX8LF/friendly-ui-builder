import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AVAILABLE_MODELS = [
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
  "openai/gpt-5-mini",
];

const SYSTEM_PROMPT = `You are an expert coding agent. You can read, write, and patch files in the user's project.

When the user asks you to modify code, respond with tool calls using the available tools:
- read_file: Read file contents
- write_file: Create or overwrite a file
- patch_file: Update a specific part of a file by replacing a block

When making changes, explain what you're doing concisely. Always use patch_file for existing files when possible.

Format your tool calls as JSON blocks wrapped in <tool_call> tags:
<tool_call>
{"name": "write_file", "arguments": {"file_path": "src/example.ts", "content": "console.log('hello');"}}
</tool_call>

<tool_call>
{"name": "patch_file", "arguments": {"file_path": "src/example.ts", "content_before": "old code", "content_after": "new code"}}
</tool_call>

<tool_call>
{"name": "read_file", "arguments": {"file_path": "src/example.ts"}}
</tool_call>

You can make multiple tool calls in one response. Always provide clear explanations alongside tool calls.

When generating code fragments (e.g. full pages, components, scripts), wrap them in markdown code blocks with the language and file path, like:
\`\`\`tsx file=pages/index.tsx
// code here
\`\`\`

This enables the code to be extracted and run in a sandbox environment.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const selectedModel = AVAILABLE_MODELS.includes(model) ? model : AVAILABLE_MODELS[0];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(
        JSON.stringify({ error: `AI service error: ${status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("groq-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
