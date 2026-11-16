"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
}

export default function AvatarUpload({ userId, currentUrl, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Récupérer l’URL publique
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      onUpload(publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {currentUrl ? (
        <img
          src={currentUrl}
          alt="Photo de profil"
          className="w-32 h-32 rounded-full object-cover border-4 border-orange-100"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          Pas de photo
        </div>
      )}

      <label className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
        {uploading ? "Upload en cours..." : "Changer la photo"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}