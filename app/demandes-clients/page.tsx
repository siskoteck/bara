import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  DemandesClientsList,
  type DemandeClientItem,
} from "@/components/demandes/DemandesClientsList";

async function chargerDemandesServeur(): Promise<DemandeClientItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const { data } = await supabase.rpc("demandes_pour_artisans");
  return (data as DemandeClientItem[]) || [];
}

export default async function DemandesClientsPage() {
  const demandesInitiales = await chargerDemandesServeur();
  return <DemandesClientsList demandesInitiales={demandesInitiales} />;
}