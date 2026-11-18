"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { compresserImage } from "@/lib/compressionImage";

interface AvatarUploadProps {
  userId: string;
  nom: string;
  urlActuelle: string | null;
  onUpload: (nouvelleUrl: string) => void;
}

export function AvatarUpload({
  userId,
  nom,
  urlActuelle,
  onUpload,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErreur("");

    if (!file.type.startsWith("image/")) {
      setErreur("Veuillez sélectionner une image (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErreur("La photo dépasse 15 Mo. Choisissez une image plus légère.");
      return;
    }

    try {
      setUploading(true);

      // Compression automatique de l'avatar à 600px max
      const fichierOpti = await compresserImage(file, 600, 0.8);
      const chemin = `${userId}/avatar-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(chemin, fichierOpti, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(chemin);

      const nouvelleUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("artisans")
        .update({ avatar_url: nouvelleUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      onUpload(nouvelleUrl);
    } catch (err: any) {
      console.error("Erreur upload avatar:", err);
      setErreur(err.message || "Erreur lors de l'envoi de la photo.");
    } finally {
      setUploading(false);
    }
  }

  const initiales = nom
    ? nom
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center gap-4">
      {urlActuelle ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlActuelle}
          alt={nom}
          className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-bold border border-orange-200 shrink-0">
          {initiales}
        </div>
      )}

      <div className="flex-1 text-center sm:text-left">
        <p className="font-semibold text-sm text-gray-900">Photo de profil</p>
        <p className="text-xs text-gray-500 mt-0.5">
          JPG, PNG ou WebP jusqu&apos;à 15 Mo (optimisation automatique).
        </p>

        <label className="inline-block mt-3 cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-semibold px-4 py-2 rounded-lg transition">
          {uploading ? "Compression et envoi..." : "📷 Changer ma photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {erreur && <p className="text-red-600 text-xs mt-2">{erreur}</p>}
      </div>
    </div>
  );
}
