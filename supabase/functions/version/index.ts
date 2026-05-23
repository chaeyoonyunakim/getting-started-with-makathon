import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { makeLogger } from "../_shared/logger.ts";

const log = makeLogger("version");

// Bump on every release. Keep in sync with CHANGELOG.md.
const VERSION = "0.1.0-pilot.1";
const COMMIT = Deno.env.get("GIT_COMMIT") ?? "unknown";

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  log.info("version_read", { version: VERSION });
  return new Response(
    JSON.stringify({ version: VERSION, commit: COMMIT, runtime: "deno" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
  );
});
