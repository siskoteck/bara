"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { METIERS, COMMUNES, QUARTIERS_PAR_COMMUNE } from "@/lib/constantes";

function FormulaireInscription() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [typeCompte, setTypeCompte] = useState<"client" | "artisan">(
    searchParams.get("parrain") ? "artisan" : "client"
  );
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [metier, setMetier] = useState<string>(METIERS[0] || "Plombier");
  const [commune, setCommune] = useState("Cocody");
  const [quartier, setQuartier] = useState("");
  const [codeParrain, setCodeParrain] = useState(
    (searchParams.get("parrain") || "").toUpperCase()
  );

  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const suggestionsQuartiers = commune
    ? QUARTIERS_PAR_COMMUNE[commune] || []
    : [];

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    const formData = new FormData(e.currentTarget);
    if (formData.get("site_web")) {
      router.push("/");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nom: nom.trim(),
            type_compte: typeCompte,
          },
        },
      });

      if (signUpError) throw signUpError;

      const user = authData.user;
      if (user && typeCompte === "artisan") {
        const { error: ficheError } = await supabase.from("artisans").insert([
          {
            user_id: user.id,
            name: nom.trim(),
            metier,
            commune,
            quartier: quartier.trim() || null,
            telephone: telephone.trim(),
            disponible: true,
            parrain_code: codeParrain.trim().toUpperCase() || null,
          },
        ]);

        if (ficheError) {
          console.error("Erreur création fiche artisan:", ficheError);
        }
      }

      if (typeCompte === "artisan") {
        router.push("/mon-profil");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: any) {
      setErreur(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un compte BARA
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Rejoignez la plateforme des artisans de confiance à Abidjan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setTypeCompte("client")}
            className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              typeCompte === "client"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            👤 Je cherche un artisan
          </button>
          <button
            type="button"
            onClick={() => setTypeCompte("artisan")}
            className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              typeCompte === "artisan"
                ? "bg-orange-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🛠️ Je suis artisan
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="site_web"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Kouadio Yao"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Adresse e-mail *
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
            <label className="block text-sm font-medium mb-1">
              Mot de passe *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
          </div>
          {typeCompte === "artisan" && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Métier principal *
                </label>
                <select
                  value={metier}
                  onChange={(e) => setMetier(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
                >
                  {METIERS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Commune *
                  </label>
                  <select
                    value={commune}
                    onChange={(e) => {
                      setCommune(e.target.value);
                      setQuartier("");
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white"
                  >
                    {COMMUNES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sous-quartier
                  </label>
                  <input
                    type="text"
                    list="liste-quartiers-register"
                    value={quartier}
                    onChange={(e) => setQuartier(e.target.value)}
                    placeholder="Ex: Angré, Zone 4..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                  />
                  <datalist id="liste-quartiers-register">
                    {suggestionsQuartiers.map((q) => (
                      <option key={q} value={q} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Numéro WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="07 00 00 00 00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Code parrain{" "}
                  <span className="text-gray-400 font-normal">(facultatif)</span>
                </label>
                <input
                  type="text"
                  value={codeParrain}
                  onChange={(e) =>
                    setCodeParrain(e.target.value.toUpperCase())
                  }
                  placeholder="Ex: BARA-8F3A1C"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 uppercase"
                />
              </div>
            </div>
          )}

          {erreur && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {erreur}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà inscrit ?{" "}
          <Link
            href="/auth/login"
            className="text-orange-600 font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-500">
          Chargement du formulaire...
        </div>
      }
    >
      <FormulaireInscription />
    </Suspense>
  );
}
