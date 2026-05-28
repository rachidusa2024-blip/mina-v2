"use client";

import { motion } from "framer-motion";

const t = {
  en: {
    headline1: "Debt pressure",
    headline2: "can take over",
    headline3: "your life.",
    headline4: "Mina helps you",
    headline5: "take it back.",
    sub: "Mina helps people facing collectors, missed payments, medical debt, IRS notices, and financial pressure stay calm, understand what is happening, and know what to do next.",
    line1: "Before the call.",
    line2: "During the pressure.",
    line3: "After the crisis.",
    line4: "Mina stays with you.",
  },
  es: {
    headline1: "La presión de deudas",
    headline2: "puede tomar control",
    headline3: "de tu vida.",
    headline4: "Mina te ayuda",
    headline5: "a recuperarla.",
    sub: "Mina ayuda a personas que enfrentan cobradores, pagos perdidos, deudas médicas, avisos del IRS y presión financiera a mantenerse tranquilas, entender lo que está pasando y saber qué hacer a continuación.",
    line1: "Antes de la llamada.",
    line2: "Durante la presión.",
    line3: "Después de la crisis.",
    line4: "Mina está contigo.",
  },
};

interface HeroTextProps {
  lang: "en" | "es";
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroText({ lang }: HeroTextProps) {
  const c = t[lang];

  return (
    <div className="flex flex-col gap-6">
      {/* Eyebrow */}
      <motion.div {...fadeUp(0.1)}>
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--teal)",
            background: "rgba(0,201,167,0.1)",
            border: "1px solid rgba(0,201,167,0.2)",
          }}
        >
          Financial Pressure Intelligence
        </span>
      </motion.div>

      {/* Main headline */}
      <motion.div {...fadeUp(0.2)}>
        <h1
          className="leading-[1.05] tracking-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
            color: "var(--text-prime)",
          }}
        >
          {c.headline1}{" "}
          {c.headline2}{" "}
          <span style={{ color: "var(--teal)" }}>{c.headline3}</span>
          <br />
          {c.headline4}{" "}
          <span style={{ color: "var(--teal)" }}>{c.headline5}</span>
        </h1>
      </motion.div>

      {/* Subheadline */}
      <motion.p
        {...fadeUp(0.35)}
        className="text-lg leading-relaxed max-w-xl"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "var(--text-muted)",
        }}
      >
        {c.sub}
      </motion.p>

      {/* Emotional lines */}
      <motion.div
        {...fadeUp(0.5)}
        className="pl-4 flex flex-col gap-0.5"
        style={{ borderLeft: "2px solid rgba(0,201,167,0.4)" }}
      >
        {[c.line1, c.line2, c.line3].map((line) => (
          <p
            key={line}
            className="text-sm italic"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              color: "var(--text-muted)",
            }}
          >
            {line}
          </p>
        ))}
        <p
          className="text-sm italic font-semibold"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.05rem",
            color: "var(--teal)",
          }}
        >
          {c.line4}
        </p>
      </motion.div>
    </div>
  );
}
