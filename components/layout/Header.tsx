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
      ? "bg-orange-50 text-orange-700 font-extrabold px-3 py-2 rounded-xl transition"
      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50 font-semibold px-3 py-2 rounded-xl transition whitespace-nowrap";
  }

  function styleOngletMobile(href: string) {
    return estActif(href)
      ? "flex flex-col items-center justify-center gap-0.5 text-orange-600 font-extrabold"
      : "flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-orange-600 font-medium";
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 w-full overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-black tracking-tight text-orange-600">
              BARA
            </span>
            <span className="text-[11px] font-extrabold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
              Abidjan
            </span>
          </Link>

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
              Chantiers
            </Link>
            <Link href="/tarifs" className={styleLienDesktop("/tarifs")}>
              Tarifs
            </Link>
            <Link
              href="/sos-urgence"
              className={`ml-1 inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
                estActif("/sos-urgence")
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/80"
              }`}
            >
              <span>🚨</span>
              <span>SOS</span>
            </Link>
          </nav>

          <AuthButtons />
        </div>
      </header>

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
              className={`animate-bara-sos w-12 h-12 rounded-2xl text-white shadow-lg flex items-center justify-center text-xl font-black border-4 border-white active:scale-95 transition ${
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