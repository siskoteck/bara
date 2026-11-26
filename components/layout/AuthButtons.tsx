"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = (
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "cv2tcv2t@gmail.com"
).toLowerCase();

export default function AuthButtons() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [nom, setNom] = useState<string | null>(null);
  const [estArtisan, setEstArtisan] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);
  const [connecte, setConnecte] = useState(false);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    async function appliquer(
      user:
        | { id: string; email?: string; user_metadata?: Record<string, string> }
        | undefined
        | null
    ) {
      if (!user) {
        setConnecte(false);
        setEstArtisan(false);
        setEstAdmin(false);
        setNom(null);
        return;
      }

      setConnecte(true);
      setNom(user.user_metadata?.nom ?? user.email?.split("@") ?? "Mon compte");
      setEstAdmin(user.email?.toLowerCase() === ADMIN_EMAIL);

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

  if (!pret) return <div className="w-24 h-9" />;

  if (connecte) {
    const initiale = (nom || "B").trim().charAt(0).toUpperCase();

    return (
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {estAdmin && (
          <Link
            href="/admin"
            className={`text-xs font-extrabold px-2.5 py-2 rounded-xl transition whitespace-nowrap ${
              pathname.startsWith("/admin")
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            ⚙️ Admin
          </Link>
        )}

        <Link
          href="/mes-demandes"
          className={`text-xs sm:text-sm font-bold px-3 py-2 rounded-xl transition whitespace-nowrap ${
            pathname.startsWith("/mes-demandes")
              ? "bg-orange-600 text-white shadow-xs"
              : "bg-gray-100 hover:bg-orange-50 text-gray-800 hover:text-orange-700"
          }`}
        >
          📋 Mes demandes
        </Link>

        {estArtisan && (
          <Link
            href="/mon-profil"
            title={`Espace artisan : ${nom || "Mon profil"}`}
            className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full text-xs sm:text-sm font-bold transition border whitespace-nowrap ${
              pathname.startsWith("/mon-profil")
                ? "bg-orange-600 border-orange-600 text-white shadow-xs"
                : "bg-emerald-50/90 border-emerald-300 text-emerald-900 hover:bg-emerald-100"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                pathname.startsWith("/mon-profil")
                  ? "bg-white text-orange-600"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {initiale}
            </span>
            <span className="max-w-[95px] truncate hidden sm:inline">
              {nom || "Mon profil"}
            </span>
            <span className="sm:hidden">Profil</span>
          </Link>
        )}

        <button
          type="button"
          onClick={deconnexion}
          title="Se déconnecter"
          className="text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-2 rounded-xl transition whitespace-nowrap"
        >
          Quitter
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href="/auth/login"
        className={`text-xs sm:text-sm font-bold px-3 py-2 rounded-xl transition whitespace-nowrap ${
          pathname.startsWith("/auth/login")
            ? "bg-orange-100 text-orange-800"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        Connexion
      </Link>
      <Link
        href="/auth/register"
        className={`text-xs sm:text-sm font-extrabold px-3.5 py-2 rounded-xl transition shadow-xs whitespace-nowrap ${
          pathname.startsWith("/auth/register")
            ? "bg-orange-700 text-white"
            : "bg-orange-600 text-white hover:bg-orange-700"
        }`}
      >
        S&apos;inscrire
      </Link>
    </div>
  );
}