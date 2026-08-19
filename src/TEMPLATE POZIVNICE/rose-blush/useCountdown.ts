import { useEffect, useState } from "react";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function getParts(targetIso: string): CountdownParts {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    done: false,
  };
}

export function useCountdown(targetIso: string): CountdownParts {
  const [parts, setParts] = useState(() => getParts(targetIso));

  useEffect(() => {
    setParts(getParts(targetIso));
    const id = window.setInterval(() => setParts(getParts(targetIso)), 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return parts;
}
