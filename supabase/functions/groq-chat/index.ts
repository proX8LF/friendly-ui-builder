import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-guard-4-12b",
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

You can make multiple tool calls in one response. Always provide clear explanations alongside tool calls.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const selectedModel = GROQ_MODELS.includes(model) ? model : GROQ_MODELS[0];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.3,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: `Groq API error: ${response.status}` }),
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
