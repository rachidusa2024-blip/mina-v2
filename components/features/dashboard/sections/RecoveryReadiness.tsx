"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { EmotionalState } from "../useDashboardData";

interface RecoveryReadinessProps {
  score: number;
  emotionalState: EmotionalState;
  emotionalStateColor: string;
}

const EMOTIONAL_DESCRIPTIONS: Record<EmotionalState, string> = {
  Overwhelmed: "Multiple pressures at once",
  Uncertain: "Clarity is building",
  Defensive: "Protecting from risk",
  Preparing: "Building readiness",
  Focused: "Moving with intention",
  Recovering: "Forward momentum",
};

export default function RecoveryReadiness({ score, emotionalState, emotionalStateColor }: RecoveryReadinessProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* Recovery Readiness */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <Link href="/recovery"
          className="flex flex-col gap-4 p-5 rounded-2xl block transition-all"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.border = "1px solid rgba(0,201,167,0.25)"; el.style.boxShadow = "0 4px 20px rgba(0,201,167,0.06)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.border = "1px solid var(--border)"; el.style.boxShadow = "none"; }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
                Recovery Readiness
              </p>
              <p className="text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                Preparedness, not debt size
              </p>
            </div>

            {/* Ring */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                <motion.circle
                  cx="50" cy="50" r={radius} fill="none"
                  stroke="var(--teal)" strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold leading-none"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>{score}</span>
                <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>/100</span>
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.55)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
            This score reflects how prepared you are — not how much debt you have. Upload documents and complete sessions to increase it.
          </p>
        </Link>
      </motion.div>

      {/* Emotional State */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <Link href="/stabilize"
          className="flex flex-col justify-between gap-4 p-5 rounded-2xl block h-full transition-all"
          style={{ background: `${emotionalStateColor}09`, border: `1px solid ${emotionalStateColor}22` }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.border = `1px solid ${emotionalStateColor}45`; el.style.boxShadow = `0 4px 20px ${emotionalStateColor}08`; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.border = `1px solid ${emotionalStateColor}22`; el.style.boxShadow = "none"; }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif", color: emotionalStateColor }}>
              Current State
            </p>
            <p className="text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
              {EMOTIONAL_DESCRIPTIONS[emotionalState]}
            </p>
          </div>

          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
              color: emotionalStateColor,
              lineHeight: 1.1,
              fontWeight: 600,
            }}>
              {emotionalState}
            </p>
          </div>

          <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)", borderTop: `1px solid ${emotionalStateColor}15`, paddingTop: "12px" }}>
            Tap to open Stabilize Mode
          </p>
        </Link>
      </motion.div>
    </div>
  );
}
