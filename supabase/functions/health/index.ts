import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { makeLogger } from "../_shared/logger.ts";

const log = makeLogger("health");

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  log.info("health_check");
  return new Response(
    JSON.stringify({ status: "ok", ts: new Date().toISOString() }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
  );
});
