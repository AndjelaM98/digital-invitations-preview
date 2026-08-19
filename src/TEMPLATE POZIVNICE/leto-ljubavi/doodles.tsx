type SvgProps = {
  className?: string;
};

const ink = "#1a1a1a";
const red = "#9a1b1b";

function Heart({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={red}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ChampagneTower({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 300"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* moon + stars */}
      <path d="M42 48c8-14 24-20 38-16-10 4-16 14-16 26 0 16 12 28 28 28-16 8-36 2-46-14-4-7-5-16-4-24z" />
      <path d="M86 28l1.2 3.2 3.3.2-2.6 2.1.9 3.2-2.8-1.8-2.8 1.8.9-3.2-2.6-2.1 3.3-.2z" fill={ink} stroke="none" />
      <path d="M28 86l.8 2.1 2.2.1-1.7 1.4.6 2.1-1.9-1.2-1.9 1.2.6-2.1-1.7-1.4 2.2-.1z" fill={ink} stroke="none" />
      <path d="M318 36l1 2.6 2.7.1-2.1 1.7.7 2.6-2.3-1.5-2.3 1.5.7-2.6-2.1-1.7 2.7-.1z" fill={ink} stroke="none" />
      <path d="M338 78c2 0 2 .5 3.4 1.8 1.4-1.3 1.4-1.8 3.4-1.8 0 2 .8 2.2-.4 3.8 1.2 1.6.4 1.8.4 3.8-2 0-2 .5-3.4 1.8-1.4-1.3-1.4-1.8-3.4-1.8 0-2-.8-2.2.4-3.8-1.2-1.6-.4-1.8-.4-3.8z" />

      {/* music notes */}
      <path d="M292 58v28" />
      <ellipse cx="284" cy="86" rx="8" ry="5.5" fill={ink} stroke="none" />
      <path d="M318 70v22" />
      <ellipse cx="311" cy="92" rx="7" ry="5" fill={ink} stroke="none" />
      <path d="M292 62h26" />

      {/* red hearts */}
      <path d="M64 118c0-5 4-8 8-8 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 7-14 16-14 16s-14-9-14-16z" fill={red} stroke="none" />
      <path d="M248 42c0-4 3-6.5 6.2-6.5 2.2 0 3.8 1.5 4.6 3.2.8-1.7 2.4-3.2 4.6-3.2 3.2 0 6.2 2.5 6.2 6.5 0 5.5-10.8 12.5-10.8 12.5S248 47.5 248 42z" fill={red} stroke="none" />
      <path d="M300 128c0-3.6 2.6-5.8 5.5-5.8 2 0 3.4 1.3 4.1 2.8.7-1.5 2.1-2.8 4.1-2.8 2.9 0 5.5 2.2 5.5 5.8 0 5-9.6 11.2-9.6 11.2S300 133 300 128z" fill={red} stroke="none" />
      <path d="M40 168c0-3.2 2.3-5.2 4.9-5.2 1.8 0 3 1.2 3.6 2.5.6-1.3 1.8-2.5 3.6-2.5 2.6 0 4.9 2 4.9 5.2 0 4.4-8.5 10-8.5 10S40 172.4 40 168z" fill={red} stroke="none" />

      {/* champagne pyramid — 5 / 4 / 3 / 2 / 1 coupes */}
      {drawRow(78, 248, 5)}
      {drawRow(94, 222, 4)}
      {drawRow(110, 196, 3)}
      {drawRow(126, 170, 2)}
      {drawCoupe(180, 144)}

      {/* couple sitting on top */}
      {/* groom */}
      <circle cx="156" cy="78" r="11" />
      <path d="M156 89c-10 2-16 12-16 24h32c0-12-6-22-16-24z" />
      <path d="M148 113c-6 10-4 22 2 28" />
      <path d="M164 113c4 8 2 18-2 26" />
      <path d="M140 102h-18" />
      <path d="M122 96c-4 8-2 16 6 14 4-1 8-8 6-14" />
      <rect x="118" y="86" width="7" height="16" rx="1.5" />
      <path d="M121.5 86v-8" />
      {/* bride */}
      <circle cx="204" cy="76" r="11" />
      <path d="M204 87c12 4 20 16 18 32H186c0-16 8-28 18-32z" />
      <path d="M194 118c-2 12 2 22 8 28" />
      <path d="M214 118c4 10 2 20-2 28" />
      <path d="M218 98c10-4 22-2 26 8" />
      <path d="M246 96c2-10 10-12 14-8 3 4 0 12-8 12" />
      <path d="M252 88v-10" />
      <path d="M204 65c8-10 18-8 20 0" />
    </svg>
  );
}

function drawCoupe(cx: number, cy: number) {
  const w = 22;
  return (
    <g key={`${cx}-${cy}`}>
      <path d={`M${cx - w} ${cy}c2 10 ${w - 4} 12 ${w} 12s${w - 2}-2 ${w}-12`} />
      <path d={`M${cx - w} ${cy}h${w * 2}`} />
      <path d={`M${cx} ${cy + 12}v10`} />
      <path d={`M${cx - 7} ${cy + 22}h14`} />
    </g>
  );
}

function drawRow(startX: number, y: number, count: number) {
  const gap = 32;
  return Array.from({ length: count }, (_, i) =>
    drawCoupe(startX + 22 + i * gap, y),
  );
}

function Palaces({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 130"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="translate(8,18)">{palace()}</g>
      <g transform="translate(232,18)">{palace()}</g>
      {/* bow */}
      <g transform="translate(180,22)">
        <path d="M0 18c-14-10-22-4-22 4 0 8 10 10 22 4" />
        <path d="M0 18c14-10 22-4 22 4 0 8-10 10-22 4" />
        <ellipse cx="0" cy="18" rx="5" ry="6" />
        <path d="M-4 24c-6 14-2 22 4 18" />
        <path d="M4 24c6 14 2 22-4 18" />
      </g>
    </svg>
  );
}

function palace() {
  return (
    <>
      <path d="M60 8L8 38h104L60 8z" />
      <path d="M60 8v14" />
      <circle cx="60" cy="6" r="3.5" />
      <rect x="16" y="38" width="88" height="70" />
      <path d="M28 108V52" />
      <path d="M44 108V52" />
      <path d="M60 108V52" />
      <path d="M76 108V52" />
      <path d="M92 108V52" />
      <rect x="36" y="70" width="14" height="18" rx="7" />
      <rect x="70" y="70" width="14" height="18" rx="7" />
      <path d="M16 46h88" />
    </>
  );
}

function DiscoLights({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 90"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.45"
      strokeLinecap="round"
    >
      <path d="M8 18c40 28 70 4 110 18 28 10 40 28 52 28 12 0 24-18 52-28 40-14 70 10 110 18" />
      {[18, 48, 78, 108, 232, 262, 292, 322].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${22 + (i % 3) * 6}v10`} />
          <path d={`M${x - 7} ${36 + (i % 3) * 6}h14`} />
          <path d={`M${x - 5} ${36 + (i % 3) * 6}c0 8 3 12 5 12s5-4 5-12`} />
        </g>
      ))}
      <circle cx="170" cy="52" r="16" />
      <path d="M170 36v32M154 52h32" />
      <path d="M159 41l22 22M181 41l-22 22" />
      <path d="M158 22l-6-8M170 16v-10M182 22l6-8" />
      <path d="M148 58l-8 4M192 58l8 4M148 46l-8-4M192 46l8-4" />
    </svg>
  );
}

function Dancers({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 160"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* couple 1 */}
      <circle cx="70" cy="36" r="12" />
      <path d="M70 48c-14 4-22 20-20 44h40c2-24-6-40-20-44z" />
      <path d="M58 92c-4 16 2 34 10 40" />
      <path d="M82 92c6 14 4 30-2 40" />
      <path d="M52 62c-16-8-24 6-18 16" />
      <circle cx="118" cy="40" r="12" />
      <path d="M118 52c12 6 22 22 20 44H98c0-22 8-38 20-44z" />
      <path d="M106 96c-2 16 4 32 12 36" />
      <path d="M128 96c8 14 6 28 0 36" />
      <path d="M96 64c-10 4-8 16 2 18" />
      <path d="M88 70h8v16c-6 2-12-4-8-16z" />
      <path d="M84 48c16 8 28 8 40 2" />

      {/* couple 2 — bride & groom */}
      <circle cx="214" cy="38" r="12" />
      <path d="M214 50c-12 6-20 22-18 46h36c2-24-6-40-18-46z" />
      <path d="M202 96c-2 16 4 32 10 38" />
      <path d="M226 96c6 14 4 30-2 38" />
      <circle cx="268" cy="36" r="12" />
      <path d="M268 48c14 8 24 24 22 48h-44c0-24 8-40 22-48z" />
      <path d="M256 96c-4 18 2 34 10 40" />
      <path d="M280 96c6 16 4 32-2 40" />
      <path d="M268 24c10-12 22-8 24 2" />
      <path d="M230 64c18 4 28 4 42-2" />
      <path d="M198 70c-12 0-16 12-8 18 6 4 14 0 16-8" />
    </svg>
  );
}

function ToastHands({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 200"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* wine glass left */}
      <path d="M70 18c8 22 8 34 0 48h-28c-8-14-8-26 0-48h28z" />
      <path d="M56 66v22" />
      <path d="M44 88h24" />
      <path d="M38 8c-18 18-22 40-8 52" />
      <path d="M22 28c-8 6-10 18-2 28" />
      <path d="M56 42h-20" fill="none" />
      <path d="M42 28c8 10 18 12 28 8" fill={ink} stroke="none" opacity="0.9" />
      <path d="M46 30c6 8 14 10 22 6" />

      {/* cocktail right */}
      <path d="M250 12l28 40H222l28-40z" />
      <path d="M250 52v28" />
      <path d="M238 80h24" />
      <path d="M272 18l18-10" />
      <path d="M290 8c8 4 10 16 2 22" />
      <path d="M304 22c8 8 6 20-4 24" />
      <path d="M236 36h28" fill={ink} />
      <path d="M232 34c10 8 26 8 36 0" />

      <path d="M162 86c0-6 4.5-10 10-10 3.4 0 6 2.2 7.4 5.2C180.8 78.2 183.4 76 186.8 76c5.5 0 10 4 10 10 0 9-17.4 20-17.4 20S162 95 162 86z" fill={red} stroke="none" />

      {/* lower left glass */}
      <path d="M88 118c10 18 10 28 0 40H56c-10-12-10-22 0-40h32z" />
      <path d="M72 158v18" />
      <path d="M60 176h24" />
      <path d="M48 128c-16 10-20 28-8 40" />
      <path d="M32 148c-8 8-8 20 2 26" />
      <path d="M60 140h24" />

      {/* champagne flute lower right */}
      <path d="M268 112c6 28 6 44 0 58h-16c-6-14-6-30 0-58h16z" />
      <path d="M260 170v18" />
      <path d="M248 188h24" />
      <path d="M284 122c16 8 22 24 10 38" />
      <path d="M302 140c10 8 10 22 0 28" />
      <path d="M256 138h16" />
    </svg>
  );
}

function Clink({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 90"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M78 8c8 20 8 32 0 44H52c-8-12-8-24 0-44h26z" />
      <path d="M65 52v18" />
      <path d="M53 70h24" />
      <path d="M42 22c-16 12-18 30-6 40" />
      <path d="M28 40c-8 8-8 20 2 26" />
      <path d="M142 8c-8 20-8 32 0 44h26c8-12 8-24 0-44h-26z" />
      <path d="M155 52v18" />
      <path d="M143 70h24" />
      <path d="M178 22c16 12 18 30 6 40" />
      <path d="M192 40c8 8 8 20-2 26" />
      <path d="M96 18h28" />
    </svg>
  );
}

function BowDivider({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 50"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M8 28c40-18 70-4 110 0" />
      <path d="M162 28c40-4 70-18 110 0" />
      <path d="M140 18c-16-12-26-4-26 6 0 10 12 12 26 6" />
      <path d="M140 18c16-12 26-4 26 6 0 10-12 12-26 6" />
      <ellipse cx="140" cy="22" rx="6" ry="7" />
      <path d="M136 28c-6 12-2 18 4 14" />
      <path d="M144 28c6 12 2 18-4 14" />
    </svg>
  );
}

function RoadTrip({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 170"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M250 78c8-28 28-40 52-44" />
      <path d="M268 78c4-18 14-28 30-32" />
      <path d="M300 36l8-10M308 36l10-6M292 36l-2-12" />
      <path d="M210 90h28v-22h-12l-8 10h-8z" />
      <path d="M218 68v-14" />
      <path d="M226 68v-18" />
      <path d="M222 50h8" />
      <path d="M8 128c40-6 70 10 110 4 50-8 80-24 130-18 40 4 70 18 90 16" />
      <path d="M40 132c20-22 48-28 70-18 18 8 28 4 40-10 16-20 48-22 78-8" />
      {/* car */}
      <path d="M70 118c8-22 22-32 48-32h36c18 0 28 8 34 20 8 4 18 10 18 18H62c0-4 4-6 8-6z" />
      <path d="M92 86c8-18 18-24 34-24h18c12 0 20 8 24 18" />
      <circle cx="98" cy="124" r="10" />
      <circle cx="98" cy="124" r="4" />
      <circle cx="168" cy="124" r="10" />
      <circle cx="168" cy="124" r="4" />
      <circle cx="118" cy="92" r="6" />
      <circle cx="142" cy="90" r="6" />
      <path d="M86 104h28" />
    </svg>
  );
}

function StringHeart({ className }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 110"
      aria-hidden="true"
      fill="none"
      stroke={ink}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M48 42c-18 8-28 24-16 36 10 10 24 6 32-6" />
      <path d="M36 58c-10 8-10 22 2 28" />
      <path d="M252 42c18 8 28 24 16 36-10 10-24 6-32-6" />
      <path d="M264 58c10 8 10 22-2 28" />
      <path d="M68 48c40 38 62 38 82 8 6-10 18-10 24 0 20 30 42 30 82-8" />
    </svg>
  );
}

export const doodles = {
  Heart,
  ChampagneTower,
  Palaces,
  DiscoLights,
  Dancers,
  ToastHands,
  Clink,
  BowDivider,
  RoadTrip,
  StringHeart,
};
