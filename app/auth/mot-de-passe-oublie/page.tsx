"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Phone, MessageCircle, ShieldCheck, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { validerNumeroTelephoneCI } from "@/lib/validation";
import Captcha, { CAPTCHA_ACTIF } from "@/components/Captcha";

function formaterTelephoneInternationalCI(tel: string): string {
  const chiffres = (tel || "").replace(/\D/g, "");
  if (chiffres.startsWith("225")) return `+${chiffres}`;
  if (chiffres.length === 10 && chiffres.startsWith("0")) return `+225${chiffres}`;
  if (chiffres.length === 8) return `+22507${chiffres}`;
  return `+225${chiffres}`;
}

export default function MotDePasseOubliePage() {
  const router = useRouter();
  const [telephone, setTelephone] = useState("");
  const [codeOtp, setCodeOtp] = useState("");
  const [etape, setEtape] = useState<"saisie" | "verification">("saisie");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoSms, setInfoSms] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  async function handleEnvoyerCodeSms(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfoSms("");

    const check = validerNumeroTelephoneCI(telephone);
    if (!check.valide) {
      setError(check.message || "Numéro de téléphone invalide.");
      return;
    }

    if (CAPTCHA_ACTIF && !captchaToken) {
      setError("Veuillez valider la vérification anti-spam.");
      return;
    }

    setLoading(true);
    try {
      const phoneIntl = formaterTelephoneInternationalCI(telephone);
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: phoneIntl,
        options: {
          shouldCreateUser: false,
          captchaToken: captchaToken ?? undefined,
        },
      });

      if (otpError) {
        throw otpError;
      }

      setInfoSms(`Un code de vérification à 6 chiffres a été envoyé par SMS au ${phoneIntl}.`);
      setEtape("verification");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("phone") || msg.toLowerCase().includes("provider")) {
        setError(
          "L'envoi automatique par SMS n'est pas encore activé sur ce compte. Utilisez la confirmation directe via WhatsApp ci-dessous."
        );
      } else {
        setError(
          msg || "Impossible d'envoyer le code SMS. Vérifiez votre numéro ou passez par WhatsApp."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifierCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const codePropre = codeOtp.replace(/\D/g, "");
    if (codePropre.length < 6) {
      setError("Veuillez saisir le code de confirmation à 6 chiffres reçu.");
      return;
    }

    setLoading(true);
    try {
      const phoneIntl = formaterTelephoneInternationalCI(telephone);
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneIntl,
        token: codePropre,
        type: "sms",
      });

      if (verifyError) throw verifyError;

      router.push("/auth/reinitialiser");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setError(msg || "Code invalide ou expiré. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            Récupération du compte
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Recevez un code de vérification par SMS ou confirmez votre numéro sur WhatsApp.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm p-3.5 rounded-xl">
            {error}
          </div>
        )}

        {infoSms && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm p-3.5 rounded-xl">
            {infoSms}
          </div>
        )}

        {etape === "saisie" ? (
          <form onSubmit={handleEnvoyerCodeSms} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-gray-800 mb-1.5">
                Votre numéro de téléphone (10 chiffres) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="Ex: 07 07 00 00 00"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {CAPTCHA_ACTIF && (
              <div>
                <Captcha onVerify={setCaptchaToken} />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-extrabold py-3.5 rounded-xl text-sm transition"
            >
              {loading ? "Envoi du code SMS..." : "Recevoir un code par SMS"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifierCode} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-gray-800 mb-1.5">
                Code de confirmation reçu (6 chiffres) *
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={codeOtp}
                  onChange={(e) => setCodeOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-base font-black tracking-widest focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-extrabold py-3.5 rounded-xl text-sm transition"
            >
              {loading ? "Vérification..." : "Confirmer le numéro et continuer"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEtape("saisie");
                setCodeOtp("");
              }}
              className="w-full text-xs font-bold text-gray-600 hover:underline"
            >
              ← Modifier le numéro de téléphone
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <p className="text-xs text-gray-600 text-center">
            Vous préférez confirmer votre numéro directement sur WhatsApp ?
          </p>
          <a
            href="https://wa.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirmer mon numéro via WhatsApp BARA</span>
          </a>
        </div>

        <p className="text-center text-xs text-gray-600">
          <Link href="/auth/login" className="text-orange-700 font-bold hover:underline">
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}