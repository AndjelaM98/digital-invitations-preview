import "./SectionHandoff.css";

/**
 * Lightweight static dissolve between showcase and benefits.
 * Scroll-linked motion removed for performance.
 */
function SectionHandoff() {
  return (
    <div className="section-handoff" aria-hidden="true">
      <div className="section-handoff__veil" />
      <div className="section-handoff__mist section-handoff__mist--top" />
      <div className="section-handoff__mist section-handoff__mist--bottom" />
    </div>
  );
}

export default SectionHandoff;
