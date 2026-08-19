import { useEffect, useState } from "react";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

function computeParts(targetIso: string): CountdownParts {
  const totalMs = new Date(targetIso).getTime() - Date.now();
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs };
  }
  const days = Math.floor(totalMs / 86_400_000);
  const hours = Math.floor((totalMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1_000);
  return { days, hours, minutes, seconds, totalMs };
}

/** Live countdown to an ISO event datetime, refreshed every second. */
export function useHeroCountdown(targetIso: string) {
  const [parts, setParts] = useState<CountdownParts>(() =>
    computeParts(targetIso),
  );

  useEffect(() => {
    const tick = () => setParts(computeParts(targetIso));
    tick();
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return {
    ...parts,
    arrived: parts.totalMs <= 0,
  };
}
