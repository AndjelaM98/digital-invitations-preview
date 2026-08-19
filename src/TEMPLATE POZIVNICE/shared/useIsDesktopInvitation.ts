import { useEffect, useState } from "react";

import { invitationBreakpoints } from "./viewport";

/**
 * true when viewport is at least `md` (tablet+).
 * Base UI is always authored for mobile; use this only to enhance.
 */
export function useIsDesktopInvitation(minWidth = invitationBreakpoints.md) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [minWidth]);

  return matches;
}
