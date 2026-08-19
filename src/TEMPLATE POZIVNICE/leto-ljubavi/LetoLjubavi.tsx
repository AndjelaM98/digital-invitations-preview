import {

  motion,

  AnimatePresence,

  useReducedMotion,

  useScroll,

  useTransform,

} from "framer-motion";

import { useRef, useCallback, useEffect, useState } from "react";



import ScrollReveal from "../shared/ScrollReveal";

import InvitationShell from "../shared/InvitationShell";

import { invitationEase } from "../shared/motion";

import type { InvitationContent } from "../shared/types";

import LetoIntroGate from "./LetoIntroGate";
import LetoRsvp from "./LetoRsvp";
import TextMarquee from "./TextMarquee";

import { letoAssets } from "./media";

import { LETO_LJUBAVI_ID, letoLjubaviConfig } from "./config";

import {

  letoLjubaviDemoContent,

  type LetoLjubaviContent,

} from "./content";

import { doodles } from "./doodles";

import "./LetoLjubavi.css";



export { LETO_LJUBAVI_ID, letoLjubaviConfig };



export const letoLjubaviMeta = {

  id: letoLjubaviConfig.id,

  title: letoLjubaviConfig.title,

  sections: letoLjubaviConfig.sections,

} as const;



type LetoLjubaviProps = {

  content?: InvitationContent;

};



function isLetoContent(

  content: InvitationContent,

): content is LetoLjubaviContent {

  return "ticker" in content && "greeting" in content;

}



function MapButton({ href, label }: { href?: string; label: string }) {

  return (

    <a

      className="ll-btn"

      href={href}

      target="_blank"

      rel="noopener noreferrer"

    >

      {label}

    </a>

  );

}



function CarScene() {

  const ref = useRef<HTMLDivElement>(null);

  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({

    target: ref,

    offset: ["start end", "end start"],

  });

  const x = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-24, 28]);

  const drive = reduce
    ? {}
    : {
        animate: { y: [0, -8, 0] },
        transition: {
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const wobble = reduce
    ? {}
    : {
        animate: { rotate: [-1.2, 1.2, -1.2] },
        transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };



  return (

    <div ref={ref} className="ll-car">

      <motion.div className="ll-car__motion" style={{ x }} {...drive}>

        <motion.img

          className="ll-car__img"

          src={letoAssets.redCar}

          alt=""

          draggable={false}

          {...wobble}

        />

      </motion.div>

    </div>

  );

}



function LetoLjubavi({

  content = letoLjubaviDemoContent,

}: LetoLjubaviProps) {

  const data = isLetoContent(content) ? content : letoLjubaviDemoContent;

  const [inviteReady, setInviteReady] = useState(false);
  const [showGate, setShowGate] = useState(true);

  const revealInvite = useCallback(() => {
    setInviteReady(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  const dismissGate = useCallback(() => {
    setShowGate(false);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (showGate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [showGate]);

  const joiner = data.couple.joiner ?? "&";

  const names = `${data.couple.partnerOne} ${joiner} ${data.couple.partnerTwo}`;

  const reduce = useReducedMotion();

  const floatY = reduce

    ? {}

    : {

        animate: { y: [0, -5, 0] },

        transition: {

          duration: 5.5,

          repeat: Infinity,

          ease: "easeInOut" as const,

        },

      };

  const sway = reduce

    ? {}

    : {

        animate: { rotate: [-0.5, 0.5, -0.5] },

        transition: {

          duration: 7,

          repeat: Infinity,

          ease: "easeInOut" as const,

        },

      };



  return (

    <InvitationShell

      templateId={LETO_LJUBAVI_ID}

      className={`leto-ljubavi${inviteReady ? " leto-ljubavi--invite" : " leto-ljubavi--gated"}`}

    >

      <AnimatePresence>
        {showGate ? (
          <LetoIntroGate
            key="gate"
            onOpen={revealInvite}
            onFinished={dismissGate}
          />
        ) : null}
      </AnimatePresence>

      {inviteReady ? (
      <article className="ll">

        <TextMarquee text={data.ticker} />



        <header className="ll__block ll__hero">

          <ScrollReveal>

            <h1 className="ll__names">{names}</h1>

          </ScrollReveal>

          <ScrollReveal amount={0.2}>

            <img

              className="ll__art ll__art--tower"

              src={letoAssets.champagneTower}

              alt=""

              draggable={false}

            />

          </ScrollReveal>

          <ScrollReveal delay={0.08}>

            <p className="ll__greeting">{data.greeting}</p>

            <p className="ll__body">{data.intro}</p>

          </ScrollReveal>

        </header>



        <ScrollReveal className="ll__block ll__cal" as="section">

          <p className="ll__cal-month">{data.calendar.month}</p>

          <div className="ll__cal-grid">

            {data.calendar.days.map((day) => (

              <span key={day} className="ll__cal-day">

                {day}

              </span>

            ))}

            {data.calendar.dates.map((date) =>

              date === data.calendar.highlight ? (

                <span key={date} className="ll__cal-date ll__cal-date--heart">

                  <doodles.Heart className="ll__cal-heart" />

                  <span>{date}</span>

                </span>

              ) : (

                <span key={date} className="ll__cal-date">

                  {date}

                </span>

              ),

            )}

          </div>

        </ScrollReveal>



        <section className="ll__block ll-house">

          <ScrollReveal className="ll-house__stage" amount={0.25}>

            <img

              className="ll-house__half ll-house__half--left"

              src={letoAssets.houseLeft}

              alt=""

              draggable={false}

            />

            <div className="ll-house__center">

              <p className="ll__timeplace">{data.ceremony.timePlace}</p>

              <p className="ll__address">{data.ceremony.address}</p>

              <MapButton

                href={data.ceremony.mapUrl}

                label={data.ceremony.mapCtaLabel ?? "Otvori mapu"}

              />

            </div>

            <img

              className="ll-house__half ll-house__half--right"

              src={letoAssets.houseRight}

              alt=""

              draggable={false}

            />

          </ScrollReveal>

        </section>



        <ScrollReveal className="ll__block" as="section">

          <p className="ll__lead">{data.afterTitle}</p>

          <p className="ll__body">{data.afterBody}</p>

        </ScrollReveal>



        <section className="ll__block ll-dance" aria-label="Proslava">

          <motion.img

            className="ll-dance__lights"

            src={letoAssets.lights}

            alt=""

            draggable={false}

            style={{ transformOrigin: "50% 0%" }}

            {...sway}

          />

          <div className="ll-dance__floor">

            <motion.img

              className="ll-dance__guests"

              src={letoAssets.dancers}

              alt=""

              draggable={false}

              {...floatY}

            />

            <motion.img

              className="ll-dance__cheers"

              src={letoAssets.dancersCheers}

              alt=""

              draggable={false}

              {...floatY}

            />

          </div>

        </section>



        <ScrollReveal className="ll__block ll__party" as="section">

          <p className="ll__script ll__party-prompt">

            <span>Gde</span>

            <span>idemo</span>

            <span>dalje?</span>

          </p>

          <div className="ll__party-details">

            <p className="ll__timeplace">{data.party.timePlace}</p>

            <p className="ll__place">{data.party.placeName}</p>

            <MapButton

              href={data.party.mapUrl}

              label={data.party.mapCtaLabel ?? "Otvori mapu"}

            />

          </div>

        </ScrollReveal>



        <section className="ll__block ll-frame-wrap">

          <ScrollReveal className="ll-frame" amount={0.3}>

            <img

              className="ll-frame__art"

              src={letoAssets.frame}

              alt=""

              draggable={false}

            />

            <div className="ll-frame__copy">

              <p className="ll__serif">{data.extraDayBox.line}</p>

              <p className="ll__script ll__box-aside">{data.extraDayBox.aside}</p>

            </div>

          </ScrollReveal>

        </section>



        <ScrollReveal className="ll__block" as="section">

          <p className="ll__body">{data.tripIntro}</p>

        </ScrollReveal>



        <section className="ll-toast" aria-label="Nazdravljanje">

          <div className="ll-toast__slot ll-toast__slot--tl">

            <motion.img

              className="ll-toast__item"

              src={letoAssets.toastGlassTl}

              alt=""

              draggable={false}

              animate={reduce ? undefined : { y: [0, -4, 0] }}

              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}

            />

          </div>

          <div className="ll-toast__slot ll-toast__slot--wine">

            <motion.img

              className="ll-toast__item"

              src={letoAssets.wineHand}

              alt=""

              draggable={false}

              animate={reduce ? undefined : { y: [0, -4, 0] }}

              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}

            />

          </div>

          <div className="ll-toast__slot ll-toast__slot--flute">

            <motion.img

              className="ll-toast__item"

              src={letoAssets.fluteHand}

              alt=""

              draggable={false}

              animate={reduce ? undefined : { y: [0, -4, 0] }}

              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}

            />

          </div>

          <div className="ll-toast__slot ll-toast__slot--br">

            <motion.img

              className="ll-toast__item"

              src={letoAssets.toastGlassBr}

              alt=""

              draggable={false}

              animate={reduce ? undefined : { y: [0, -4, 0] }}

              transition={{ duration: 5.7, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}

            />

          </div>

          <div className="ll-toast__slot ll-toast__slot--bottle">

            <motion.img

              className="ll-toast__item"

              src={letoAssets.toastBottleBl}

              alt=""

              draggable={false}

              animate={reduce ? undefined : { y: [0, -4, 0] }}

              transition={{ duration: 6.1, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}

            />

          </div>

          <div className="ll-toast__slot ll-toast__slot--clink">

            <motion.img

              className="ll-toast__item"

              src={letoAssets.clinkHeart}

              alt=""

              draggable={false}

              animate={reduce ? undefined : { y: [0, -3, 0] }}

              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}

            />

          </div>

          <div className="ll-toast__center">

            <doodles.Heart className="ll__heart" />

            <p className="ll__dates">{data.tripDates}</p>

            <p className="ll__address">{data.tripPlace}</p>

          </div>

        </section>



        <ScrollReveal className="ll__block" as="section">

          <p className="ll__serif">{data.tripBody}</p>

        </ScrollReveal>



        <CarScene />



        <ScrollReveal className="ll__block" as="section">

          <p className="ll__serif">{data.packingNote}</p>

        </ScrollReveal>



        <footer className="ll__block ll__footer">

          <ScrollReveal>

            <doodles.Heart className="ll__heart" />

            <p className="ll__serif">{data.closing}</p>

          </ScrollReveal>

          <ScrollReveal className="ll__finale-wrap" amount={0.2}>

            <motion.img

              className="ll__art ll__art--finale"

              src={letoAssets.coupleFinale}

              alt={`${data.couple.partnerOne} i ${data.couple.partnerTwo}`}

              draggable={false}

              initial={reduce ? false : { opacity: 0, y: 14 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ amount: 0.25, once: true }}

              transition={{ duration: 1.1, ease: invitationEase }}

            />

            <p className="ll__script ll__sign">{data.signOff}</p>

          </ScrollReveal>

        </footer>



        <LetoRsvp content={data} />

      </article>
      ) : null}

    </InvitationShell>

  );

}



export default LetoLjubavi;


