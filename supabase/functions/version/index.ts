import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { makeLogger } from "../_shared/logger.ts";

const log = makeLogger("version");

// Bump on every release. Keep in sync with CHANGELOG.md.
const VERSION = "0.1.0-pilot.1";
const COMMIT = Deno.env.get("GIT_COMMIT") ?? "unknown";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Allow internal monitoring via CRON_SECRET, otherwise require a valid JWT.
  const cronSecret = Deno.env.get("CRON_SECRET");
  const providedSecret = req.headers.get("x-cron-secret");
  let authorised = cronSecret && providedSecret && providedSecret === cronSecret;

  if (!authorised) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data: claims } = await supabase.auth.getClaims(
        authHeader.replace("Bearer ", ""),
      );
      if (claims?.claims?.sub) authorised = true;
    }
  }

  if (!authorised) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  log.info("version_read", { version: VERSION });
  return new Response(
    JSON.stringify({ version: VERSION, commit: COMMIT, runtime: "deno" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
  );
});
