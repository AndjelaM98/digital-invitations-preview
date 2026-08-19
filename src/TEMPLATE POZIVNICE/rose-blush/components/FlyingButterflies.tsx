import { useReducedMotion } from "framer-motion";

import { blushArt } from "../art";

const FLIERS = [
  { src: blushArt.butterfly, className: "qb-fly qb-fly--1" },
  { src: blushArt.butterflyAlt, className: "qb-fly qb-fly--2" },
  { src: blushArt.butterfly, className: "qb-fly qb-fly--3" },
  { src: blushArt.butterflyAlt, className: "qb-fly qb-fly--4" },
  { src: blushArt.butterfly, className: "qb-fly qb-fly--5" },
] as const;

function FlyingButterflies() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="qb-flies" aria-hidden="true">
      {FLIERS.map((flier, index) => (
        <span key={index} className={flier.className}>
          <img src={flier.src} alt="" className="qb-fly__wings" draggable={false} />
        </span>
      ))}
    </div>
  );
}

export default FlyingButterflies;
