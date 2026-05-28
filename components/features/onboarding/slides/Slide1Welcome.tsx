"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const t = {
  en: {
    headline: "You do not have to figure this out alone.",
    copy: "Mina will help you slow down, understand the pressure, and take one clear step at a time.",
    time: "This takes about 2 minutes.",
    cta: "Let's begin",
  },
  es: {
    headline: "No tienes que resolver esto solo.",
    copy: "Mina te ayudará a desacelerar, entender la presión y dar un paso claro a la vez.",
    time: "Esto toma unos 2 minutos.",
    cta: "Comencemos",
  },
};

interface Slide1WelcomeProps {
  lang: "en" | "es";
  onNext: () => void;
}

export default function Slide1Welcome({ lang, onNext }: Slide1WelcomeProps) {
  const c = t[lang];

  return (
    <div className="flex flex-col gap-10 pt-6">
      {/* Mina avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="flex flex-col items-center gap-3"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
          style={{ background: "var(--teal)", color: "#090D1A", fontFamily: "'Cormorant Garamond', serif" }}
        >
          M
        </div>
        <span
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}
        >
          Mina
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="flex flex-col gap-5"
      >
        <h1
          className="leading-[1.1] tracking-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 6vw, 2.75rem)",
            color: "var(--text-prime)",
          }}
        >
          {c.headline}
        </h1>

        <p
          className="text-base leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
        >
          {c.copy}
        </p>

        <p
          className="text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.55)" }}
        >
          {c.time}
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <button
          onClick={onNext}
          className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--teal)",
            color: "#090D1A",
            boxShadow: "0 0 24px rgba(0,201,167,0.22)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#00ddb8"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--teal)"; }}
        >
          {c.cta}
          <ArrowRight size={15} />
        </button>
      </motion.div>
    </div>
  );
}
