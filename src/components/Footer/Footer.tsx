import "./Footer.css";
import Instagram from "../../assets/icons/instagram.png";
import Facebook from "../../assets/icons/facebook.png";
import TikTok from "../../assets/icons/tik-tok.png";

const navLinks = [
  { label: "Demo", href: "#demo" },
  { label: "Cene", href: "#pricing" },
  { label: "Kontakt", href: "#contact" },
] as const;

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/klikdovencanja/",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: Facebook,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@klikdovencanja",
    icon: TikTok,
  },
] as const;

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <p className="footer__brand">Klik do venčanja</p>

        <p className="footer__tagline">
          Digitalne pozivnice, s ljubavlju pripremljene.
        </p>

        <nav className="footer__nav" aria-label="Futer navigacija">
          {navLinks.map((link, index) => (
            <span key={link.label} className="footer__nav-item">
              {index > 0 ? (
                <span className="footer__dot" aria-hidden="true">
                  ·
                </span>
              ) : null}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </nav>

        <ul className="footer__socials">
          {socials.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
              >
                <img src={item.icon} alt="" />
              </a>
            </li>
          ))}
        </ul>

        <p className="footer__copy">
          &copy; 2026 Klik do venčanja. Sva prava zadržana.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
