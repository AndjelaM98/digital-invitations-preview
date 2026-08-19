import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

type HeaderProps = {
  /** `landing` = full hero header; `page` = compact nav for inner routes */
  variant?: "landing" | "page";
};

function Header({ variant = "landing" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPage = variant === "page";

  useEffect(() => {
    if (menuOpen) document.body.classList.add("menu-open");
    else document.body.classList.remove("menu-open");

    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <section
      className={`header ${menuOpen ? "header--menu-open" : ""} ${isPage ? "header--page" : ""}`}
      id={isPage ? undefined : "home"}
    >
      <div className="header_container">
        <Link className="header_logo" to="/" onClick={closeMenu}>
          Klik do venčanja
        </Link>

        <button
          className={`header_burger ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`header_nav ${menuOpen ? "header_nav--open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <Link to="/" onClick={closeMenu}>
            Početna
          </Link>
          <Link to="/#invitation-showcase" onClick={closeMenu}>
            Demo
          </Link>
          <Link to="/#cenovnik" onClick={closeMenu}>
            Cene
          </Link>
          <Link to="/#contacts-atelier" onClick={closeMenu}>
            Kontakt
          </Link>
        </nav>
      </div>

      {!isPage ? (
        <>
          <div className="header_content">
            <h1>
              Digitalne pozivnice
              <br />
              <span className="header_span_cursive">za posebne trenutke</span>
            </h1>
            <p className="header_span_p">
              Elegantne, interaktivne i potpuno personalizovane <br /> pozivnice
              za sve tipove proslava
            </p>
          </div>
          <div>
            <a href="#demo" className="scroll-indicator" aria-label="Scroll down">
              <svg width="28" height="42" viewBox="0 0 28 42">
                <path
                  d="M4 12 L14 22 L24 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 22 L14 32 L24 22"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default Header;
