"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { PressureState, CurrentPhase } from "../useDashboardData";

interface MinaInsightHeroProps {
  pressureState: PressureState;
  pressureStateColor: string;
  currentPhase: CurrentPhase;
  insightText: string;
  patternObservation: string;
  todayGuidance: string;
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

export default function MinaInsightHero({
  pressureState, pressureStateColor, currentPhase,
  insightText, patternObservation, todayGuidance,
  confidenceScore, recommendation, recommendedRoute,
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
      {/* Ambient top-right glow */}
      <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 65%)", transform: "translate(30%,-30%)" }}
      />

      <div className="relative z-10 p-7 sm:p-8 flex flex-col gap-6">

        {/* Top row: eyebrow + badges */}
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

        {/* Insight quote */}
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.15rem, 3vw, 1.45rem)", color: "var(--text-prime)", fontStyle: "italic", lineHeight: 1.6 }}>
          "{insightText}"
        </p>

        {/* Intelligence strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pattern */}
          <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl"
            style={{ background: "rgba(129,140,248,0.07)", border: "1px solid rgba(129,140,248,0.14)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#818CF8" }}>Pattern</span>
            <p className="text-sm leading-snug"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
              {patternObservation}
            </p>
          </div>

          {/* Today */}
          <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl"
            style={{ background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.14)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>Today</span>
            <p className="text-sm leading-snug"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
              {todayGuidance}
            </p>
          </div>

          {/* Confidence */}
          <div className="flex flex-col gap-2 px-4 py-3 rounded-xl"
            style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.14)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#C9A84C" }}>Confidence</span>
              <span className="text-sm font-bold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#C9A84C" }}>{confidenceScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidenceScore}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, rgba(201,168,76,0.6), #C9A84C)" }}
              />
            </div>
            <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(201,168,76,0.65)" }}>
              {confidenceScore < 60 ? "Add more context to improve" : confidenceScore < 80 ? "Good clarity on your situation" : "Strong situational read"}
            </p>
          </div>
        </div>

        {/* Recommendation + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2"
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
      </div>
    </motion.div>
  );
}
