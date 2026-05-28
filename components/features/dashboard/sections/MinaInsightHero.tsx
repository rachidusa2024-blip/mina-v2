"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import type { PressureState, CurrentPhase } from "../useDashboardData";

interface MinaInsightHeroProps {
  pressureState: PressureState;
  pressureStateColor: string;
  currentPhase: CurrentPhase;
  coachInsight: string;
  coachFocus: string;
  confidenceScore: number;
  recommendation: string;
  recommendedRoute: string;
}

const phaseColors: Record<CurrentPhase, string> = {
  Stabilize: "#818CF8",
  Protect: "#00C9A7",
  Act: "#f59e0b",
  Recover: "#C9A84C",
};

const TRUST_SIGNALS = [
  "Your information stays private",
  "Mina never makes financial decisions for you",
  "Professional resources available when needed",
];

export default function MinaInsightHero({
  pressureState, pressureStateColor, currentPhase,
  coachInsight, coachFocus, confidenceScore,
  recommendation, recommendedRoute,
}: MinaInsightHeroProps) {
  const phaseColor = phaseColors[currentPhase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #0D1120 0%, #111827 55%, rgba(0,201,167,0.04) 100%)",
        border: "1px solid rgba(0,201,167,0.2)",
        boxShadow: "0 0 80px rgba(0,201,167,0.06), 0 20px 60px rgba(0,0,0,0.4)",
      }}
    >
      <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 65%)", transform: "translate(35%,-35%)" }} />

      <div className="relative z-10 p-7 sm:p-8 flex flex-col gap-7">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,201,167,0.15)" }}>
              <Sparkles size={13} style={{ color: "var(--teal)" }} />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
              Mina's Read
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif", background: `${pressureStateColor}15`, color: pressureStateColor, border: `1px solid ${pressureStateColor}30` }}>
              {pressureState}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif", background: `${phaseColor}15`, color: phaseColor, border: `1px solid ${phaseColor}30` }}>
              {currentPhase}
            </span>
          </div>
        </div>

        {/* Coach insight — human narrative */}
        <div className="flex flex-col gap-4">
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.1rem, 2.8vw, 1.38rem)",
            color: "var(--text-prime)",
            lineHeight: 1.7,
          }}>
            {coachInsight}
          </p>

          {/* Today's focus */}
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
            style={{ background: "rgba(0,201,167,0.07)", border: "1px solid rgba(0,201,167,0.16)" }}>
            <div className="w-1 h-full rounded-full flex-shrink-0 mt-0.5 self-stretch"
              style={{ background: "var(--teal)", minHeight: "16px" }} />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold uppercase tracking-wider"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
                Today's focus
              </span>
              <p className="text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                {coachFocus}
              </p>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-sm leading-relaxed flex-1"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
            {recommendation}
          </p>
          <Link href={recommendedRoute}
            className="group flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--teal)", color: "#090D1A", whiteSpace: "nowrap", boxShadow: "0 0 20px rgba(0,201,167,0.2)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#00ddb8"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--teal)"; }}>
            Continue next step
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {TRUST_SIGNALS.map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <Check size={11} style={{ color: "rgba(0,201,167,0.6)", flexShrink: 0 }} />
              <span className="text-xs"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.55)" }}>
                {t}
              </span>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
