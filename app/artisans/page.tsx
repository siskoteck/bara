import { Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { AnnuaireArtisansClient } from "@/components/artisans/AnnuaireArtisansClient";
import { GrilleArtisansSkeleton } from "@/components/shared/BaraSkeletons";
import type { Artisan } from "@/lib/types";

export const revalidate = 60;

async function chargerArtisansServeur(): Promise<Artisan[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("artisans")
    .select("*")
    .order("verifie", { ascending: false })
    .order("created_at", { ascending: false });

  return (data as Artisan[]) || [];
}

export default async function ArtisansPage() {
  const artisansInitiaux = await chargerArtisansServeur();

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10">
          <GrilleArtisansSkeleton />
        </div>
      }
    >
      <AnnuaireArtisansClient artisansInitiaux={artisansInitiaux} />
    </Suspense>
  );
}