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
      ? "bg-orange-600 text-white font-extrabold px-3.5 py-2 rounded-xl shadow-sm transition"
      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-semibold px-3.5 py-2 rounded-xl transition";
  }

  function styleLienMobile(href: string) {
    return estActif(href)
      ? "bg-orange-600 text-white font-extrabold px-2 py-1.5 rounded-lg shadow-sm transition"
      : "text-gray-700 hover:text-orange-600 font-semibold px-2 py-1.5 rounded-lg transition";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-black tracking-tight text-orange-600">
            BARA
          </span>
          <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
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
                ? "bg-red-600 text-white shadow-sm ring-2 ring-red-300"
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
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

      {/* Barre mobile avec surbrillance orange + SOS Urgence */}
      <nav className="flex md:hidden items-center justify-around border-t border-gray-100 py-2 text-[11px]">
        <Link href="/" className={styleLienMobile("/")}>
          🏠 Accueil
        </Link>
        <Link href="/artisans" className={styleLienMobile("/artisans")}>
          🛠️ Artisans
        </Link>
        <Link
          href="/sos-urgence"
          className={`px-2 py-1.5 rounded-lg font-extrabold transition ${
            estActif("/sos-urgence")
              ? "bg-red-600 text-white shadow-sm"
              : "bg-red-50 text-red-700"
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <Suspense fallback={<div className="h-16" />}>
        <HeaderContenu />
      </Suspense>
    </header>
  );
}
