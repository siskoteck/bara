"use client";

import { useState } from "react";

interface MessageChat {
  role: "user" | "ia";
  texte: string;
}

export function AssistantIABara() {
  const [ouvert, setOuvert] = useState(false);
  const [cache, setCache] = useState(false);
  const [saisie, setSaisie] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [messages, setMessages] = useState<MessageChat[]>([
    {
      role: "ia",
      texte:
        "Bonjour ! Je suis l'assistant IA BARA Abidjan. Décrivez votre panne ou besoin de travaux pour connaître le bon artisan et une estimation en FCFA.",
    },
  ]);

  async function envoyerQuestion(e: React.FormEvent) {
    e.preventDefault();
    const question = saisie.trim();
    if (!question || envoiEnCours) return;

    setMessages((prev) => [...prev, { role: "user", texte: question }]);
    setSaisie("");
    setEnvoiEnCours(true);

    try {
      const res = await fetch("/api/ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();
      const reponse = res.ok
        ? data.reponse
        : data.error || "Une erreur est survenue.";

      setMessages((prev) => [...prev, { role: "ia", texte: reponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ia", texte: "Impossible de joindre l'assistant IA." },
      ]);
    } finally {
      setEnvoiEnCours(false);
    }
  }
  if (cache) {
    return (
      <div className="fixed bottom-20 left-3 sm:bottom-6 sm:left-4 z-40">
        <button
          type="button"
          onClick={() => setCache(false)}
          title="Afficher l'Assistant IA BARA"
          aria-label="Afficher l'Assistant IA BARA"
          className="w-8 h-8 rounded-full bg-orange-600/60 hover:bg-orange-600/90 backdrop-blur-md border border-white/30 text-white text-xs flex items-center justify-center shadow-md transition"
        >
          ✨
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40">
      {ouvert ? (
        <div className="w-[330px] sm:w-[370px] bg-white/85 backdrop-blur-md rounded-3xl border border-orange-200/80 shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-orange-600/90 backdrop-blur-md text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <div>
                <p className="text-xs font-extrabold">Assistant IA BARA</p>
                <p className="text-[10px] text-orange-100">
                  Diagnostic panne &amp; estimation FCFA
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOuvert(false)}
                title="Réduire la fenêtre"
                className="text-white/85 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-white/10"
              >
                —
              </button>
              <button
                type="button"
                onClick={() => {
                  setOuvert(false);
                  setCache(true);
                }}
                title="Cacher l'Assistant IA"
                className="text-white/85 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-gray-50/60 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-orange-600/90 text-white ml-8 shadow-sm"
                    : "bg-white/90 border border-gray-200/80 text-gray-800 mr-6 shadow-sm"
                }`}
              >
                {m.texte}
              </div>
            ))}
            {envoiEnCours && (
              <div className="bg-white/90 border border-gray-200/80 text-gray-500 p-3 rounded-2xl mr-12 animate-pulse">
                Analyse en cours...
              </div>
            )}
          </div>

          <form
            onSubmit={envoyerQuestion}
            className="p-2.5 bg-white/80 backdrop-blur-md border-t border-gray-200/70 flex gap-2"
          >
            <input
              type="text"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder="Ex: Ma clim coule de l'eau..."
              className="flex-1 bg-white/90 border border-gray-300/80 focus:border-orange-600 focus:outline-none rounded-xl px-3 py-2 text-xs"
            />
            <button
              type="submit"
              disabled={envoiEnCours || !saisie.trim()}
              className="bg-orange-600/90 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition disabled:opacity-50"
            >
              Envoyer
            </button>
          </form>
        </div>
      ) : (
        <div className="inline-flex items-center bg-orange-600/75 hover:bg-orange-600/90 backdrop-blur-md border border-white/30 text-white rounded-full shadow-lg transition overflow-hidden">
          <button
            type="button"
            onClick={() => setOuvert(true)}
            className="font-extrabold text-xs sm:text-sm pl-4 pr-2.5 py-3 flex items-center gap-2"
          >
            <span>✨</span> Assistant IA
          </button>
          <button
            type="button"
            onClick={() => setCache(true)}
            title="Cacher la bulle Assistant IA"
            aria-label="Cacher la bulle Assistant IA"
            className="pr-3 pl-1.5 py-3 text-white/80 hover:text-white text-xs font-bold border-l border-white/20"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
