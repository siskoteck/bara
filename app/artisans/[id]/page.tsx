"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { construireLienWhatsAppArtisan } from "@/lib/whatsapp";
import { PartageSecuriteProche } from "@/components/PartageSecuriteProche";
import { BoutonRecommander } from "@/components/BoutonRecommander";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import { AvisArtisanSection } from "@/components/artisans/AvisArtisanSection";
import {
  ProfilArtisanSkeleton,
  FallbackErreurBara,
} from "@/components/shared/BaraSkeletons";

interface Artisan {
  id: string;
  name: string;
  metier: string;
  commune: string | null;
  quartier?: string | null;
  telephone: string | null;
  whatsapp_lien?: string | null;
  description: string | null;
  avatar_url: string | null;
  realisations: string[] | null;
  verifie: boolean | null;
  disponible: boolean | null;
  derniere_activite?: string | null;
  recommandations?: number;
  created_at?: string;
}

interface Avis {
  id: number | string;
  created_at: string;
  auteur: string;
  note: number;
  commentaire: string | null;
}

function ContenuFicheArtisan() {
  const params = useParams();
  const rawId = params?.id;
  const id = decodeURIComponent(
    String(Array.isArray(rawId) ? rawId : rawId ?? "")
  );

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [similaires, setSimilaires] = useState<Artisan[]>([]);
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erreurChargement, setErreurChargement] = useState("");
  const [photoZoom, setPhotoZoom] = useState<string | null>(null);
  const [afficherHeaderMobile, setAfficherHeaderMobile] = useState(false);

  const [auteur, setAuteur] = useState("");
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [envoiAvis, setEnvoiAvis] = useState(false);
  const [messageAvis, setMessageAvis] = useState("");

  useEffect(() => {
    function surDefilement() {
      const pos =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setAfficherHeaderMobile(pos > 120);
    }
    surDefilement();
    window.addEventListener("scroll", surDefilement, {
      passive: true,
      capture: true,
    });
    return () =>
      window.removeEventListener("scroll", surDefilement, { capture: true });
  }, []);
  const chargerFiche = useCallback(async () => {
    if (!id || id === "undefined" || id === "null") {
      setErreurChargement("Identifiant manquant dans l'adresse URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErreurChargement("");

    const [resSession, resArtisan, resAvis] = await Promise.all([
      supabase.auth.getSession(),
      supabase.from("artisans").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("avis")
        .select("*")
        .eq("artisan_id", id)
        .order("created_at", { ascending: false }),
    ]);

    setUtilisateurConnecte(Boolean(resSession.data.session?.user));

    if (resArtisan.error) {
      setErreurChargement(resArtisan.error.message);
    } else if (resArtisan.data) {
      const detail = resArtisan.data as Artisan;
      setArtisan(detail);

      const { data: simData } = await supabase
        .from("artisans")
        .select("*")
        .neq("id", detail.id)
        .or(`metier.eq.${detail.metier},commune.eq.${detail.commune || "Abidjan"}`)
        .order("verifie", { ascending: false })
        .limit(8);

      if (simData) {
        const triees = [...(simData as Artisan[])].sort((a, b) => {
          const scoreA =
            (a.metier === detail.metier ? 2 : 0) +
            (a.commune === detail.commune ? 1 : 0);
          const scoreB =
            (b.metier === detail.metier ? 2 : 0) +
            (b.commune === detail.commune ? 1 : 0);
          return scoreB - scoreA;
        });
        setSimilaires(triees.slice(0, 3));
      }
    }

    if (resAvis.data) setAvis(resAvis.data as Avis[]);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    chargerFiche();
  }, [chargerFiche]);

  async function handleAjouterAvis(e: React.FormEvent) {
    e.preventDefault();
    if (!artisan || !auteur.trim()) return;

    setEnvoiAvis(true);
    setMessageAvis("");

    const { data, error } = await supabase
      .from("avis")
      .insert([
        {
          artisan_id: artisan.id,
          auteur: auteur.trim(),
          note,
          commentaire: commentaire.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) {
      setMessageAvis("Erreur : " + error.message);
    } else if (data) {
      setAvis((prev) => [data as Avis, ...prev]);
      setAuteur("");
      setCommentaire("");
      setNote(5);
      setMessageAvis("Merci ! Votre avis a bien été publié.");
    }

    setEnvoiAvis(false);
  }
  if (loading) {
    return <ProfilArtisanSkeleton />;
  }

  if (erreurChargement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <FallbackErreurBara
          titre="Impossible de charger la fiche de cet artisan"
          message={erreurChargement}
          onReessayer={chargerFiche}
        />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Artisan introuvable
        </h1>
        <Link
          href="/artisans"
          className="text-orange-600 font-semibold hover:underline"
        >
          ← Retour à l&apos;annuaire
        </Link>
      </div>
    );
  }

  const estConnecte = artisan.derniere_activite
    ? Date.now() - new Date(artisan.derniere_activite).getTime() < 15 * 60 * 1000
    : false;

  const estNouveau = artisan.created_at
    ? Date.now() - new Date(artisan.created_at).getTime() < 30 * 24 * 60 * 60 * 1000
    : false;

  const moyenneNote =
    avis.length > 0
      ? (avis.reduce((acc, a) => acc + a.note, 0) / avis.length).toFixed(1)
      : null;

  const initiales = artisan.name
    ? artisan.name
        .split(" ")
        .map((n) => n)
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  const lienWhatsApp =
    artisan.whatsapp_lien || artisan.telephone
      ? construireLienWhatsAppArtisan({
          whatsappLien: artisan.whatsapp_lien,
          telephone: artisan.telephone,
          nomArtisan: artisan.name,
        })
      : "";

  return (
    <div className="pb-24 md:pb-12">
      {/* Header fixe au défilement */}
      {afficherHeaderMobile && (
        <div
          style={{ zIndex: 9999 }}
          className="fixed top-0 inset-x-0 bg-white/95 backdrop-blur-md border-b border-orange-200 px-4 py-2.5 shadow-lg"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {artisan.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artisan.avatar_url}
                  alt={artisan.name}
                  className="w-9 h-9 rounded-full object-cover border border-orange-200 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-extrabold shrink-0">
                  {initiales}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-extrabold text-gray-900 truncate">
                  {artisan.name}
                </p>
                <p className="text-[11px] text-orange-600 font-semibold truncate">
                  {artisan.metier} • {artisan.commune || "Abidjan"}
                </p>
              </div>
            </div>

            {utilisateurConnecte && lienWhatsApp ? (
              <a
                href={lienWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-green-600 text-white text-xs font-bold px-3.5 py-2 rounded-full shrink-0 shadow-sm"
              >
                💬 WhatsApp
              </a>
            ) : (
              <Link
                href="/auth/login"
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-2 rounded-full shrink-0"
              >
                Contact
              </Link>
            )}
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
        <Link
          href="/artisans"
          className="inline-block text-sm font-medium text-gray-600 hover:text-orange-600"
        >
          ← Retour aux artisans
        </Link>

        {/* Carte Hero / Profil principal */}
        <AvisArtisanSection artisanId={artisan.id} artisanNom={artisan.name} avisInitiaux={avis} />
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-extrabold">
              Besoin de ce professionnel ? Contactez-le maintenant
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Échangez directement avec {artisan.name} ou demandez un devis gratuit via BARA.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            {utilisateurConnecte && lienWhatsApp ? (
              <a
                href={lienWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-green-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition"
              >
                💬 Contacter sur WhatsApp
              </a>
            ) : (
              <Link
                href="/auth/login"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition"
              >
                🔒 Voir le contact
              </Link>
            )}
            <Link
              href={`/demande?metier=${encodeURIComponent(artisan.metier)}`}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition"
            >
              Demander un devis
            </Link>
          </div>
        </div>

        {similaires.length > 0 && (
          <section className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                Artisans similaires à Abidjan
              </h2>
              <Link
                href="/artisans"
                className="text-xs sm:text-sm font-semibold text-orange-600 hover:underline"
              >
                Voir tout l&apos;annuaire →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similaires.map((sim) => (<ArtisanCard key={sim.id} artisan={sim} />))}
            </div>
          </section>
        )}
      </div>

      {photoZoom && (
        <div
          onClick={() => setPhotoZoom(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl w-full">
            <button
              type="button"
              onClick={() => setPhotoZoom(null)}
              className="absolute -top-10 right-0 text-white text-sm font-bold bg-white/15 px-3 py-1 rounded-full"
            >
              ✕ Fermer
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoZoom}
              alt="Réalisation agrandie"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white border-t border-gray-200 p-3 shadow-lg">
        {utilisateurConnecte && lienWhatsApp ? (
          <a
            href={lienWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-green-600 text-white font-extrabold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md"
          >
            💬 Contacter sur WhatsApp
          </a>
        ) : (
          <Link
            href="/auth/login"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md"
          >
            🔒 Connectez-vous pour contacter sur WhatsApp
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FicheArtisanPage() {
  return (
    <Suspense fallback={<ProfilArtisanSkeleton />}>
      <ContenuFicheArtisan />
    </Suspense>
  );
}
