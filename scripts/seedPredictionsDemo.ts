/**
 * Demo seed: inserts 200 synthetic card_selections across 5 fake pupils so the
 * predictions dashboard has data to display.
 *
 * Usage: bun run scripts/seedPredictionsDemo.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const admin = createClient(url, key);

const DEFAULT_ORG = "00000000-0000-0000-0000-000000000001";

async function main() {
  // 1. Make sure we have a scene to attach to.
  const { data: scenes } = await admin.from("scenes").select("id").eq("org_id", DEFAULT_ORG).limit(1);
  if (!scenes || scenes.length === 0) {
    console.error("No scenes for default org — run earlier migrations first.");
    process.exit(1);
  }
  const sceneId = scenes[0].id;

  const { data: sceneCards } = await admin.from("scene_cards").select("card_id").eq("scene_id", sceneId);
  const cardIds = (sceneCards ?? []).map((r) => r.card_id);
  if (cardIds.length < 2) {
    console.error("Need at least 2 cards in the scene.");
    process.exit(1);
  }

  // 2. Create 5 fake pupils.
  const pupilNames = ["Demo A", "Demo B", "Demo C", "Demo D", "Demo E"];
  const pupilIds: string[] = [];
  for (const name of pupilNames) {
    const { data, error } = await admin
      .from("pupils")
      .insert({ org_id: DEFAULT_ORG, display_name: name, year_group: 3 })
      .select("id")
      .single();
    if (error) throw error;
    pupilIds.push(data.id);
  }

  // 3. Insert 200 selections (40 per pupil) as a biased Markov chain.
  const rows: Record<string, unknown>[] = [];
  for (const pupilId of pupilIds) {
    const sessionId = crypto.randomUUID();
    let prev: string | null = null;
    const bias = cardIds[Math.floor(Math.random() * cardIds.length)];
    for (let i = 0; i < 40; i++) {
      const next = Math.random() < 0.6 ? bias : cardIds[Math.floor(Math.random() * cardIds.length)];
      rows.push({
        pupil_id: pupilId,
        scene_id: sceneId,
        from_card_id: prev,
        to_card_id: next,
        session_id: sessionId,
      });
      prev = next;
    }
  }
  const { error: insErr } = await admin.from("card_selections").insert(rows);
  if (insErr) throw insErr;
  console.log(`Inserted ${rows.length} selections across ${pupilIds.length} pupils.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
