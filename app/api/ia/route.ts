import { NextResponse } from "next/server";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API IA non configurée sur le serveur." },
        { status: 500 }
      );
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message invalide." },
        { status: 400 }
      );
    }

    const systeme =
      "Tu es l'assistant IA de BARA Abidjan (annuaire d'artisans vérifiés en Côte d'Ivoire : plombier, électricien, frigoriste, menuisier, serrurier, mécanicien, peintre, maçon). Réponds en français clair, concis et chaleureux. Aide le client à identifier la cause probable de sa panne, donne une estimation indicative des tarifs de main-d'œuvre à Abidjan en FCFA, recommande le métier BARA adapté (ou la page SOS Urgence en cas de danger) et donne les réflexes de sécurité.";

    const response = await fetch(
      `https://googleapis.com{apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systeme }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message.slice(0, 1500) }],
            },
          ],
        }),
      }
    );

    const data: GeminiResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Erreur lors de la réponse IA." },
        { status: 500 }
      );
    }

    const reponseTexte =
      data.candidates?.at(0)?.content?.parts?.at(0)?.text ||
      "Désolé, je n'ai pas pu générer de réponse pour le moment.";

    return NextResponse.json({ reponse: reponseTexte });
  } catch {
    return NextResponse.json(
      { error: "Erreur réseau avec le service IA." },
      { status: 500 }
    );
  }
}
