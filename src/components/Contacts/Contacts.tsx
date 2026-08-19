import "./Contacts.css";
import { useState } from "react";
import Instagram from "../../assets/icons/instagram-green.png";
import Facebook from "../../assets/icons/facebook-green.png";
import TikTok from "../../assets/icons/tik-tok-green.png";
import Email from "../../assets/icons/email-green.png";

type FormStatus = "idle" | "sending" | "success" | "error";

function Contacts() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const handleSubmit: React.JSX.IntrinsicElements["form"]["onSubmit"] = async (
    event,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");

    try {
      const response = await fetch("https://formspree.io/f/xwvgrvvw", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Slanje poruke nije uspelo.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };
  return (
    <section className="contacts">
      <div className="contacts_card">
        <div className="contacts_card-heading">
          <p className="contacts_overline">Kontakt</p>
          <h2>Tu smo za Vas</h2>
        </div>

        <div className="contacts_details">
          <div className="contacts_content">
            <form className="contacts_form" onSubmit={handleSubmit}>
              <div className="contacts_field-row">
                <div className="contacts_field">
                  <label htmlFor="firstName">Ime</label>
                  <input
                    id="firstName"
                    name="ime"
                    type="text"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="contacts_field">
                  <label htmlFor="email">Email adresa</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="contacts_field">
                <label htmlFor="message">Vaša poruka</label>
                <textarea id="message" name="poruka" rows={6} required />
              </div>

              <input
                type="hidden"
                name="_subject"
                value="Nova poruka sa sajta Klik do venčanja"
              />

              <button
                className="contacts_submit"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Šaljem..." : "Pošalji poruku"}
              </button>

              <div className="contacts_status" aria-live="polite">
                {status === "success" && (
                  <p className="contacts_success">
                    Hvala! Vaša poruka je uspešno poslata.
                  </p>
                )}

                {status === "error" && (
                  <p className="contacts_error">
                    Došlo je do greške. Pokušajte ponovo malo kasnije.
                  </p>
                )}
              </div>
            </form>
          </div>
          <div>
            <svg
              width="18"
              height="320"
              viewBox="0 0 18 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="
M9 0
C12 40 6 80 9 120
C12 160 6 200 9 240
C12 280 8 320 9 320
"
                fill="none"
                stroke="#C5CEBA"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="3 10"
              />
            </svg>
          </div>
          <div className="contacts_info">
            <ul>
              <li>
                <div>
                  <img src={Instagram} alt="Instagram" />
                </div>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @klikdovencanja
                </a>
              </li>
              <li>
                <div>
                  <img src={Facebook} alt="Facebook" />
                </div>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @klikdovencanja
                </a>
              </li>
              <li>
                <div>
                  <img src={TikTok} alt="TikTok" />
                </div>
                <a
                  href="https://www.tiktok.com/@klikdovencanja"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @klikdovencanja
                </a>
              </li>
              <li>
                <div>
                  <img src={Email} alt="Email" />
                </div>
                <a
                  href="mailto:dovencanjaklik@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @dovencanjaklik
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
