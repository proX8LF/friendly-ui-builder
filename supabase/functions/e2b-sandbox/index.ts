import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const E2B_API_BASE = "https://api.e2b.dev";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const E2B_API_KEY = Deno.env.get("E2B_API_KEY");
    if (!E2B_API_KEY) {
      throw new Error("E2B_API_KEY is not configured");
    }

    const { template, filePath, code, language, additionalDeps } = await req.json();

    if (!code || !template) {
      return new Response(
        JSON.stringify({ error: "Missing code or template" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create E2B sandbox
    const createResp = await fetch(`${E2B_API_BASE}/sandboxes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": E2B_API_KEY,
      },
      body: JSON.stringify({
        templateID: template,
        timeoutMs: 300000, // 5 minutes in ms
      }),
    });

    if (!createResp.ok) {
      const errText = await createResp.text();
      console.error("E2B create error:", createResp.status, errText);
      return new Response(
        JSON.stringify({ error: `Failed to create sandbox: ${createResp.status} - ${errText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sandbox = await createResp.json();
    const sandboxId = sandbox.sandboxID;

    // Install additional dependencies if provided
    if (additionalDeps && additionalDeps.length > 0) {
      const installCmd = template === "code-interpreter-v1"
        ? `pip install ${additionalDeps.join(" ")}`
        : `cd /home/user && npm install ${additionalDeps.join(" ")}`;

      await fetch(`${E2B_API_BASE}/sandboxes/${sandboxId}/commands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": E2B_API_KEY,
        },
        body: JSON.stringify({ cmd: installCmd, timeoutMs: 60000 }),
      });
    }

    // Write the code file
    const targetPath = filePath || (template === "code-interpreter-v1" ? "script.py" : "pages/index.tsx");

    const writeResp = await fetch(
      `${E2B_API_BASE}/sandboxes/${sandboxId}/files`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": E2B_API_KEY,
        },
        body: JSON.stringify({
          files: [{ path: targetPath, data: code }],
        }),
      }
    );

    if (!writeResp.ok) {
      console.error("E2B write error:", writeResp.status, await writeResp.text());
    }

    // For code-interpreter, execute the code
    if (template === "code-interpreter-v1") {
      const execResp = await fetch(
        `${E2B_API_BASE}/sandboxes/${sandboxId}/code/execution`,
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

    // For web templates (nextjs-developer, etc.), return the preview URL
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
