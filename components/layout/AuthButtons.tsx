"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "cv2tcv2t@gmail.com";

export default function AuthButtons() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [nom, setNom] = useState<string | null>(null);
  const [estArtisan, setEstArtisan] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);
  const [connecte, setConnecte] = useState(false);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    async function appliquer(user: { id: string; email?: string; user_metadata?: Record<string, string> } | undefined | null) {
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
            className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition ${
              pathname.startsWith("/admin")
                ? "bg-orange-600 text-white ring-2 ring-orange-300"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            Admin
          </Link>
        )}

        <Link
          href="/mes-demandes"
          className={`text-xs sm:text-sm px-3 py-1.5 rounded-xl transition ${
            pathname.startsWith("/mes-demandes")
              ? "bg-orange-600 text-white font-extrabold shadow-sm"
              : "font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
          }`}
        >
          Mes demandes
        </Link>

        {estArtisan && (
          <Link
            href="/mon-profil"
            title={nom || "Mon profil"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition border ${
              pathname.startsWith("/mon-profil")
                ? "bg-orange-600 border-orange-600 text-white shadow-sm"
                : "bg-green-50 border-green-300 text-green-800 hover:bg-green-100"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                pathname.startsWith("/mon-profil") ? "bg-white" : "bg-green-600"
              }`}
            />
            <span>Mon profil</span>
            <span
              className={`hidden sm:inline text-[11px] font-medium ${
                pathname.startsWith("/mon-profil")
                  ? "text-orange-100"
                  : "text-green-700"
              }`}
            >
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
      <Link
        href="/auth/login"
        className={`text-sm px-3 py-1.5 rounded-lg transition ${
          pathname.startsWith("/auth/login")
            ? "bg-orange-100 text-orange-800 font-bold"
            : "font-medium hover:underline"
        }`}
      >
        Connexion
      </Link>
      <Link
        href="/auth/register"
        className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${
          pathname.startsWith("/auth/register")
            ? "bg-orange-800 text-white ring-2 ring-orange-300"
            : "bg-orange-600 text-white hover:bg-orange-700"
        }`}
      >
        S&apos;inscrire
      </Link>
    </div>
  );
}
