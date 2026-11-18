"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { compresserImage } from "@/lib/compressionImage";

interface RealisationsUploadProps {
  userId: string;
  photosActuelles: string[];
  onChange: (nouvellesPhotos: string[]) => void;
}

const MAX_PHOTOS = 6;

export function RealisationsUpload({
  userId,
  photosActuelles,
  onChange,
}: RealisationsUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleAjouterPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const fichiers = Array.from(e.target.files || []);
    if (fichiers.length === 0) return;

    setErreur("");

    const placesRestantes = MAX_PHOTOS - photosActuelles.length;
    if (placesRestantes <= 0) {
      setErreur(`Vous avez atteint la limite de ${MAX_PHOTOS} photos.`);
      return;
    }

    const aTraiter = fichiers.slice(0, placesRestantes);

    try {
      setUploading(true);
      const nouvellesUrls: string[] = [];

      for (const file of aTraiter) {
        if (!file.type.startsWith("image/")) continue;

        if (file.size > 15 * 1024 * 1024) {
          setErreur(
            `La photo "${file.name}" dépasse 15 Mo et a été ignorée.`
          );
          continue;
        }

        // Compression automatique à 1200px max
        const fichierOpti = await compresserImage(file, 1200, 0.8);
        const chemin = `${userId}/realisation-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}.jpg`;

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

        nouvellesUrls.push(urlData.publicUrl);
      }

      if (nouvellesUrls.length > 0) {
        const listeFinale = [...photosActuelles, ...nouvellesUrls];

        const { error: updateError } = await supabase
          .from("artisans")
          .update({ realisations: listeFinale })
          .eq("user_id", userId);

        if (updateError) throw updateError;

        onChange(listeFinale);
      }
    } catch (err: any) {
      console.error("Erreur upload réalisations:", err);
      setErreur(err.message || "Erreur lors de l'envoi des photos.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSupprimerPhoto(urlASupprimer: string) {
    const listeMiseAJour = photosActuelles.filter((u) => u !== urlASupprimer);

    const { error } = await supabase
      .from("artisans")
      .update({ realisations: listeMiseAJour })
      .eq("user_id", userId);

    if (!error) {
      onChange(listeMiseAJour);
    }
  }

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <p className="font-semibold text-sm text-gray-900">
            Photos de mes réalisations ({photosActuelles.length}/{MAX_PHOTOS})
          </p>
          <p className="text-xs text-gray-500">
            Montrez vos chantiers terminés (jusqu&apos;à 15 Mo par photo).
          </p>
        </div>

        {photosActuelles.length < MAX_PHOTOS && (
          <label className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
            {uploading ? "Compression et envoi..." : "+ Ajouter des photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAjouterPhotos}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {erreur && <p className="text-red-600 text-xs mb-3">{erreur}</p>}

      {photosActuelles.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
          {photosActuelles.map((url, index) => (
            <div key={url + index} className="relative group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Réalisation ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleSupprimerPhoto(url)}
                title="Supprimer cette photo"
                className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-90 hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
