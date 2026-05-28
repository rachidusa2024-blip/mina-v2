"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LEVELS = {
  en: [
    { value: 1, label: "Stable", color: "#22c55e" },
    { value: 2, label: "Stressful", color: "#84cc16" },
    { value: 3, label: "Heavy pressure", color: "#f59e0b" },
    { value: 4, label: "Overwhelming", color: "#f97316" },
    { value: 5, label: "Crisis mode", color: "#ef4444" },
  ],
  es: [
    { value: 1, label: "Estable", color: "#22c55e" },
    { value: 2, label: "Estresante", color: "#84cc16" },
    { value: 3, label: "Presión fuerte", color: "#f59e0b" },
    { value: 4, label: "Abrumador", color: "#f97316" },
    { value: 5, label: "Modo crisis", color: "#ef4444" },
  ],
};

const SUPPORT_TEXT = {
  en: {
    1: "Good — we'll help you stay ahead before anything escalates.",
    2: "We'll help you get clarity on what actually needs attention first.",
    3: "We'll break this down into manageable steps, one at a time.",
    4: "We'll help you slow down decisions and protect your position carefully.",
    5: "We'll focus on slowing things down and helping you regain clarity first.",
  },
  es: {
    1: "Bien — te ayudaremos a mantenerte por delante antes de que algo escale.",
    2: "Te ayudaremos a aclarar qué necesita atención primero.",
    3: "Dividiremos esto en pasos manejables, uno a la vez.",
    4: "Te ayudaremos a tomar decisiones más lentas y proteger tu posición.",
    5: "Nos enfocaremos en desacelerar y ayudarte a recuperar la claridad primero.",
  },
};

const t = {
  en: { headline: "How intense does the situation feel right now?", cta: "Continue" },
  es: { headline: "¿Qué tan intensa se siente la situación ahora mismo?", cta: "Continuar" },
};

interface Slide4UrgencyProps {
  lang: "en" | "es";
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
}

export default function Slide4Urgency({ lang, value, onChange, onNext }: Slide4UrgencyProps) {
  const c = t[lang];
  const levels = LEVELS[lang];
  const supportText = SUPPORT_TEXT[lang];
  const current = levels.find((l) => l.value === value) || levels[2];

  return (
    <div className="flex flex-col gap-10">
      <h2
        className="leading-tight tracking-tight"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
          color: "var(--text-prime)",
        }}
      >
        {c.headline}
      </h2>

      {/* Current level display */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <motion.div
            key={value}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-5xl font-bold"
            style={{ fontFamily: "'DM Sans', sans-serif", color: current.color }}
          >
            {value}
          </motion.div>
          <motion.p
            key={`label-${value}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-base font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif", color: current.color }}
          >
            {current.label}
          </motion.p>
        </div>

        {/* Custom slider */}
        <div className="relative px-2">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${current.color} 0%, ${current.color} ${((value - 1) / 4) * 100}%, rgba(255,255,255,0.1) ${((value - 1) / 4) * 100}%, rgba(255,255,255,0.1) 100%)`,
              // @ts-ignore
              "--thumb-color": current.color,
            }}
          />
          {/* Level labels */}
          <div className="flex justify-between mt-2">
            {levels.map((l) => (
              <button
                key={l.value}
                onClick={() => onChange(l.value)}
                className="text-xs transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: value === l.value ? current.color : "rgba(136,146,164,0.4)",
                  fontWeight: value === l.value ? 600 : 400,
                }}
              >
                {l.value}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic support text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="px-4 py-3.5 rounded-xl"
            style={{
              background: `${current.color}0f`,
              border: `1px solid ${current.color}25`,
            }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
            >
              {supportText[value as keyof typeof supportText]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: "var(--teal)",
          color: "#090D1A",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#00ddb8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--teal)"; }}
      >
        {c.cta}
      </button>
    </div>
  );
}
