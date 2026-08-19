import "./Pricing.css";

type PricingPlan = {
  name: string;
  subtitle: string;
  price: string;
  features: string[];
  featured?: boolean;
  custom?: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Essential",
    subtitle: "Za jednostavnu i elegantnu digitalnu pozivnicu",
    price: "Od 90 €",
    features: [
      "Personalizovane boje i tipografija",
      "Informacije o događaju",
      "Mapa lokacije",
      "Prilagođeno mobilnim uređajima",
      "Link za jednostavno deljenje",
      "Do dve izmene sadržaja",
    ],
  },
  {
    name: "Signature",
    subtitle: "Za potpuno i interaktivno iskustvo za goste",
    price: "Od 150 €",
    featured: true,
    features: [
      "Sve iz Essential paketa",
      "Interaktivna RSVP forma",
      "Potvrda dolaska u jednom kliku",
      "Odbrojavanje do događaja",
      "Galerija fotografija",
      "Suptilne animacije",
      "Odgovori gostiju sačuvani u tabeli",
      "Podrška do dana događaja",
    ],
  },
  {
    name: "Exclusive",
    subtitle: "Za potpuno unikatan dizajn i dodatne funkcionalnosti",
    price: "Od 250 €",
    features: [
      "Sve iz Signature paketa",
      "Dizajn kreiran potpuno od nule",
      "Program i vremenska linija događaja",
      "Dress code i korisne informacije",
      "Sekcija za smeštaj i preporuke",
      "Višejezična verzija",
      "Personalizovani domen",
      "Prioritetna izrada",
    ],
  },
  {
    name: "Po meri",
    subtitle: "Za specifične ideje koje ne pripadaju standardnom paketu",
    price: "Po dogovoru",
    custom: true,
    features: [
      "Više događaja ili lokacija",
      "Napredne RSVP opcije",
      "Video i posebne galerije",
      "Custom animacije",
      "Dodatne stranice",
      "Posebne funkcionalnosti po dogovoru",
    ],
  },
];

function Pricing() {
  return (
    <section className="pricing" id="cenovnik">
      <div className="pricing_container">
        <div className="pricing_heading">
          <p className="pricing_overline">Paketi</p>

          <h2>Odaberite iskustvo koje odgovara vašoj priči</h2>

          <p className="pricing_intro">
            Svaka pozivnica se prilagođava vašem događaju, stilu i detaljima
            koji vaš dan čine posebnim.
          </p>
        </div>

        <div className="pricing_grid">
          {pricingPlans.map((plan) => (
            <article
              className={`pricing_card ${
                plan.featured ? "pricing_card--featured" : ""
              } ${plan.custom ? "pricing_card--custom" : ""}`}
              key={plan.name}
            >
              {plan.featured && (
                <span className="pricing_badge">Najčešći izbor</span>
              )}

              <div className="pricing_card-header">
                <p className="pricing_plan-name">{plan.name}</p>
                <h3>{plan.price}</h3>
                <p className="pricing_subtitle">{plan.subtitle}</p>
              </div>

              <div
                className="pricing_divider"
                aria-hidden="true"
              >
                <svg
                  width="8"
                  height="68"
                  viewBox="0 0 8 68"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="4"
                    y1="0"
                    x2="4"
                    y2="68"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="2 8"
                  />
                </svg>
              </div>

              <ul className="pricing_features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <span aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#kontakt"
                className={`pricing_button ${
                  plan.featured ? "pricing_button--featured" : ""
                }`}
              >
                Pošaljite upit
              </a>
            </article>
          ))}
        </div>

        <p className="pricing_note">
          Konačna cena zavisi od obima sadržaja, izabranih funkcionalnosti i
          roka izrade.
        </p>
      </div>
    </section>
  );
}

export default Pricing;