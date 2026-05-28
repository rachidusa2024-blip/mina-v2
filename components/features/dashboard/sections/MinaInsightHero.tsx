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
  pressureState,
  pressureStateColor,
  currentPhase,
  insightText,
  recommendation,
  recommendedRoute,
}: MinaInsightHeroProps) {
  const phaseColor = phaseColors[currentPhase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative overflow-hidden rounded-2xl p-7 sm:p-8"
      style={{
        background: "linear-gradient(135deg, #0F1623 0%, #111827 60%, rgba(0,201,167,0.04) 100%)",
        border: "1px solid rgba(0,201,167,0.18)",
        boxShadow: "0 0 60px rgba(0,201,167,0.06)",
      }}
    >
      {/* Background ambient */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,201,167,0.12)" }}
            >
              <Sparkles size={14} style={{ color: "var(--teal)" }} />
            </div>
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}
            >
              Mina's Read
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Pressure badge */}
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: `${pressureStateColor}15`,
                color: pressureStateColor,
                border: `1px solid ${pressureStateColor}30`,
              }}
            >
              {pressureState}
            </span>

            {/* Phase badge */}
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: `${phaseColor}15`,
                color: phaseColor,
                border: `1px solid ${phaseColor}30`,
              }}
            >
              {currentPhase}
            </span>
          </div>
        </div>

        {/* Insight text */}
        <p
          className="leading-relaxed"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
            color: "var(--text-prime)",
            fontStyle: "italic",
          }}
        >
          "{insightText}"
        </p>

        {/* Recommendation + CTA */}
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-sm leading-relaxed flex-1"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
          >
            {recommendation}
          </p>

          <Link
            href={recommendedRoute}
            className="group flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "var(--teal)",
              color: "#090D1A",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#00ddb8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--teal)"; }}
          >
            Continue next step
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
