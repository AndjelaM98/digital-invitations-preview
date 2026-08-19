import Benefits from "../components/Benefits/Benefits";
import BenefitsThread from "../components/Benefits/BenefitsThread";
import Hero from "../components/Hero/Hero";
import InvitationShowcase from "../components/InvitationShowcase/InvitationShowcase";
import SectionHandoff from "../components/layout/SectionHandoff";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ContactsAtelier from "../components/Contacts/ContactsAtelier";
import Pricing from "../components/Pricing/Pricing";

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BenefitsThread />
        <InvitationShowcase />
        <SectionHandoff />
        <Benefits />
        <Pricing />
        <ContactsAtelier />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
