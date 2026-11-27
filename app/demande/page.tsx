"use client";

import { METIERS, COMMUNES, QUARTIERS_PAR_COMMUNE } from "@/lib/constantes";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { compresserImage } from "@/lib/compressionImage";
import { EnregistreurVocal } from "@/components/EnregistreurVocal";
import Captcha, { CAPTCHA_ACTIF } from "@/components/Captcha";
import { validerNumeroTelephoneCI, validerFichierMedia } from "@/lib/validation";

export default function DemandePage() {
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [communeChoisie, setCommuneChoisie] = useState("");
  const [quartierSaisi, setQuartierSaisi] = useState("");
  const [fichiersPhotos, setFichiersPhotos] = useState<File[]>([]);
  const [apercusPhotos, setApercusPhotos] = useState<string[]>([]);
  const [fichierAudio, setFichierAudio] = useState<File | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const suggestionsQuartiers = communeChoisie
    ? QUARTIERS_PAR_COMMUNE[communeChoisie] || []
    : [];

  function handleSelectionPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const selection = Array.from(e.target.files || []);
    if (selection.length === 0) return;

    const imagesValides = selection
      .filter((f) => f.type.startsWith("image/") && f.size <= 15 * 1024 * 1024)
      .slice(0, 2);

    setFichiersPhotos(imagesValides);
    setApercusPhotos(imagesValides.map((f) => URL.createObjectURL(f)));
  }

  function retirerPhoto(index: number) {
    setFichiersPhotos((prev) => prev.filter((_, i) => i !== index));
    setApercusPhotos((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    // Blocage silencieux des robots (Honeypot)
    const piegeRobot = formData.get("site_web") as string;
    if (piegeRobot) {
      setEnvoye(true);
      return;
    }

    setLoading(true);

    const metierChoisi = formData.get("categorie") as string;
    const descriptionSaisie = (formData.get("description") as string).trim();
    const telephoneSaisi = (formData.get("telephone") as string).trim();
    const budgetSaisi = ((formData.get("budget") as string) || "").trim() || null;
    const quartierPropre = quartierSaisi.trim() || null;

    // 1. Upload et compression des photos de panne
    const urlsPhotos: string[] = [];
    try {
      for (const fichier of fichiersPhotos) {
        const fichierOpti = await compresserImage(fichier, 1200, 0.8);
        const chemin =
          "demandes/panne-" +
          Date.now() +
          "-" +
          Math.random().toString(36).slice(2, 7) +
          ".jpg";

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(chemin, fichierOpti, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(chemin);

        urlsPhotos.push(urlData.publicUrl);
      }
    } catch (uploadErr: unknown) {
      const msg = uploadErr instanceof Error ? uploadErr.message : "Réessayez sans photo.";
      setError("Impossible d'envoyer la photo : " + msg);
      setLoading(false);
      return;
    }

    // 2. Upload de la note vocale (si enregistrée)
    let audioUrlPublic: string | null = null;
    if (fichierAudio) {
      try {
        const ext = fichierAudio.name.split(".").pop() || "webm";
        const cheminAudio =
          "vocaux/note-" +
          Date.now() +
          "-" +
          Math.random().toString(36).slice(2, 7) +
          "." +
          ext;

        const { error: audioUploadError } = await supabase.storage
          .from("avatars")
          .upload(cheminAudio, fichierAudio, {
            contentType: fichierAudio.type || "audio/webm",
            upsert: false,
          });

        if (audioUploadError) throw audioUploadError;

        const { data: audioData } = supabase.storage
          .from("avatars")
          .getPublicUrl(cheminAudio);

        audioUrlPublic = audioData.publicUrl;
      } catch (audioErr: unknown) {
      const msg = audioErr instanceof Error ? audioErr.message : "Réessayez.";
      setError("Impossible d'envoyer la note vocale : " + msg);
      setLoading(false);
      return;
    }
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id ?? null;

    const nouvelleDemande = {
      user_id: userId,
      titre: `${metierChoisi} - ${communeChoisie}${
        quartierPropre ? ` (${quartierPropre})` : ""
      }`,
      metier: metierChoisi,
      commune: communeChoisie,
      quartier: quartierPropre,
      description: descriptionSaisie,
      telephone: telephoneSaisi,
      budget: budgetSaisi,
      photos: urlsPhotos,
      audio_url: audioUrlPublic,
      statut: "ouverte",
    };

    const { error: insertError } = await supabase
      .from("demandes")
      .insert([nouvelleDemande]);

    if (insertError) {
      console.error(insertError);
      setError("Erreur lors de l'envoi : " + insertError.message);
      setLoading(false);
      return;
    }

    try {
      await fetch("/api/notifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sujet: `Nouvelle demande : ${metierChoisi} à ${communeChoisie}`,
          contenu: `Métier : ${metierChoisi}\nCommune : ${communeChoisie}${
            quartierPropre ? ` (${quartierPropre})` : ""
          }\nTéléphone client : ${telephoneSaisi}\nBudget : ${
            budgetSaisi || "Non précisé"
          }\nPhotos jointes : ${urlsPhotos.length}\nNote vocale : ${
            audioUrlPublic ? "Oui" : "Non"
          }\n\nDescription :\n${descriptionSaisie}`,
        }),
      });
    } catch (mailError) {
      console.error("Erreur notification e-mail:", mailError);
    }

    setEnvoye(true);
    setLoading(false);
  }
  if (envoye) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border p-10">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-3">Demande envoyée !</h1>
          <p className="text-gray-600 mb-8">
            Des artisans qualifiés vont bientôt vous contacter.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/mes-demandes"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700"
            >
              Voir mes demandes
            </Link>
            <Link
              href="/"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Poster une demande</h1>
      <p className="text-gray-600 mb-8">
        Décrivez votre besoin par écrit, note vocale ou photo pour obtenir un devis précis.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border p-8 space-y-6"
      >
        <input
          type="text"
          name="site_web"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />

        <div>
          <label htmlFor="categorie" className="block text-sm font-medium mb-2">
            Métier recherché *
          </label>
          <select
            id="categorie"
            name="categorie"
            required
            defaultValue=""
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
          >
            <option value="" disabled>
              Choisir un métier
            </option>
            {METIERS.map((metier) => (
              <option key={metier} value={metier}>
                {metier}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description du besoin *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Expliquez clairement ce dont vous avez besoin..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        {/* Enregistrement d'une note vocale */}
        <EnregistreurVocal onAudioChange={setFichierAudio} />

        {/* Ajout de photos de la panne */}
        <div className="p-4 rounded-xl border border-dashed border-orange-300 bg-orange-50/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                📷 Photos de la panne ou du chantier{" "}
                <span className="text-gray-500 font-normal">(facultatif, max 2)</span>
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Aide l&apos;artisan à évaluer le travail et les pièces nécessaires.
              </p>
            </div>

            <label className="cursor-pointer bg-white border border-orange-300 text-orange-700 hover:bg-orange-50 text-xs font-semibold px-4 py-2 rounded-lg transition">
              + Choisir des photos
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSelectionPhotos}
                className="hidden"
              />
            </label>
          </div>

          {apercusPhotos.length > 0 && (
            <div className="flex gap-3 mt-4">
              {apercusPhotos.map((src, idx) => (
                <div key={src} className="relative w-24 h-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Aperçu ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => retirerPhoto(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center shadow"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commune + Sous-quartier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="commune" className="block text-sm font-medium mb-2">
              Commune à Abidjan *
            </label>
            <select
              id="commune"
              name="commune"
              required
              value={communeChoisie}
              onChange={(e) => {
                setCommuneChoisie(e.target.value);
                setQuartierSaisi("");
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
            >
              <option value="" disabled>
                Choisir une commune
              </option>
              {COMMUNES.map((commune) => (
                <option key={commune} value={commune}>
                  {commune}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quartier" className="block text-sm font-medium mb-2">
              Sous-quartier{" "}
              <span className="text-gray-400 font-normal">(facultatif)</span>
            </label>
            <input
              id="quartier"
              name="quartier"
              type="text"
              list="liste-quartiers-demande"
              value={quartierSaisi}
              onChange={(e) => setQuartierSaisi(e.target.value)}
              placeholder={
                suggestionsQuartiers.length > 0
                  ? "Ex: " + suggestionsQuartiers + "..."
                  : "Choisir ou taper un quartier"
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
            <datalist id="liste-quartiers-demande">
              {suggestionsQuartiers.map((q) => (
                <option key={q} value={q} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label htmlFor="telephone" className="block text-sm font-medium mb-2">
            Votre numéro de téléphone (WhatsApp) *
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            required
            pattern="[0-9 +]{8,16}"
            title="Entrez un numéro valide, par exemple 07 00 00 00 00"
            placeholder="07 00 00 00 00"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-2">
            Budget approximatif (optionnel)
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            placeholder="Ex: 50 000 FCFA"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </form>
    </div>
  );
}
