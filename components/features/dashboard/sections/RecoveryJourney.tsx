"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

interface RecoveryJourneyProps {
  phases: string[];
  currentIndex: number;
  nextMilestoneName: string;
}

export default function RecoveryJourney({ phases, currentIndex, nextMilestoneName }: RecoveryJourneyProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          Recovery Journey
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="flex flex-col gap-5 p-6 rounded-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

        {/* Desktop path */}
        <div className="hidden sm:flex items-start gap-0">
          {phases.map((phase, i) => {
            const isPast = i < currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <div key={phase} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  {/* YOU ARE HERE label */}
                  <div className="h-5 flex items-center">
                    {isCurrent && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xs font-bold tracking-wider uppercase whitespace-nowrap"
                        style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
                        You are here
                      </motion.span>
                    )}
                  </div>

                  {/* Node */}
                  <div className="relative">
                    {/* Pulse ring for current */}
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full"
                        style={{ border: "2px solid var(--teal)", margin: "-6px" }}
                      />
                    )}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: isPast ? "var(--teal)" : isCurrent ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.03)",
                        border: `2px solid ${isPast ? "var(--teal)" : isCurrent ? "var(--teal)" : "rgba(255,255,255,0.1)"}`,
                        boxShadow: isCurrent ? "0 0 24px rgba(0,201,167,0.3)" : "none",
                      }}>
                      {isPast
                        ? <Check size={14} style={{ color: "#090D1A" }} />
                        : <div className="w-2 h-2 rounded-full"
                            style={{ background: isCurrent ? "var(--teal)" : "rgba(255,255,255,0.12)" }} />
                      }
                    </motion.div>
                  </div>

                  <span className="text-xs font-semibold text-center whitespace-nowrap mt-1"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: isCurrent ? "var(--teal)" : isPast ? "var(--text-muted)" : "rgba(136,146,164,0.3)",
                    }}>
                    {phase}
                  </span>
                </div>

                {/* Connector */}
                {i < phases.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 mt-7"
                    style={{ background: isPast ? "var(--teal)" : "rgba(255,255,255,0.06)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile list */}
        <div className="flex sm:hidden flex-col gap-2">
          {phases.map((phase, i) => {
            const isPast = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={phase} className="flex items-center gap-3">
                <div className="relative">
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ border: "1px solid var(--teal)", margin: "-4px" }}
                    />
                  )}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: isPast ? "var(--teal)" : isCurrent ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isCurrent ? "var(--teal)" : isPast ? "var(--teal)" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    {isPast
                      ? <Check size={12} style={{ color: "#090D1A" }} />
                      : <div className="w-1.5 h-1.5 rounded-full" style={{ background: isCurrent ? "var(--teal)" : "rgba(255,255,255,0.12)" }} />
                    }
                  </div>
                </div>
                <span className="text-sm font-medium flex-1"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: isCurrent ? "var(--teal)" : isPast ? "var(--text-muted)" : "rgba(136,146,164,0.3)" }}>
                  {phase}
                </span>
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

        {/* Next milestone */}
        {nextMilestoneName && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.12)" }}>
            <ArrowRight size={13} style={{ color: "var(--teal)", flexShrink: 0 }} />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
                Next milestone:{" "}
              </span>
              <span className="text-xs"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                {nextMilestoneName}
              </span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
