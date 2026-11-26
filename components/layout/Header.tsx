"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import AuthButtons from "./AuthButtons";

function HeaderContenu() {
  const pathname = usePathname() || "/";

  function estActif(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function styleLienDesktop(href: string) {
    return estActif(href)
      ? "bg-orange-50 text-orange-700 font-extrabold px-3.5 py-2 rounded-xl border border-orange-200/80 transition"
      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50 font-semibold px-3.5 py-2 rounded-xl transition";
  }

  function styleOngletMobile(href: string) {
    return estActif(href)
      ? "flex flex-col items-center justify-center gap-0.5 text-orange-600 font-extrabold"
      : "flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-orange-600 font-medium";
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo texte BARA Abidjan */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-black tracking-tight text-orange-600">
              BARA
            </span>
            <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
              Abidjan
            </span>
          </Link>

          {/* Navigation centrale PC */}
          <nav
            aria-label="Navigation principale"
            className="hidden md:flex items-center gap-1 text-sm"
          >
            <Link href="/" className={styleLienDesktop("/")}>
              Accueil
            </Link>
            <Link href="/artisans" className={styleLienDesktop("/artisans")}>
              Artisans
            </Link>
            <Link
              href="/demandes-clients"
              className={styleLienDesktop("/demandes-clients")}
            >
              Chantiers &amp; Demandes
            </Link>
            <Link href="/tarifs" className={styleLienDesktop("/tarifs")}>
              Guide tarifs
            </Link>
          </nav>

          {/* Actions droites PC & Compte */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/sos-urgence"
              className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                estActif("/sos-urgence")
                  ? "bg-red-600 text-white shadow-xs ring-2 ring-red-300"
                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              }`}
            >
              <span>🚨</span>
              <span>SOS Urgence</span>
            </Link>

            <Link
              href="/demande"
              className={`hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition shadow-xs ${
                estActif("/demande")
                  ? "bg-orange-700 text-white ring-2 ring-orange-300"
                  : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
            >
              <span>📋</span>
              <span>Demander un devis</span>
            </Link>

            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Barre de navigation inférieure fixe sur Mobile */}
      <nav
        aria-label="Navigation mobile BARA"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="grid grid-cols-5 items-center text-[11px]">
          <Link href="/" className={styleOngletMobile("/")}>
            <span className="text-lg leading-none">🏠</span>
            <span>Accueil</span>
          </Link>

          <Link href="/artisans" className={styleOngletMobile("/artisans")}>
            <span className="text-lg leading-none">🛠️</span>
            <span>Artisans</span>
          </Link>

          <Link
            href="/sos-urgence"
            className="flex flex-col items-center justify-center -mt-5"
          >
            <span
              className={`w-12 h-12 rounded-2xl text-white shadow-lg flex items-center justify-center text-xl font-black border-4 border-white active:scale-95 transition ${
                estActif("/sos-urgence")
                  ? "bg-red-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              🚨
            </span>
            <span className="text-[10px] font-extrabold text-red-600 mt-0.5">
              SOS
            </span>
          </Link>

          <Link href="/tarifs" className={styleOngletMobile("/tarifs")}>
            <span className="text-lg leading-none">💰</span>
            <span>Tarifs</span>
          </Link>

          <Link href="/demande" className={styleOngletMobile("/demande")}>
            <span className="text-lg leading-none">📋</span>
            <span>Demande</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

export function Header() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
      <HeaderContenu />
    </Suspense>
  );
}