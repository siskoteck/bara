"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [infoReset, setInfoReset] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");
    setInfoReset("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErreur("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/mon-profil");
    router.refresh();
  }

  async function handleMotDePasseOublie() {
    setErreur("");
    setInfoReset("");

    if (!email.trim()) {
      setErreur("Saisissez d'abord votre adresse e-mail ci-dessus.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/mon-profil`,
    });

    if (error) {
      setErreur(error.message);
    } else {
      setInfoReset(
        "Un lien de réinitialisation vient d'être envoyé à votre adresse e-mail."
      );
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Connexion BARA</h1>
          <p className="text-sm text-gray-600 mt-1">
            Accédez à votre espace client ou artisan à Abidjan.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Mot de passe</label>
              <button
                type="button"
                onClick={handleMotDePasseOublie}
                className="text-xs font-semibold text-orange-600 hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          {erreur && (
            <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg">
              {erreur}
            </div>
          )}

          {infoReset && (
            <div className="text-green-700 text-xs bg-green-50 p-3 rounded-lg font-medium">
              ✅ {infoReset}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="text-orange-600 font-semibold hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
