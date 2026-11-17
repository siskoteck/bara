"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthButtons from "./AuthButtons";

type TypeCompte = "visiteur" | "particulier" | "artisan";

type Lien = {
  href: string;
  label: string; // texte sur ordinateur
  mobile: string; // texte sur téléphone
  cta?: boolean; // bouton mis en avant
};

const MENUS: Record<TypeCompte, Lien[]> = {
  visiteur: [
    { href: "/artisans", label: "Trouver un artisan", mobile: "🔍 Artisans" },
    { href: "/demande", label: "+ Poster une demande", mobile: "➕ Poster un besoin", cta: true },
    { href: "/comment-ca-marche", label: "Comment ça marche", mobile: "ℹ️ Aide" },
  ],
  particulier: [
    { href: "/artisans", label: "Trouver un artisan", mobile: "🔍 Artisans" },
    { href: "/demande", label: "+ Poster une demande", mobile: "➕ Poster un besoin", cta: true },
    { href: "/mes-demandes", label: "Mes demandes", mobile: "📋 Mes demandes" },
    { href: "/comment-ca-marche", label: "Comment ça marche", mobile: "ℹ️ Aide" },
  ],
  artisan: [
    { href: "/mon-profil", label: "Mon profil", mobile: "👤 Mon profil", cta: true },
    { href: "/demandes-clients", label: "Demandes de clients", mobile: "📥 Demandes" },
    { href: "/comment-ca-marche", label: "Comment ça marche", mobile: "ℹ️ Aide" },
  ],
};

export function Header() {
  const [typeCompte, setTypeCompte] = useState<TypeCompte>("visiteur");
  const [pret, setPret] = useState(false);

  useEffect(() => {
    function lireType(user: any) {
      if (!user) setTypeCompte("visiteur");
      else if (user.user_metadata?.type_compte === "artisan") setTypeCompte("artisan");
      else setTypeCompte("particulier");
      setPret(true);
    }

    supabase.auth.getUser().then(({ data }) => lireType(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      lireType(session?.user);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const estArtisan = typeCompte === "artisan";
  const liens = MENUS[typeCompte];

  return (
    <header
      className={`bg-white shadow-sm sticky top-0 z-50 border-b ${
        estArtisan ? "border-b-2 border-orange-600" : "border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo BARA */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-orange-600">
              BARA
            </span>
            {estArtisan ? (
              <span className="text-xs font-semibold bg-orange-600 text-white px-2 py-0.5 rounded-full">
                Espace artisan
              </span>
            ) : (
              <span className="text-xs font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full hidden sm:inline">
                Abidjan
              </span>
            )}
          </Link>

          {/* Navigation Desktop */}
          <nav className={`hidden md:flex items-center gap-6 ${pret ? "" : "invisible"}`}>
            {liens.map((lien) =>
              lien.cta ? (
                <Link
                  key={lien.href}
                  href={lien.href}
                  className={
                    estArtisan
                      ? "bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-xl font-semibold text-sm transition"
                      : "bg-orange-50 text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-xl font-semibold text-sm transition"
                  }
                >
                  {lien.label}
                </Link>
              ) : (
                <Link
                  key={lien.href}
                  href={lien.href}
                  className="text-gray-700 hover:text-orange-600 font-medium transition"
                >
                  {lien.label}
                </Link>
              )
            )}
          </nav>

          {/* Boutons de connexion / compte */}
          <AuthButtons />
        </div>

        {/* Navigation Mobile */}
        <nav
          className={`flex md:hidden items-center justify-around border-t border-gray-100 py-2 text-xs font-medium text-gray-700 ${
            pret ? "" : "invisible"
          }`}
        >
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className={
                lien.cta
                  ? "text-orange-600 font-semibold py-1"
                  : "hover:text-orange-600 py-1"
              }
            >
              {lien.mobile}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}