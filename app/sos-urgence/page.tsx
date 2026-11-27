import { createClient } from "@supabase/supabase-js";
import { SosUrgenceClient } from "@/components/sos/SosUrgenceClient";
import type { Artisan } from "@/lib/types";

async function chargerArtisansUrgence(): Promise<Artisan[]> {
  "use cache";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("artisans")
    .select("*")
    .neq("disponible", false)
    .order("verifie", { ascending: false })
    .order("created_at", { ascending: false });

  return (data as Artisan[]) || [];
}

export default async function SosUrgencePage() {
  const artisansInitiaux = await chargerArtisansUrgence();
  return <SosUrgenceClient artisansInitiaux={artisansInitiaux} />;
}