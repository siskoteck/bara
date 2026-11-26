export function BadgeVerifie({
  taille = "md",
}: {
  taille?: "sm" | "md";
}) {
  return (
    <span
      title="Photo CNI + numéro WhatsApp confirmés par BARA"
      className={`inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold rounded-full shadow-xs cursor-help ${
        taille === "sm" ? "text-[10px] px-2.5 py-0.5" : "text-xs px-3 py-1"
      }`}
    >
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white text-emerald-600 text-[10px] font-black leading-none">
        ✓
      </span>
      <span>Identité vérifiée</span>
    </span>
  );
}