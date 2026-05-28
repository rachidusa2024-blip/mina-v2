"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface RecoveryJourneyProps {
  phases: string[];
  currentIndex: number;
}

export default function RecoveryJourney({ phases, currentIndex }: RecoveryJourneyProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span
          className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
        >
          Recovery Journey
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      {/* Desktop: horizontal path */}
      <div className="hidden sm:flex items-center gap-0">
        {phases.map((phase, i) => {
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={phase} className="flex items-center flex-1">
              {/* Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                  style={{
                    background: isPast ? "var(--teal)" : isCurrent ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.03)",
                    borderColor: isPast ? "var(--teal)" : isCurrent ? "var(--teal)" : "rgba(255,255,255,0.1)",
                    boxShadow: isCurrent ? "0 0 20px rgba(0,201,167,0.25)" : "none",
                  }}
                >
                  {isPast ? (
                    <Check size={14} style={{ color: "#090D1A" }} />
                  ) : (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: isCurrent ? "var(--teal)" : "rgba(255,255,255,0.15)" }}
                    />
                  )}
                </div>
                <span
                  className="text-xs font-semibold text-center whitespace-nowrap"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: isCurrent ? "var(--teal)" : isPast ? "var(--text-muted)" : "rgba(136,146,164,0.35)",
                  }}
                >
                  {phase}
                </span>
              </motion.div>

              {/* Connector */}
              {i < phases.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1"
                  style={{
                    background: isPast
                      ? "var(--teal)"
                      : "rgba(255,255,255,0.06)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical list */}
      <div className="flex sm:hidden flex-col gap-2">
        {phases.map((phase, i) => {
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={phase} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: isPast ? "var(--teal)" : isCurrent ? "rgba(0,201,167,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isCurrent ? "var(--teal)" : isPast ? "var(--teal)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {isPast ? (
                  <Check size={12} style={{ color: "#090D1A" }} />
                ) : (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isCurrent ? "var(--teal)" : "rgba(255,255,255,0.12)" }}
                  />
                )}
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: isCurrent ? "var(--teal)" : isPast ? "var(--text-muted)" : "rgba(136,146,164,0.35)",
                }}
              >
                {phase}
              </span>
              {isCurrent && (
                <span
                  className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: "rgba(0,201,167,0.1)",
                    color: "var(--teal)",
                  }}
                >
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
