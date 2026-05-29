"use client";

import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import type { PressureState, CurrentPhase } from "../useDashboardData";

const TRUST = [
  "Your information stays private",
  "Mina never makes financial decisions for you",
  "Legal guidance available when needed",
];

interface DashboardHeroProps {
  heroLines: string[];
  heroClosing: string;
  heroFocus: string;
  pressureState: PressureState;
  pressureStateColor: string;
  currentPhase: CurrentPhase;
}

const phaseColors: Record<CurrentPhase, string> = {
  Stabilize: "#818CF8", Protect: "#00C9A7", Act: "#f59e0b", Recover: "#C9A84C",
};

export default function DashboardHero({
  heroLines, heroClosing, heroFocus,
  pressureState, pressureStateColor, currentPhase,
}: DashboardHeroProps) {
  const phaseColor = phaseColors[currentPhase];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative overflow-hidden rounded-2xl"
      style={{ background: "linear-gradient(150deg, #0C111E 0%, #111827 60%, rgba(0,201,167,0.04) 100%)", border: "1px solid rgba(0,201,167,0.18)", boxShadow: "0 0 80px rgba(0,201,167,0.05), 0 24px 60px rgba(0,0,0,0.4)", padding: "clamp(28px, 5vw, 44px)" }}>
      <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 62%)", transform: "translate(35%,-35%)" }} />
      <div className="relative z-10 flex flex-col gap-7">

        {/* Identity */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,201,167,0.15)" }}>
              <Sparkles size={14} style={{ color: "var(--teal)" }} />
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

        {/* Coaching lines */}
        <div className="flex flex-col gap-4">
          {heroLines.map((line, i) => (
            <motion.p key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.12 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.8vw, 1.42rem)", color: i === 0 ? "var(--text-prime)" : "rgba(240,244,255,0.72)", lineHeight: 1.65 }}>
              {line}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.52 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.8vw, 1.42rem)", color: "var(--teal)", lineHeight: 1.65, fontStyle: "italic" }}>
            {heroClosing}
          </motion.p>
        </div>

        {/* Today's focus */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.15)" }}>
          <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: "var(--teal)", minHeight: "16px" }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
              Today's focus
            </p>
            <p className="text-sm leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
              {heroFocus}
            </p>
          </div>
        </motion.div>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {TRUST.map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <Check size={11} style={{ color: "rgba(0,201,167,0.5)", flexShrink: 0 }} />
              <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.45)" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
