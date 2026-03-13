import { CodeFragment, SandboxResult } from "./types";

const SANDBOX_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/e2b-sandbox`;

export async function runInSandbox(fragment: CodeFragment): Promise<SandboxResult> {
  const resp = await fetch(SANDBOX_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      template: fragment.template,
      filePath: fragment.filePath,
      code: fragment.code,
      language: fragment.language,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Sandbox request failed" }));
    throw new Error(err.error || `Sandbox error ${resp.status}`);
  }

  return resp.json();
}
