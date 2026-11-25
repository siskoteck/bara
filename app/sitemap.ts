import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesStatiques: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/artisans`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/sos-urgence`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/demande`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return routesStatiques;

  const supabase = createClient(url, key);
  const { data: artisans } = await supabase
    .from("artisans")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const routesArtisans: MetadataRoute.Sitemap = (artisans || []).map((a) => ({
    url: `${SITE_URL}/artisans/${a.id}`,
    lastModified: a.created_at ? new Date(a.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...routesStatiques, ...routesArtisans];
}
