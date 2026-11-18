"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "cv2tcv2t@gmail.com";

export default function AuthButtons() {
  const router = useRouter();
  const [nom, setNom] = useState<string | null>(null);
  const [estArtisan, setEstArtisan] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);
  const [connecte, setConnecte] = useState(false);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    async function appliquer(user: any) {
      if (!user) {
        setConnecte(false);
        setEstArtisan(false);
        setEstAdmin(false);
        setNom(null);
        return;
      }

      setConnecte(true);
      setNom(user.user_metadata?.nom ?? user.email?.split("@")[0] ?? "Mon compte");
      setEstAdmin(user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

      // Vérifier dans les métadonnées ET dans la table artisans
      let isArtisan = user.user_metadata?.type_compte === "artisan";

      const { data: fiche } = await supabase
        .from("artisans")
        .select("id, name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fiche) {
        isArtisan = true;
        if (fiche.name) setNom(fiche.name);
        await supabase
          .from("artisans")
          .update({ derniere_activite: new Date().toISOString() })
          .eq("id", fiche.id);
      }

      setEstArtisan(isArtisan);
    }

    supabase.auth.getSession().then(({ data }) => {
      appliquer(data.session?.user);
      setPret(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      appliquer(session?.user);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function deconnexion() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!pret) return null;

  if (connecte) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        {estAdmin && (
          <Link
            href="/admin"
            className="text-xs font-bold bg-gray-900 text-white px-2.5 py-1 rounded-md hover:bg-gray-800"
          >
            Admin
          </Link>
        )}

        <Link
          href="/mes-demandes"
          className="text-xs sm:text-sm font-medium text-gray-700 hover:text-orange-600"
        >
          Mes demandes
        </Link>

        {estArtisan && (
          <Link
            href="/mon-profil"
            className="inline-flex items-center gap-1.5 bg-green-50 border border-green-300 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold hover:bg-green-100 transition"
          >
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span>Mon profil</span>
            <span className="hidden sm:inline text-[11px] font-medium text-green-700">
              • Connecté
            </span>
          </Link>
        )}

        <button
          onClick={deconnexion}
          className="text-xs sm:text-sm text-gray-600 hover:underline"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/auth/login" className="text-sm font-medium hover:underline">
        Connexion
      </Link>
      <Link
        href="/auth/register"
        className="text-sm font-semibold bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
      >
        S&apos;inscrire
      </Link>
    </div>
  );
}
