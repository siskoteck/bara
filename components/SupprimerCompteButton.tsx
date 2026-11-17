"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function SupprimerCompteButton() {
  const router = useRouter();
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  async function handleSupprimerCompte() {
    const confirmation1 = confirm(
      "Voulez-vous vraiment supprimer votre compte BARA ? Votre profil et vos demandes seront définitivement effacés."
    );
    if (!confirmation1) return;

    const confirmation2 = confirm(
      "Cette action est irréversible. Confirmez-vous la suppression définitive de votre compte ?"
    );
    if (!confirmation2) return;

    try {
      setSuppressionEnCours(true);

      const { error } = await supabase.rpc("supprimer_mon_compte");
      if (error) throw error;

      await supabase.auth.signOut();
      alert("Votre compte a bien été supprimé.");
      router.replace("/");
      router.refresh();
    } catch (err: any) {
      console.error("Erreur suppression compte:", err);
      alert(
        "Impossible de supprimer le compte : " +
          (err.message || "Erreur inconnue")
      );
      setSuppressionEnCours(false);
    }
  }

  return (
    <div className="mt-10 pt-6 border-t border-red-100">
      <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-900">
            Supprimer mon compte
          </h3>
          <p className="text-xs text-red-700 mt-1">
            Efface définitivement votre profil, vos annonces et vos données personnelles de BARA.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSupprimerCompte}
          disabled={suppressionEnCours}
          className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition shrink-0"
        >
          {suppressionEnCours ? "Suppression..." : "Supprimer mon compte"}
        </button>
      </div>
    </div>
  );
}
