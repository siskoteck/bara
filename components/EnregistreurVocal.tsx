"use client";

import { useState, useRef, useEffect } from "react";

interface EnregistreurVocalProps {
  onAudioChange: (fichierAudio: File | null) => void;
}

export function EnregistreurVocal({ onAudioChange }: EnregistreurVocalProps) {
  const [enEnregistrement, setEnEnregistrement] = useState(false);
  const [secondes, setSecondes] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [erreurMicro, setErreurMicro] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function demarrerEnregistrement() {
    setErreurMicro("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const extension = mimeType.includes("mp4") ? "m4a" : "webm";
        const fichier = new File([blob], `vocal-${Date.now()}.${extension}`, {
          type: mimeType,
        });

        const urlLocale = URL.createObjectURL(blob);
        setAudioUrl(urlLocale);
        onAudioChange(fichier);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setEnEnregistrement(true);
      setSecondes(0);

      timerRef.current = setInterval(() => {
        setSecondes((prev) => {
          if (prev >= 44) {
            arreterEnregistrement();
            return 45;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Erreur accès micro:", err);
      setErreurMicro(
        "Impossible d'accéder au micro. Vérifiez les autorisations de votre navigateur."
      );
    }
  }

  function arreterEnregistrement() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setEnEnregistrement(false);
  }

  function supprimerAudio() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSecondes(0);
    onAudioChange(null);
  }

  return (
    <div className="p-4 rounded-xl border border-dashed border-orange-300 bg-orange-50/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            🎙️ Note vocale explicative{" "}
            <span className="text-gray-500 font-normal">(facultatif, max 45s)</span>
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Expliquez votre panne à voix haute comme sur WhatsApp.
          </p>
        </div>

        {!enEnregistrement && !audioUrl && (
          <button
            type="button"
            onClick={demarrerEnregistrement}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5"
          >
            <span>🎤</span> Enregistrer un vocal
          </button>
        )}

        {enEnregistrement && (
          <button
            type="button"
            onClick={arreterEnregistrement}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2 animate-pulse"
          >
            <span>⏹️</span> Arrêter ({secondes}s / 45s)
          </button>
        )}
      </div>

      {erreurMicro && (
        <p className="text-red-600 text-xs mt-2">{erreurMicro}</p>
      )}

      {audioUrl && !enEnregistrement && (
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
          <audio controls src={audioUrl} className="w-full h-9" />
          <button
            type="button"
            onClick={supprimerAudio}
            className="text-xs font-semibold text-red-600 hover:underline shrink-0 px-2"
          >
            🗑️ Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
