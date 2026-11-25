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
      ? "bg-[#064E3B] text-white font-extrabold px-3.5 py-2 rounded-xl shadow-xs transition"
      : "text-[#1E293B] hover:text-[#064E3B] hover:bg-emerald-50 font-semibold px-3.5 py-2 rounded-xl transition";
  }

  function styleLienMobile(href: string) {
    return estActif(href)
      ? "bg-[#064E3B] text-white font-extrabold px-2.5 py-1.5 rounded-lg shadow-xs transition"
      : "text-[#1E293B] hover:text-[#064E3B] font-semibold px-2.5 py-1.5 rounded-lg transition";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#064E3B] text-white font-black text-base shadow-xs group-hover:bg-emerald-800 transition">
            B
          </span>
          <span className="text-2xl font-black tracking-tight text-[#064E3B]">
            BARA
          </span>
          <span className="text-xs font-extrabold bg-amber-100 text-orange-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Abidjan
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 text-sm">
          <Link href="/" className={styleLienDesktop("/")}>
            Accueil
          </Link>
          <Link href="/artisans" className={styleLienDesktop("/artisans")}>
            Trouver un artisan
          </Link>
          <Link
            href="/sos-urgence"
            className={`px-3.5 py-2 rounded-xl font-extrabold transition flex items-center gap-1 ${
              estActif("/sos-urgence")
                ? "bg-orange-600 text-white shadow-xs ring-2 ring-amber-300"
                : "bg-amber-50 text-orange-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <span>🚨</span> SOS Urgence
          </Link>
          <Link href="/tarifs" className={styleLienDesktop("/tarifs")}>
            Guide des tarifs
          </Link>
          <Link href="/demande" className={styleLienDesktop("/demande")}>
            Poster une demande
          </Link>
        </nav>

        <AuthButtons />
      </div>

      {/* Barre mobile avec Vert foncé BARA + Orange/Ambre chaud */}
      <nav className="flex md:hidden items-center justify-around border-t border-stone-200/80 py-2 text-[11px]">
        <Link href="/" className={styleLienMobile("/")}>
          🏠 Accueil
        </Link>
        <Link href="/artisans" className={styleLienMobile("/artisans")}>
          🛠️ Artisans
        </Link>
        <Link
          href="/sos-urgence"
          className={`px-2.5 py-1.5 rounded-lg font-extrabold transition ${
            estActif("/sos-urgence")
              ? "bg-orange-600 text-white shadow-xs"
              : "bg-amber-50 text-orange-700 border border-amber-200"
          }`}
        >
          🚨 SOS
        </Link>
        <Link href="/tarifs" className={styleLienMobile("/tarifs")}>
          💰 Tarifs
        </Link>
        <Link href="/demande" className={styleLienMobile("/demande")}>
          📋 Demande
        </Link>
      </nav>
    </div>
  );
}

export function Header() {
  return (
    <header className="bg-[#FAFAF9]/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <Suspense fallback={<div className="h-16" />}>
        <HeaderContenu />
      </Suspense>
    </header>
  );
}
