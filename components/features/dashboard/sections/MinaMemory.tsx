"use client";

import { motion } from "framer-motion";
import { Gauge, ShieldAlert, Compass, Map } from "lucide-react";

interface MinaMemoryProps {
  mainPressure: string;
  fearPattern: string;
  supportStyle: string;
  currentPhaseName: string;
}

const cards = (props: MinaMemoryProps) => [
  {
    icon: Gauge,
    label: "Main pressure",
    value: props.mainPressure,
    color: "#f59e0b",
    dim: "rgba(245,158,11,0.08)",
    tooltip: "Your primary debt source from onboarding",
  },
  {
    icon: ShieldAlert,
    label: "Fear pattern",
    value: props.fearPattern,
    color: "#818CF8",
    dim: "rgba(129,140,248,0.08)",
    tooltip: "What you fear most about your situation",
  },
  {
    icon: Compass,
    label: "Support style",
    value: props.supportStyle,
    color: "#00C9A7",
    dim: "rgba(0,201,167,0.08)",
    tooltip: "How you asked Mina to communicate with you",
  },
  {
    icon: Map,
    label: "Current phase",
    value: props.currentPhaseName,
    color: "#C9A84C",
    dim: "rgba(201,168,76,0.08)",
    tooltip: "Where you are in the recovery journey",
  },
];

export default function MinaMemory(props: MinaMemoryProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          Mina Memory
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards(props).map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{
                background: card.dim,
                border: `1px solid ${card.color}22`,
                boxShadow: `0 4px 20px ${card.color}08`,
              }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}20` }}>
                <Icon size={17} style={{ color: card.color }} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold uppercase tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: card.color }}>
                  {card.label}
                </p>
                <p className="text-sm font-semibold leading-snug"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                  {card.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
