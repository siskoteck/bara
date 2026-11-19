"use client";

export function BoutonWhatsAppSupport() {
  return (
    <a
      href="https://wa.me/qr/KBH36JDX5MLEM1?s=r"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter le support BARA sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
    >
      <span className="text-xl leading-none">💬</span>
      <span className="text-xs sm:text-sm pr-1">
        Support WhatsApp
      </span>
    </a>
  );
}
