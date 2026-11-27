import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ROUTES_PROTEGEES = ["/mon-profil", "/demandes-clients", "/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const estProtegee = ROUTES_PROTEGEES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Vérification authentique côté serveur auprès de Supabase Auth (jamais user_metadata)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (estProtegee && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Vérification stricte du rôle administrateur via la table user_roles ou app_metadata
  if (user && (pathname === "/admin" || pathname.startsWith("/admin/"))) {
    const roleAppMeta = user.app_metadata?.role;
    let estAdmin = roleAppMeta === "admin";

    if (!estAdmin) {
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      estAdmin = roleRow?.role === "admin";
    }

    if (!estAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/mon-profil/:path*",
    "/demandes-clients/:path*",
    "/admin/:path*",
  ],
};