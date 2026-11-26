"use client";

import { useEffect, useState } from "react";

export function BoutonWhatsAppSupport() {
  const [enBasDePage, setEnBasDePage] = useState(false);

  useEffect(() => {
    function verifierBasDePage() {
      const scrollPos = window.scrollY + window.innerHeight;
      const hauteurTotale = document.documentElement.scrollHeight;
      // Disparait lorsque l'utilisateur arrive dans les 140 derniers pixels (footer)
      setEnBasDePage(hauteurTotale > window.innerHeight + 100 && scrollPos >= hauteurTotale - 140);
    }

    verifierBasDePage();
    window.addEventListener("scroll", verifierBasDePage, { passive: true });
    window.addEventListener("resize", verifierBasDePage, { passive: true });
    return () => {
      window.removeEventListener("scroll", verifierBasDePage);
      window.removeEventListener("resize", verifierBasDePage);
    };
  }, []);

  return (
    <a
      href="https://wa.me/qr/KBH36JDX5MLEM1?s=r"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter le support BARA sur WhatsApp"
      className={`fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group ${
        enBasDePage
          ? "opacity-0 translate-y-4 pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
    >
      <span className="text-xl leading-none">💬</span>
      <span className="text-xs sm:text-sm pr-1">
        Support WhatsApp
      </span>
    </a>
  );
}