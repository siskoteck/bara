"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthButtons() {
  const router = useRouter();
  const [nom, setNom] = useState<string | null>(null);
  const [connecte, setConnecte] = useState(false);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      setConnecte(!!user);
      setNom(user?.user_metadata?.nom ?? null);
      setPret(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setConnecte(!!user);
      setNom(user?.user_metadata?.nom ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function deconnexion() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!pret) return null;

  if (connecte) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">{nom ?? "Mon compte"}</span>
        <button
          onClick={deconnexion}
          className="text-sm text-orange-600 hover:underline"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/auth/login" className="text-sm hover:underline">
        Connexion
      </Link>
      <Link
        href="/auth/register"
        className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
      >
        S'inscrire
      </Link>
    </div>
  );
}