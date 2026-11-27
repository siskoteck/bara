export function validerNumeroTelephoneCI(tel: string): {
  valide: boolean;
  message?: string;
} {
  const chiffres = (tel || "").replace(/\D/g, "");
  if (!chiffres) {
    return { valide: false, message: "Veuillez saisir un numéro de téléphone." };
  }
  const sansIndicatif = chiffres.startsWith("225") ? chiffres.slice(3) : chiffres;
  if (sansIndicatif.length !== 10 && sansIndicatif.length !== 8) {
    return {
      valide: false,
      message: "Numéro invalide : entrez les 10 chiffres (ex: 07 07 00 00 00).",
    };
  }
  return { valide: true };
}

export function validerFichierMedia(
  fichier: File,
  options: { typeAttendu: "image" | "audio"; maxMo?: number }
): { valide: boolean; message?: string } {
  const maxMo = options.maxMo ?? (options.typeAttendu === "image" ? 8 : 5);
  const tailleMo = fichier.size / (1024 * 1024);

  if (options.typeAttendu === "image" && !fichier.type.startsWith("image/")) {
    return { valide: false, message: "Format non pris en charge (JPG, PNG ou WebP uniquement)." };
  }
  if (options.typeAttendu === "audio" && !fichier.type.startsWith("audio/")) {
    return { valide: false, message: "Fichier vocal invalide." };
  }
  if (tailleMo > maxMo) {
    return {
      valide: false,
      message: `Le fichier est trop volumineux (${tailleMo.toFixed(1)} Mo). Maximum autorisé : ${maxMo} Mo.`,
    };
  }
  return { valide: true };
}

export async function compresserImageNavigateur(
  fichier: File,
  largeurMax = 1280,
  qualite = 0.8
): Promise<File> {
  if (typeof window === "undefined" || !fichier.type.startsWith("image/")) {
    return fichier;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(fichier);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > largeurMax) {
        height = Math.round((height * largeurMax) / width);
        width = largeurMax;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(fichier);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= fichier.size) {
            resolve(fichier);
            return;
          }
          const nomSansExt = fichier.name.replace(/\.[^.]+$/, "");
          resolve(new File([blob], `${nomSansExt}.webp`, { type: "image/webp" }));
        },
        "image/webp",
        qualite
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(fichier);
    };

    img.src = url;
  });
}