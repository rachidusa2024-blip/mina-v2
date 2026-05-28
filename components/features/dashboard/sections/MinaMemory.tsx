"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Brain, Heart, Compass } from "lucide-react";

interface MinaMemoryProps {
  mainPressure: string;
  fearPattern: string;
  supportStyle: string;
  currentPhaseName: string;
}

const cards = (props: MinaMemoryProps) => [
  {
    icon: AlertTriangle,
    label: "Main pressure",
    value: props.mainPressure,
    color: "#f59e0b",
    dim: "rgba(245,158,11,0.08)",
  },
  {
    icon: Brain,
    label: "Fear pattern",
    value: props.fearPattern,
    color: "#818CF8",
    dim: "rgba(129,140,248,0.08)",
  },
  {
    icon: Heart,
    label: "Support style",
    value: props.supportStyle,
    color: "#00C9A7",
    dim: "rgba(0,201,167,0.08)",
  },
  {
    icon: Compass,
    label: "Current phase",
    value: props.currentPhaseName,
    color: "#C9A84C",
    dim: "rgba(201,168,76,0.08)",
  },
];

export default function MinaMemory(props: MinaMemoryProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span
          className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
        >
          Mina Memory
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards(props).map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{
                background: card.dim,
                border: `1px solid ${card.color}20`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${card.color}18` }}
              >
                <Icon size={15} style={{ color: card.color }} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: card.color }}
                >
                  {card.label}
                </p>
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
                >
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
