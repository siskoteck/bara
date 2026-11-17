import { NextResponse } from "next/server";

const historiqueIP = new Map<string, number[]>();

export async function POST(request: Request) {
  try {
    // 1. Vérifier l'origine de la demande (autorise votre domaine Vercel et futur domaine bara.ci)
    const origin = request.headers.get("origin") || "";
    const referer = request.headers.get("referer") || "";
    const source = origin || referer;

    const origineValide =
      source.startsWith("http://localhost:3000") ||
      source.startsWith("https://bara.ci") ||
      source.startsWith("https://bara.ci") ||
      (source.startsWith("https://bara") && source.includes(".vercel.app"));

    if (!origineValide) {
      return NextResponse.json(
        { error: "Origine non autorisée." },
        { status: 403 }
      );
    }

    // 2. Limite anti-spam (max 3 e-mails / minute par IP)
    const ip = request.headers.get("x-forwarded-for") || "inconnue";
    const maintenant = Date.now();
    const envoisRecents = (historiqueIP.get(ip) || []).filter(
      (t) => maintenant - t < 60 * 1000
    );

    if (envoisRecents.length >= 3) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez dans une minute." },
        { status: 429 }
      );
    }
    historiqueIP.set(ip, [...envoisRecents, maintenant]);

    // 3. Lire et valider le contenu
    const body = await request.json();
    const sujet = typeof body.sujet === "string" ? body.sujet.trim() : "";
    const contenu = typeof body.contenu === "string" ? body.contenu.trim() : "";

    if (!sujet || !contenu || sujet.length > 150 || contenu.length > 2500) {
      return NextResponse.json(
        { error: "Contenu invalide." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY manquante dans les variables d'environnement.");
      return NextResponse.json(
        { error: "Configuration e-mail manquante." },
        { status: 500 }
      );
    }

    // 4. Envoyer l'e-mail via Resend
    const response = await fetch("https://resend.com", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BARA Abidjan <onboarding@resend.dev>",
        to: ["cv2tcv2t@gmail.com"],
        subject: sujet,
        text: contenu,
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("Erreur Resend:", errData);
      return NextResponse.json(
        { error: "Échec de l'envoi Resend." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API notifier:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
