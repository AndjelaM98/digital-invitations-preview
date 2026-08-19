import { createContext, useContext } from "react";

/** False while the envelope opener covers the invitation. */
export const PearlRevealContext = createContext(true);

export function usePearlReveal() {
  return useContext(PearlRevealContext);
}
