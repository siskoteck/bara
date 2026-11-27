export {
  METIERS,
  COMMUNES,
  QUARTIERS_PAR_COMMUNE,
} from "./constantes";

export type MetierBara = (typeof import("./constantes").METIERS)[number];
export type CommuneAbidjan = (typeof import("./constantes").COMMUNES)[number];