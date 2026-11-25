import https from "node:https";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const GEMINI_HOST = Buffer.from(
  "Z2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29t",
  "base64"
).toString("utf8");

function appelerGeminiRapide(
  apiKey: string,
  payload: string
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: GEMINI_HOST,
        port: 443,
        path: "/v1beta/models/gemini-3.8-flash:generateContent",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "x-goog-api-key": apiKey,
        },
        timeout: 8500,
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
      req.destroy(new Error("Délai dépassé (8.5s)"));
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
      ? "Tu es l'assistant IA de DJASSA Abidjan. Réponds en français clair et très concis (3 à 5 lignes max) : estimation FCFA, conseil achat ou aide rédaction."
      : "Tu es l'assistant IA de BARA Abidjan. Réponds en français clair et très concis (3 à 5 lignes max) : cause probable de la panne, tarif indicatif à Abidjan en FCFA et métier artisan à contacter.";

    const payload = JSON.stringify({
      systemInstruction: {
        parts: [{ text: systeme }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: message.slice(0, 800) }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 350,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const { status, body: texteBrut } = await appelerGeminiRapide(
      apiKey,
      payload
    );

    let data: {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      error?: { message?: string };
    } = {};

    try {
      data = JSON.parse(texteBrut);
    } catch {
      return NextResponse.json(
        { error: "Réponse invalide de Google (" + status + ")" },
        { status: 500 }
      );
    }

    if (status >= 200 && status < 300) {
      const reponseTexte =
        data.candidates?.at(0)?.content?.parts?.at(0)?.text ||
        "Désolé, aucune réponse générée.";
      return NextResponse.json({ reponse: reponseTexte });
    }

    return NextResponse.json(
      { error: data.error?.message || "Erreur Google HTTP " + status },
      { status: 500 }
    );
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Erreur serveur IA : " + detail },
      { status: 500 }
    );
  }
}
