import "./Hero.css";
function Hero() {
  return (
    <section className="quote-card">
      <div className="quote-card_inner">
        <p className="quote-card_text">
          Prvi utisak o Vašoj proslavi
          <br />
          <span className="quote-card_red">
            počinje <span style={{ fontStyle: "italic" }}>pozivnicom</span>.
          </span>
        </p>
        <svg
          className="quote-line"
          width="340"
          height="18"
          viewBox="0 -5 340 18"
        >
          <path
            d="M-100 10 Q90 -15 335 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="100"
          />
        </svg>
        
      </div>
    </section>
  );
}

export default Hero;

