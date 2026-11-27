import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = (await request.json()) as { token?: string };
    const secret = process.env.TURNSTILE_SECRET_KEY;

    // Si la clé secrète Turnstile n'est pas configurée sur Vercel, ne pas bloquer l'envoi
    if (!secret) {
      return NextResponse.json({ success: true, mode: "skip" });
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Jeton anti-spam manquant." },
        { status: 400 }
      );
    }

    const res = await fetch(
      "https://cloudflare.com",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      }
    );

    const data = (await res.json()) as { success?: boolean };
    if (!data.success) {
      return NextResponse.json(
        { success: false, error: "Échec de la vérification anti-spam." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erreur lors du contrôle anti-spam." },
      { status: 500 }
    );
  }
}