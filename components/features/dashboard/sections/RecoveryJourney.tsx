"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const PHASE_SUBTITLES: Record<string, string> = {
  Stabilize: "Slow the panic",
  Understand: "Know what is real",
  Protect: "Avoid costly mistakes",
  Act: "Take control",
  Resolve: "Reduce the pressure",
  Recover: "Rebuild confidence",
};

interface RecoveryJourneyProps {
  phases: string[]; currentIndex: number;
  nextMilestoneName: string; journeyProgress: number;
}

export default function RecoveryJourney({ phases, currentIndex, nextMilestoneName, journeyProgress }: RecoveryJourneyProps) {
  const currentPhase = phases[currentIndex];
  const nextPhase = phases[currentIndex + 1];
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          Getting back in control
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="flex flex-col gap-5 p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
              You are here: <span style={{ color: "var(--text-prime)" }}>{currentPhase}</span>
            </p>
            {nextPhase && (
              <p className="text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                Next: <span style={{ color: "var(--text-prime)" }}>{nextPhase}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>How far you have come</span>
            <span className="text-xl font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>{journeyProgress}%</span>
          </div>
        </div>

        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(journeyProgress, 4)}%` }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="h-full rounded-full" style={{ background: "linear-gradient(to right, rgba(0,201,167,0.5), var(--teal))" }} />
        </div>

        {/* Desktop */}
        <div className="hidden sm:flex items-start gap-0">
          {phases.map((phase, i) => {
            const isPast = i < currentIndex;
            const isCurrent = i === currentIndex;
            const sub = PHASE_SUBTITLES[phase] ?? "";
            return (
              <div key={phase} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="h-4 flex items-center justify-center">
                    {isCurrent && (
                      <motion.div className="w-1.5 h-1.5 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }} style={{ background: "var(--teal)" }} />
                    )}
                  </div>
                  <div className="relative">
                    {isCurrent && (
                      <motion.div animate={{ scale: [1, 1.9, 1], opacity: [0.45, 0, 0.45] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full"
                        style={{ border: "2px solid var(--teal)", margin: "-6px" }} />
                    )}
                    <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: isPast ? "var(--teal)" : isCurrent ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.03)", border: `2px solid ${isPast ? "var(--teal)" : isCurrent ? "var(--teal)" : "rgba(255,255,255,0.1)"}`, boxShadow: isCurrent ? "0 0 22px rgba(0,201,167,0.28)" : "none" }}>
                      {isPast ? <Check size={13} style={{ color: "#090D1A" }} />
                        : <div className="w-1.5 h-1.5 rounded-full" style={{ background: isCurrent ? "var(--teal)" : "rgba(255,255,255,0.12)" }} />}
                    </motion.div>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 mt-1">
                    <span className="text-xs font-semibold text-center whitespace-nowrap"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: isCurrent ? "var(--teal)" : isPast ? "var(--text-muted)" : "rgba(136,146,164,0.28)" }}>
                      {phase}
                    </span>
                    <span className="text-xs text-center whitespace-nowrap"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: isCurrent ? "rgba(0,201,167,0.6)" : "rgba(136,146,164,0.2)", fontSize: "10px" }}>
                      {sub}
                    </span>
                  </div>
                </div>
                {i < phases.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 mt-4"
                    style={{ background: isPast ? "var(--teal)" : "rgba(255,255,255,0.06)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden flex-col gap-2">
          {phases.map((phase, i) => {
            const isPast = i < currentIndex;
            const isCurrent = i === currentIndex;
            const sub = PHASE_SUBTITLES[phase] ?? "";
            return (
              <div key={phase} className="flex items-center gap-3">
                <div className="relative">
                  {isCurrent && (
                    <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.45, 0, 0.45] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ border: "1px solid var(--teal)", margin: "-4px" }} />
                  )}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: isPast ? "var(--teal)" : isCurrent ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${isCurrent ? "var(--teal)" : isPast ? "var(--teal)" : "rgba(255,255,255,0.08)"}` }}>
                    {isPast ? <Check size={12} style={{ color: "#090D1A" }} />
                      : <div className="w-1.5 h-1.5 rounded-full" style={{ background: isCurrent ? "var(--teal)" : "rgba(255,255,255,0.12)" }} />}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: isCurrent ? "var(--teal)" : isPast ? "var(--text-muted)" : "rgba(136,146,164,0.28)" }}>
                    {phase}
                  </span>
                  <span className="text-xs block"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: isCurrent ? "rgba(0,201,167,0.5)" : "rgba(136,146,164,0.2)" }}>
                    {sub}
                  </span>
                </div>
                {isCurrent && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(0,201,167,0.1)", color: "var(--teal)" }}>
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {nextMilestoneName && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl"
            style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.12)" }}>
            <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: "var(--teal)", minHeight: "14px" }} />
            <div>
              <span className="text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>Next step: </span>
              <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>{nextMilestoneName}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
