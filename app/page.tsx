import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Wrench } from "lucide-react";
import { HomeSearchSection, type StatsReellesBara } from "@/components/home/HomeSearchSection";
import { ArtisansRecommandes } from "@/components/ArtisansRecommandes";
import { BannierePub } from "@/components/BannierePub";

async function chargerStatsReelles(): Promise<StatsReellesBara> {
  "use cache";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { artisansVerifies: 0, photosRealisations: 0, avisClients: 0 };

  const supabase = createClient(url, key);
  const [resArtisans, resAvis] = await Promise.all([
    supabase.from("artisans").select("verifie, realisations"),
    supabase.from("avis").select("id", { count: "exact", head: true }),
  ]);

  let artisansVerifies = 0;
  let photosRealisations = 0;
  if (Array.isArray(resArtisans.data)) {
    for (const row of resArtisans.data) {
      if (row.verifie) artisansVerifies += 1;
      if (Array.isArray(row.realisations)) photosRealisations += row.realisations.length;
    }
  }
  return { artisansVerifies, photosRealisations, avisClients: resAvis.count || 0 };
}

export default async function HomePage() {
  const stats = await chargerStatsReelles();
  return (
    <div className="bg-gray-50/50">
      <HomeSearchSection stats={stats} />
      <BannierePub emplacement="accueil" />
      <ArtisansRecommandes />
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="bg-gray-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400">Espace Professionnel Abidjan</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1 mb-2">Vous êtes artisan à Abidjan ?</h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl">Créez votre fiche professionnelle gratuitement, montrez vos réalisations et recevez des clients directement sur WhatsApp.</p>
          </div>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-8 py-4 rounded-2xl transition shrink-0 shadow-sm">
            <Wrench className="w-5 h-5" />
            <span>Créer mon profil artisan</span>
          </Link>
        </div>
      </section>
    </div>
  );
}