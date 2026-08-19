import "./TornPaperEdge.css";

type TornPaperEdgeProps = {
  className?: string;
};

/**
 * Dual-layer torn paper (matches premium stationery reference):
 * - cooler white under-sheet peeks above the cream
 * - cream top sheet with soft, irregular, low-frequency waves
 * - upward drop-shadow onto the photograph
 */
function TornPaperEdge({ className = "" }: TornPaperEdgeProps) {
  return (
    <div
      className={`invitation-torn-edge ${className}`.trim()}
      aria-hidden="true"
    >
      <svg
        className="invitation-torn-edge__sheet invitation-torn-edge__sheet--white"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        {/* Soft deckle — brighter white under layer */}
        <path
          fill="#ffffff"
          d="M0 100 V34
            C55 31 95 24 150 28
            C210 33 245 42 310 38
            C380 33 420 22 490 26
            C560 30 600 41 670 37
            C740 32 785 23 850 28
            C905 32 945 38 1000 35
            V100 H0 Z"
        />
      </svg>

      <svg
        className="invitation-torn-edge__sheet invitation-torn-edge__sheet--cream"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        {/* Main cream paper — slightly lower so white rim shows */}
        <path
          fill="var(--inv-cream, #faf6f0)"
          d="M0 100 V46
            C60 43 100 36 160 40
            C225 45 265 54 335 50
            C410 45 450 34 520 38
            C595 42 640 53 710 49
            C780 44 825 35 890 40
            C935 43 970 48 1000 46
            V100 H0 Z"
        />
      </svg>
    </div>
  );
}

export default TornPaperEdge;
