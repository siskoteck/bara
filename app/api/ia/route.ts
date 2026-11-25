import https from "node:https";
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

const GEMINI_HOST = Buffer.from(
  "Z2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29t",
  "base64"
).toString("utf8");

function appelerGeminiHttps(
  modele: string,
  apiKey: string,
  payload: string
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: GEMINI_HOST,
        port: 443,
        path: `/v1beta/models/${modele}:generateContent`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "x-goog-api-key": apiKey,
        },
        timeout: 15000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode || 500, body: data });
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("Délai dépassé (timeout 15s) vers Google Gemini."));
    });
    req.on("error", (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

export async function POST(req: Request) {
  try {
    const apiKey = (process.env.GEMINI_API_KEY || "")
      .replace(/["'\s\r\n]/g, "")
      .trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé GEMINI_API_KEY manquante sur Vercel." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json(
        { error: "Message invalide." },
        { status: 400 }
      );
    }

    const host = (req.headers.get("host") || "").toLowerCase();
    const estDjassa = host.includes("djassa");

    const systeme = estDjassa
      ? "Tu es l'assistant IA de DJASSA Abidjan (plateforme de petites annonces et bonnes affaires en Côte d'Ivoire). Réponds en français clair, concis et chaleureux. Aide les acheteurs et vendeurs à Abidjan (estimation de prix en FCFA, rédaction d'annonces attractives, conseils de sécurité contre les arnaques)."
      : "Tu es l'assistant IA de BARA Abidjan (annuaire d'artisans vérifiés en Côte d'Ivoire : plombier, électricien, frigoriste, menuisier, serrurier, mécanicien, peintre, maçon). Réponds en français clair, concis et chaleureux. Aide le client à diagnostiquer sa panne, donne une estimation indicative des tarifs à Abidjan en FCFA, et recommande le métier BARA adapté.";

    const payload = JSON.stringify({
      systemInstruction: {
        parts: [{ text: systeme }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: message.slice(0, 1500) }],
        },
      ],
    });

    const modeles = ["gemini-3.8-flash", "gemini-2.5-flash"];
    let derniereErreur = "Erreur inconnue avec l'API Gemini.";

    for (const modele of modeles) {
      const { status, body: texteBrut } = await appelerGeminiHttps(
        modele,
        apiKey,
        payload
      );

      let data: GeminiResponse = {};
      try {
        data = JSON.parse(texteBrut);
      } catch {
        derniereErreur = "Réponse non-JSON (" + status + ")";
        continue;
      }

      if (status >= 200 && status < 300) {
        const reponseTexte =
          data.candidates?.at(0)?.content?.parts?.at(0)?.text ||
          "Désolé, je n'ai pas pu générer de réponse pour le moment.";
        return NextResponse.json({ reponse: reponseTexte });
      }

      derniereErreur = data.error?.message || "Erreur HTTP " + status;
    }

    return NextResponse.json({ error: derniereErreur }, { status: 500 });
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Erreur connexion Gemini : " + detail },
      { status: 500 }
    );
  }
}
