import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://vercel.app";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getArtisanSeo(id: string) {
  const supabase = getSupabaseServer();
  if (!supabase || !id) return null;

  const { data } = await supabase
    .from("artisans")
    .select("id, name, metier, commune, quartier, description, avatar_url, verifie")
    .eq("id", decodeURIComponent(id))
    .maybeSingle();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artisan = await getArtisanSeo(id);

  if (!artisan) {
    return {
      title: "Fiche Artisan | BARA Abidjan",
      description:
        "Trouvez un artisan qualifié et vérifié à Abidjan (plombier, électricien, frigoriste, menuisier, serrurier, mécanicien).",
    };
  }

  const commune = artisan.commune || "Abidjan";
  const quartier = artisan.quartier ? ` (${artisan.quartier})` : "";
  const titre = `${artisan.name} — ${artisan.metier} à ${commune}${quartier} | BARA Abidjan`;
  const description =
    artisan.description?.slice(0, 155) ||
    `Contactez ${artisan.name}, ${artisan.metier} à ${commune}, Abidjan. Profil ${
      artisan.verifie ? "vérifié par BARA" : "disponible"
    } avec devis gratuit et contact direct sur WhatsApp.`;

  return {
    title: titre,
    description,
    alternates: {
      canonical: `${SITE_URL}/artisans/${artisan.id}`,
    },
    openGraph: {
      title: titre,
      description,
      url: `${SITE_URL}/artisans/${artisan.id}`,
      siteName: "BARA Abidjan",
      type: "profile",
      images: artisan.avatar_url ? [{ url: artisan.avatar_url }] : undefined,
    },
  };
}

export default async function ArtisanDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artisan = await getArtisanSeo(id);

  const jsonLd = artisan
    ? {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        name: `${artisan.name} - ${artisan.metier}`,
        description:
          artisan.description ||
          `${artisan.metier} professionnel intervenant à ${
            artisan.commune || "Abidjan"
          }, Côte d'Ivoire.`,
        url: `${SITE_URL}/artisans/${artisan.id}`,
        image: artisan.avatar_url || undefined,
        areaServed: {
          "@type": "City",
          name: artisan.commune || "Abidjan",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: artisan.commune || "Abidjan",
          addressRegion: "Abidjan",
          addressCountry: "CI",
        },
        priceRange: "FCFA - Devis gratuit",
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
