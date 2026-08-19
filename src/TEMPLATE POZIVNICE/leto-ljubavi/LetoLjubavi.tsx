import {

  motion,

  AnimatePresence,

  useInView,

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



type GentleFloatOptions = {

  y?: number;

  x?: number;

  rotate?: number;

  duration?: number;

  delay?: number;

};



function useSectionFloat<T extends HTMLElement = HTMLElement>(amount = 0.28) {

  const ref = useRef<T>(null);

  const reduce = useReducedMotion();

  const inView = useInView(ref, {

    amount,

    margin: "0px 0px -6% 0px",

  });

  return { ref, active: !reduce && inView, reduce };

}



function gentleFloatMotion(active: boolean, opts: GentleFloatOptions = {}) {

  const y = opts.y ?? 8;

  const x = opts.x ?? 0;

  const rotate = opts.rotate ?? 0;

  if (!active) {

    return {

      animate: { y: 0, x: 0, rotate: 0 },

      transition: { duration: 0.35, ease: invitationEase },

    };

  }

  const animate: Record<string, number | number[]> = { y: [0, -y, 0] };

  if (x) animate.x = [0, x, 0, -x, 0];

  if (rotate) animate.rotate = [-rotate, rotate, -rotate];

  return {

    animate,

    transition: {

      duration: opts.duration ?? 4.8,

      repeat: Infinity,

      ease: "easeInOut" as const,

      delay: opts.delay ?? 0,

    },

  };

}



function PartyPromptWords({ text }: { text: string }) {

  const ref = useRef<HTMLParagraphElement>(null);

  const reduce = useReducedMotion();

  const inView = useInView(ref, { amount: 0.45, once: true });

  const words = text.trim().split(/\s+/);



  return (

    <p ref={ref} className="ll__script ll__party-prompt">

      {words.map((word, index) => (

        <motion.span

          key={`${word}-${index}`}

          initial={reduce ? false : { opacity: 0, y: 14 }}

          animate={

            reduce || inView

              ? { opacity: 1, y: 0 }

              : { opacity: 0, y: 14 }

          }

          transition={{

            duration: 0.62,

            delay: index * 0.38,

            ease: invitationEase,

          }}

        >

          {word}

        </motion.span>

      ))}

    </p>

  );

}



function DanceSection() {

  const { ref, active } = useSectionFloat<HTMLElement>(0.22);

  const lights = gentleFloatMotion(active, { rotate: 1.1, duration: 6.4 });

  const guests = gentleFloatMotion(active, {

    y: 10,

    x: 5,

    duration: 3.8,

  });

  const cheers = gentleFloatMotion(active, {

    y: 9,

    x: 4,

    duration: 4.2,

    delay: 0.35,

  });



  return (

    <section ref={ref} className="ll__block ll-dance" aria-label="Proslava">

      <motion.img

        className="ll-dance__lights"

        src={letoAssets.lights}

        alt=""

        draggable={false}

        style={{ transformOrigin: "50% 0%" }}

        {...lights}

      />

      <div className="ll-dance__floor">

        <motion.img

          className="ll-dance__guests"

          src={letoAssets.dancers}

          alt=""

          draggable={false}

          {...guests}

        />

        <motion.img

          className="ll-dance__cheers"

          src={letoAssets.dancersCheers}

          alt=""

          draggable={false}

          {...cheers}

        />

      </div>

    </section>

  );

}



function TripDateToast({

  dates,

  place,

}: {

  dates: string;

  place: string;

}) {

  const { ref, active } = useSectionFloat<HTMLElement>(0.32);

  const center = gentleFloatMotion(active, { y: 7, rotate: 0.35, duration: 5.2, delay: 0.15 });



  return (

    <section ref={ref} className="ll-toast" aria-label="Nazdravljanje">

      <div className="ll-toast__slot ll-toast__slot--tl">

        <motion.img

          className="ll-toast__item"

          src={letoAssets.toastGlassTl}

          alt=""

          draggable={false}

          {...gentleFloatMotion(active, { y: 5, duration: 5.6 })}

        />

      </div>

      <div className="ll-toast__slot ll-toast__slot--wine">

        <motion.img

          className="ll-toast__item"

          src={letoAssets.wineHand}

          alt=""

          draggable={false}

          {...gentleFloatMotion(active, { y: 5, duration: 5.8, delay: 0.2 })}

        />

      </div>

      <div className="ll-toast__slot ll-toast__slot--flute">

        <motion.img

          className="ll-toast__item"

          src={letoAssets.fluteHand}

          alt=""

          draggable={false}

          {...gentleFloatMotion(active, { y: 5, duration: 6, delay: 0.35 })}

        />

      </div>

      <div className="ll-toast__slot ll-toast__slot--br">

        <motion.img

          className="ll-toast__item"

          src={letoAssets.toastGlassBr}

          alt=""

          draggable={false}

          {...gentleFloatMotion(active, { y: 5, duration: 5.7, delay: 0.15 })}

        />

      </div>

      <div className="ll-toast__slot ll-toast__slot--bottle">

        <motion.img

          className="ll-toast__item"

          src={letoAssets.toastBottleBl}

          alt=""

          draggable={false}

          {...gentleFloatMotion(active, { y: 5, duration: 6.1, delay: 0.45 })}

        />

      </div>

      <div className="ll-toast__slot ll-toast__slot--clink">

        <motion.img

          className="ll-toast__item"

          src={letoAssets.clinkHeart}

          alt=""

          draggable={false}

          {...gentleFloatMotion(active, { y: 4, duration: 4.8 })}

        />

      </div>

      <motion.div className="ll-toast__center" {...center}>

        <doodles.Heart className="ll__heart" />

        <p className="ll__dates">{dates}</p>

        <p className="ll__address">{place}</p>

      </motion.div>

    </section>

  );

}



function ChampagneTowerArt() {

  const { ref, active } = useSectionFloat<HTMLImageElement>(0.25);

  const float = gentleFloatMotion(active, {

    y: 10,

    rotate: 0.75,

    duration: 5.4,

  });



  return (

    <ScrollReveal amount={0.2}>

      <motion.img

        ref={ref}

        className="ll__art ll__art--tower"

        src={letoAssets.champagneTower}

        alt=""

        draggable={false}

        {...float}

      />

    </ScrollReveal>

  );

}



function ExtraDayFrame({

  line,

  aside,

}: {

  line: string;

  aside: string;

}) {

  const { ref, active } = useSectionFloat<HTMLImageElement>(0.3);

  const frameFloat = gentleFloatMotion(active, {

    y: 8,

    rotate: 0.45,

    duration: 5.8,

  });



  return (

    <section className="ll__block ll-frame-wrap">

      <ScrollReveal className="ll-frame" amount={0.3}>

        <motion.img

          ref={ref}

          className="ll-frame__art"

          src={letoAssets.frame}

          alt=""

          draggable={false}

          {...frameFloat}

        />

        <div className="ll-frame__copy">

          <p className="ll__serif">{line}</p>

          <p className="ll__script ll__box-aside">{aside}</p>

        </div>

      </ScrollReveal>

    </section>

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

          <ChampagneTowerArt />

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



        <DanceSection />



        <ScrollReveal className="ll__block ll__party" as="section">

          <PartyPromptWords text={data.partyPrompt} />

          <div className="ll__party-details">

            <p className="ll__timeplace">{data.party.timePlace}</p>

            <p className="ll__place">{data.party.placeName}</p>

            <MapButton

              href={data.party.mapUrl}

              label={data.party.mapCtaLabel ?? "Otvori mapu"}

            />

          </div>

        </ScrollReveal>



        <ExtraDayFrame line={data.extraDayBox.line} aside={data.extraDayBox.aside} />



        <ScrollReveal className="ll__block" as="section">

          <p className="ll__body">{data.tripIntro}</p>

        </ScrollReveal>



        <TripDateToast dates={data.tripDates} place={data.tripPlace} />



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


