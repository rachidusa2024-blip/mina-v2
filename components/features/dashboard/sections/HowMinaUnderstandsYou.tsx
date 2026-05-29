"use client";

import { motion } from "framer-motion";
import { Gauge, ShieldAlert, Compass, Map } from "lucide-react";
import type { MemoryCard } from "../useDashboardData";

const ICONS = [Gauge, ShieldAlert, Compass, Map];
const COLORS = ["#f59e0b", "#818CF8", "#00C9A7", "#C9A84C"];

interface HowMinaUnderstandsYouProps { memoryCards: MemoryCard[]; }

export default function HowMinaUnderstandsYou({ memoryCards }: HowMinaUnderstandsYouProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          How Mina Understands You
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {memoryCards.map((card, i) => {
          const Icon = ICONS[i];
          const color = COLORS[i];
          return (
            <motion.div key={card.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: `${color}0c`, border: `1px solid ${color}22` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif", color }}>
                  {card.label}
                </p>
                <p className="text-sm font-semibold leading-snug"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                  {card.value}
                </p>
              </div>
              <p className="text-xs leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", color: `${color}75`, borderTop: `1px solid ${color}18`, paddingTop: "8px" }}>
                {card.coachingNote}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
