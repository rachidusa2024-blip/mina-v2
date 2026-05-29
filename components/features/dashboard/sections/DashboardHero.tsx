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
  heroObservation: string;
  heroInsight: string;
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
  heroObservation, heroInsight, heroClosing, heroFocus,
  pressureState, pressureStateColor, currentPhase,
}: DashboardHeroProps) {
  const phaseColor = phaseColors[currentPhase];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(150deg, #0C111E 0%, #111827 60%, rgba(0,201,167,0.04) 100%)",
        border: "1px solid rgba(0,201,167,0.18)",
        boxShadow: "0 0 80px rgba(0,201,167,0.05), 0 24px 60px rgba(0,0,0,0.4)",
        padding: "clamp(24px, 4vw, 40px)",
      }}
    >
      <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 62%)", transform: "translate(35%,-35%)" }} />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,201,167,0.15)" }}>
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

        {/* 3 sentences — short, scannable */}
        <div className="flex flex-col gap-3">
          <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.6vw, 1.35rem)", color: "var(--text-prime)", lineHeight: 1.6 }}>
            {heroObservation}
          </motion.p>
          <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.6vw, 1.35rem)", color: "rgba(240,244,255,0.7)", lineHeight: 1.6 }}>
            {heroInsight}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.42 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.6vw, 1.35rem)", color: "var(--teal)", lineHeight: 1.6, fontStyle: "italic" }}>
            {heroClosing}
          </motion.p>
        </div>

        {/* Today's focus */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.52 }}
          className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.14)" }}>
          <div className="w-0.5 self-stretch rounded-full flex-shrink-0" style={{ background: "var(--teal)", minHeight: "14px" }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>Today</p>
            <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
              {heroFocus}
            </p>
          </div>
        </motion.div>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "12px" }}>
          {TRUST.map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <Check size={10} style={{ color: "rgba(0,201,167,0.5)", flexShrink: 0 }} />
              <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.45)" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
