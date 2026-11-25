"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { construireLienWhatsAppArtisan } from "@/lib/whatsapp";
import { METIERS, COMMUNES, QUARTIERS_PAR_COMMUNE } from "@/lib/constantes";
import { AvatarUpload } from "@/components/AvatarUpload";
import { RealisationsUpload } from "@/components/RealisationsUpload";
import { CarteVisiteArtisan } from "@/components/CarteVisiteArtisan";
import { GenerateurDevisPDF } from "@/components/GenerateurDevisPDF";
import { ParrainageArtisan } from "@/components/ParrainageArtisan";
import { ChangerMotDePasse } from "@/components/ChangerMotDePasse";
import { SupprimerCompteButton } from "@/components/SupprimerCompteButton";

type Fiche = {
  id: string | number;
  name: string | null;
  metier: string | null;
  commune: string | null;
  quartier: string | null;
  disponible: boolean | null;
  verifie: boolean | null;
  code_parrainage: string | null;
  description: string | null;
  telephone: string | null;
  whatsapp_lien: string | null;
  avatar_url: string | null;
  realisations: string[] | null;
};

export default function MonProfilPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [communeChoisie, setCommuneChoisie] = useState<string>("");
  const [quartierSaisi, setQuartierSaisi] = useState<string>("");
  const [whatsappLienSaisi, setWhatsappLienSaisi] = useState<string>("");
  const [disponible, setDisponible] = useState<boolean>(true);
  const [chargement, setChargement] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    async function charger() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      setUserId(user.id);

      const { data: ligne, error: erreur } = await supabase
        .from("artisans")
        .select(
          "id, name, metier, commune, quartier, disponible, verifie, code_parrainage, description, telephone, whatsapp_lien, avatar_url, realisations"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (erreur) {
        setError("Impossible de charger votre fiche.");
      }

      if (ligne) {
        setFiche(ligne);
        setCommuneChoisie(ligne.commune ?? "");
        setQuartierSaisi(ligne.quartier ?? "");
        setWhatsappLienSaisi(ligne.whatsapp_lien ?? "");
        setDisponible(ligne.disponible ?? true);
      }
      setChargement(false);
    }

    charger();
  }, [router]);

  const suggestionsQuartiers = communeChoisie
    ? QUARTIERS_PAR_COMMUNE[communeChoisie] || []
    : [];

  async function creerMaFicheArtisan() {
    if (!userId) return;
    setSaving(true);
    setError("");

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    const nomInitial =
      user?.user_metadata?.nom || user?.email?.split("@")[0] || "Artisan BARA";

    const { data: nouvelleFiche, error: insertError } = await supabase
      .from("artisans")
      .insert([
        {
          user_id: userId,
          name: nomInitial,
          metier: METIERS[0] || "Plombier",
          commune: "Cocody",
          disponible: true,
        },
      ])
      .select(
        "id, name, metier, commune, quartier, disponible, verifie, code_parrainage, description, telephone, whatsapp_lien, avatar_url, realisations"
      )
      .single();

    if (insertError) {
      setError("Impossible de créer votre fiche : " + insertError.message);
    } else if (nouvelleFiche) {
      setFiche(nouvelleFiche);
      setCommuneChoisie(nouvelleFiche.commune ?? "");
    }
    setSaving(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError("");
    setSucces(false);

    const formData = new FormData(e.currentTarget);
    const miseAJour = {
      name: (formData.get("name") as string).trim(),
      metier: formData.get("metier") as string,
      commune: communeChoisie || null,
      quartier: quartierSaisi.trim() || null,
      disponible,
      description: ((formData.get("description") as string) || "").trim() || null,
      telephone: (formData.get("telephone") as string).trim(),
      whatsapp_lien: whatsappLienSaisi.trim() || null,
    };

    try {
      const { data, error: updateError } = await supabase
        .from("artisans")
        .update(miseAJour)
        .eq("user_id", userId)
        .select("id");

      if (updateError) throw updateError;

      if (!data || data.length === 0) {
        throw new Error("Modification refusée. Reconnectez-vous et réessayez.");
      }

      setFiche((prev) => (prev ? { ...prev, ...miseAJour } : null));
      setSucces(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setSaving(false);
    }
  }
  if (chargement) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-gray-500">
        Chargement…
      </div>
    );
  }

  if (!fiche) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <h1 className="text-xl font-bold mb-2">Activer mon profil artisan</h1>
          <p className="text-gray-600 mb-6">
            Vous êtes connecté. Cliquez ci-dessous pour ouvrir et compléter votre
            fiche artisan sur BARA Abidjan.
          </p>
          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={creerMaFicheArtisan}
            disabled={saving}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {saving ? "Création en cours..." : "Créer ma fiche artisan"}
          </button>
        </div>
      </div>
    );
  }

  const lienApercuWhatsApp = construireLienWhatsAppArtisan({
    whatsappLien: whatsappLienSaisi,
    telephone: fiche.telephone,
    nomArtisan: fiche.name ?? "Artisan BARA",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 border border-green-300 text-xs font-bold px-3 py-1 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse" />
            Profil connecté et visible
          </span>
        </div>
        <p className="text-gray-600 mb-6">
          Complétez votre fiche : c&apos;est ce que voient les clients avant de vous
          contacter sur WhatsApp.
        </p>

        {fiche.verifie ? (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-bold text-green-900">
                Profil vérifié par l&apos;équipe BARA
              </p>
              <p className="text-xs text-green-700">
                Votre badge ✓ Vérifié rassure les clients et vous place en tête des résultats.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-amber-900">
                Obtenir le badge « ✓ Vérifié »
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Envoyez-nous une photo de votre pièce d&apos;identité ou carte professionnelle pour activer votre badge de confiance.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl text-center shrink-0 transition"
            >
              💬 Demander le badge
            </Link>
          </div>
        )}

        {userId && (
          <div className="space-y-4 mb-6">
            <AvatarUpload
              userId={userId}
              nom={fiche.name ?? "Artisan"}
              urlActuelle={fiche.avatar_url}
              onUpload={(nouvelleUrl) =>
                setFiche((prev) =>
                  prev ? { ...prev, avatar_url: nouvelleUrl } : null
                )
              }
            />

            <RealisationsUpload
              userId={userId}
              photosActuelles={fiche.realisations ?? []}
              onChange={(nouvellesPhotos) =>
                setFiche((prev) =>
                  prev ? { ...prev, realisations: nouvellesPhotos } : null
                )
              }
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-gray-900">
                Statut de disponibilité
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {disponible
                  ? "🟢 Vous apparaissez comme disponible immédiatement."
                  : "🟠 Vous apparaissez comme actuellement occupé."}
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={disponible}
                onChange={(e) => setDisponible(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={fiche.name ?? ""}
              autoComplete="name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          <div>
            <label htmlFor="metier" className="block text-sm font-medium mb-1">
              Métier principal
            </label>
            <select
              id="metier"
              name="metier"
              defaultValue={fiche.metier ?? METIERS[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
            >
              {METIERS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="commune" className="block text-sm font-medium mb-1">
                Commune
              </label>
              <select
                id="commune"
                name="commune"
                value={communeChoisie}
                onChange={(e) => {
                  setCommuneChoisie(e.target.value);
                  setQuartierSaisi("");
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
              >
                <option value="">Choisir une commune</option>
                {COMMUNES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quartier" className="block text-sm font-medium mb-1">
                Sous-quartier{" "}
                <span className="text-gray-400 font-normal">(suggestion auto)</span>
              </label>
              <input
                id="quartier"
                name="quartier"
                type="text"
                list="liste-quartiers-profil"
                value={quartierSaisi}
                onChange={(e) => setQuartierSaisi(e.target.value)}
                placeholder={
                  suggestionsQuartiers.length > 0
                    ? "Ex: " + suggestionsQuartiers[0] + "..."
                    : "Choisir ou saisir un quartier"
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
              <datalist id="liste-quartiers-profil">
                {suggestionsQuartiers.map((q) => (
                  <option key={q} value={q} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label htmlFor="telephone" className="block text-sm font-medium mb-1">
              Numéro de téléphone / WhatsApp
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              required
              defaultValue={fiche.telephone ?? ""}
              autoComplete="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="07 00 00 00 00"
            />
          </div>

          {/* Champ dédié : Lien issu de la conversion du QR Code WhatsApp */}
          <div className="p-4 rounded-xl border border-green-200 bg-green-50/60 space-y-2">
            <label
              htmlFor="whatsapp_lien"
              className="block text-sm font-bold text-green-950"
            >
              📲 Lien issu de votre QR Code WhatsApp
            </label>
            <input
              id="whatsapp_lien"
              name="whatsapp_lien"
              type="url"
              value={whatsappLienSaisi}
              onChange={(e) => setWhatsappLienSaisi(e.target.value)}
              placeholder="https://wa.me"
              className="w-full border border-green-300 rounded-lg px-3.5 py-2.5 text-sm bg-white"
            />
                        <div className="text-xs text-green-900 space-y-1.5 pt-1">
              <p className="font-bold">Comment obtenir ce lien ?</p>
              <p>
                <strong>🤖 Sur Android :</strong> Ouvrez{" "}
                <strong>WhatsApp → ⋮ (3 points en haut à droite) → Paramètres → icône QR Code</strong>{" "}
                (à côté de votre nom) → <strong>icône Partager → Copier</strong>.
              </p>
              <p>
                <strong>🍎 Sur iPhone (iOS) :</strong> Ouvrez{" "}
                <strong>WhatsApp → Réglages</strong> (en bas à droite) →{" "}
                <strong>icône QR Code</strong> (à côté de votre nom) →{" "}
                <strong>Partager (en haut à droite) → Copier</strong>.
              </p>
              <p className="text-[11px] text-green-800 italic">
                💡 Sur <strong>WhatsApp Business</strong> : <strong>Paramètres / Réglages → Outils professionnels → Lien court → Copier le lien</strong>.
              </p>
            </div>

            {(whatsappLienSaisi.trim() || fiche.telephone) && (
              <div className="pt-1">
                <a
                  href={lienApercuWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 underline"
                >
                  🔗 Tester mon bouton WhatsApp en direct →
                </a>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Présentation
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={fiche.description ?? ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              placeholder="Vos services, votre expérience, vos zones d'intervention…"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {succes && (
            <div className="text-green-700 text-sm bg-green-50 p-3 rounded-lg">
              Votre fiche a été mise à jour.{" "}
              <Link
                href={"/artisans/" + fiche.id}
                className="font-medium underline"
              >
                Voir ma fiche publique
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>

        <CarteVisiteArtisan
          id={fiche.id}
          nom={fiche.name ?? "Artisan BARA"}
          metier={fiche.metier ?? "Artisan"}
          commune={fiche.commune}
          quartier={fiche.quartier}
          telephone={fiche.telephone}
          verifie={fiche.verifie}
        />

        <GenerateurDevisPDF
          nomArtisan={fiche.name ?? "Artisan BARA"}
          metier={fiche.metier ?? "Artisan"}
          commune={fiche.commune}
          telephone={fiche.telephone}
          verifie={fiche.verifie}
        />

        <ParrainageArtisan
          artisanId={fiche.id}
          nomArtisan={fiche.name ?? "Artisan BARA"}
          codeParrainage={fiche.code_parrainage}
        />

        <ChangerMotDePasse />

        <SupprimerCompteButton />
      </div>
    </div>
  );
}
