import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const E2B_API_KEY = Deno.env.get("E2B_API_KEY");
    if (!E2B_API_KEY) {
      throw new Error("E2B_API_KEY is not configured");
    }

    const { template, filePath, code, language } = await req.json();

    if (!code || !template) {
      return new Response(
        JSON.stringify({ error: "Missing code or template" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create E2B sandbox
    const createResp = await fetch("https://api.e2b.dev/sandboxes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": E2B_API_KEY,
      },
      body: JSON.stringify({
        templateID: template,
        timeout: 300, // 5 minutes
      }),
    });

    if (!createResp.ok) {
      const errText = await createResp.text();
      console.error("E2B create error:", createResp.status, errText);
      return new Response(
        JSON.stringify({ error: `Failed to create sandbox: ${createResp.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sandbox = await createResp.json();
    const sandboxId = sandbox.sandboxID;
    const clientId = sandbox.clientID;

    // Write file to sandbox
    const writeResp = await fetch(
      `https://api.e2b.dev/sandboxes/${sandboxId}/files`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": E2B_API_KEY,
        },
        body: JSON.stringify({
          files: [{ path: filePath || "pages/index.tsx", data: code }],
        }),
      }
    );

    if (!writeResp.ok) {
      console.error("E2B write error:", writeResp.status, await writeResp.text());
    }

    // For code-interpreter, execute the code
    if (template === "code-interpreter-v1") {
      const execResp = await fetch(
        `https://api.e2b.dev/sandboxes/${sandboxId}/code/execution`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": E2B_API_KEY,
          },
          body: JSON.stringify({ code }),
        }
      );

      const execResult = execResp.ok ? await execResp.json() : null;

      return new Response(
        JSON.stringify({
          sbxId: sandboxId,
          template,
          stdout: execResult?.stdout || [],
          stderr: execResult?.stderr || [],
          error: execResult?.error || null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For web templates, return the preview URL
    // E2B sandbox host pattern
    const port = template === "nextjs-developer" ? 3000 : 80;
    const previewUrl = `https://${sandboxId}-${port}.e2b.dev`;

    return new Response(
      JSON.stringify({
        sbxId: sandboxId,
        template,
        url: previewUrl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("e2b-sandbox error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
