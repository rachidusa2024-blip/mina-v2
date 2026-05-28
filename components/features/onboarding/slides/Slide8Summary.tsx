"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Brain, Target, ArrowRight } from "lucide-react";
import { OnboardingData } from "../types";
import { generateSummary } from "../utils/generateSummary";

const t = {
  en: {
    eyebrow: "Your Mina Plan",
    headline: "Mina is ready.",
    subhead: "Based on what you shared, here is where we will focus.",
    pressure: "Your situation",
    patterns: "Your patterns",
    focus: "Our focus",
    recommendation: "First step",
    cta: "Create your account to save this plan",
    note: "Your plan is saved while you create your account.",
  },
  es: {
    eyebrow: "Tu Plan Mina",
    headline: "Mina está lista.",
    subhead: "Basado en lo que compartiste, aquí es donde nos enfocaremos.",
    pressure: "Tu situación",
    patterns: "Tus patrones",
    focus: "Nuestro enfoque",
    recommendation: "Primer paso",
    cta: "Crea tu cuenta para guardar este plan",
    note: "Tu plan se guarda mientras creas tu cuenta.",
  },
};

interface Slide8SummaryProps {
  lang: "en" | "es";
  data: OnboardingData;
  onNext: () => void;
}

const blocks = (lang: "en" | "es") => [
  { key: "pressure" as const, icon: AlertTriangle, color: "#f59e0b", dimColor: "rgba(245,158,11,0.1)" },
  { key: "patterns" as const, icon: Brain, color: "#818CF8", dimColor: "rgba(129,140,248,0.1)" },
  { key: "focus" as const, icon: Target, color: "#00C9A7", dimColor: "rgba(0,201,167,0.1)" },
  { key: "recommendation" as const, icon: Sparkles, color: "#C9A84C", dimColor: "rgba(201,168,76,0.1)" },
];

export default function Slide8Summary({ lang, data, onNext }: Slide8SummaryProps) {
  const c = t[lang];
  const summary = generateSummary(data, lang);
  const summaryBlocks = blocks(lang);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--teal)", color: "#090D1A" }}
          >
            <Sparkles size={14} />
          </div>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}
          >
            {c.eyebrow}
          </span>
        </div>

        <h2
          className="leading-tight tracking-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
            color: "var(--text-prime)",
          }}
        >
          {c.headline}
        </h2>

        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
        >
          {c.subhead}
        </p>
      </motion.div>

      {/* Summary blocks */}
      <div className="flex flex-col gap-3">
        {summaryBlocks.map((block, i) => {
          const Icon = block.icon;
          const text = summary[block.key];
          const label = c[block.key];

          return (
            <motion.div
              key={block.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              className="flex gap-3 p-4 rounded-xl"
              style={{
                background: block.dimColor,
                border: `1px solid ${block.color}20`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${block.color}18` }}
              >
                <Icon size={14} style={{ color: block.color }} />
              </div>
              <div className="flex flex-col gap-1">
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: block.color }}
                >
                  {label}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
                >
                  {text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        className="flex flex-col gap-3"
      >
        <button
          onClick={onNext}
          className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--teal)",
            color: "#090D1A",
            boxShadow: "0 0 24px rgba(0,201,167,0.2)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#00ddb8"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--teal)"; }}
        >
          {c.cta}
          <ArrowRight size={15} />
        </button>
        <p
          className="text-xs text-center"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}
        >
          {c.note}
        </p>
      </motion.div>
    </div>
  );
}
