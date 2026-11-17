import { NextResponse } from "next/server";

// Mémoire simple pour limiter les abus par IP (max 3 envois par minute)
const historiqueIP = new Map<string, number[]>();

export async function POST(request: Request) {
  try {
    // 1. Vérifier que la requête provient bien de votre site BARA
    const origin = request.headers.get("origin") || "";
    const referer = request.headers.get("referer") || "";
    const domainesAutorises = [
      "https://vercel.app",
      "https://bara.ci",
      "http://localhost:3000",
    ];

    const origineValide = domainesAutorises.some(
      (domaine) => origin.startsWith(domaine) || referer.startsWith(domaine)
    );

    if (!origineValide) {
      return NextResponse.json(
        { error: "Origine non autorisée." },
        { status: 403 }
      );
    }

    // 2. Limiter la fréquence par adresse IP (anti-spam)
    const ip = request.headers.get("x-forwarded-for") || "inconnue";
    const maintenant = Date.now();
    const fenetreMs = 60 * 1000; // 1 minute
    const envoisRecents = (historiqueIP.get(ip) || []).filter(
      (t) => maintenant - t < fenetreMs
    );

    if (envoisRecents.length >= 3) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez dans une minute." },
        { status: 429 }
      );
    }
    historiqueIP.set(ip, [...envoisRecents, maintenant]);

    // 3. Valider le contenu du message
    const body = await request.json();
    const sujet = typeof body.sujet === "string" ? body.sujet.trim() : "";
    const contenu = typeof body.contenu === "string" ? body.contenu.trim() : "";

    if (!sujet || !contenu || sujet.length > 150 || contenu.length > 2500) {
      return NextResponse.json(
        { error: "Contenu invalide ou trop long." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé Resend non configurée." },
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
        { error: "Échec de l'envoi de l'e-mail." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API notifier:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
