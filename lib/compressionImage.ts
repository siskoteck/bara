export async function compresserImage(
  fichier: File,
  largeurMax = 1200,
  qualite = 0.8
): Promise<File> {
  if (!fichier.type.startsWith("image/") || fichier.size <= 500 * 1024) {
    return fichier;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const urlObjet = URL.createObjectURL(fichier);

    img.onload = () => {
      URL.revokeObjectURL(urlObjet);

      let largeur = img.width;
      let hauteur = img.height;

      if (largeur > largeurMax) {
        hauteur = Math.round((hauteur * largeurMax) / largeur);
        largeur = largeurMax;
      }

      const canvas = document.createElement("canvas");
      canvas.width = largeur;
      canvas.height = hauteur;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(fichier);
        return;
      }

      ctx.drawImage(img, 0, 0, largeur, hauteur);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(fichier);
            return;
          }
          const nomPropre = fichier.name.replace(/\.[^/.]+$/, "") + ".jpg";
          const fichierCompresse = new File([blob], nomPropre, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(fichierCompresse);
        },
        "image/jpeg",
        qualite
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(urlObjet);
      resolve(fichier);
    };

    img.src = urlObjet;
  });
}
