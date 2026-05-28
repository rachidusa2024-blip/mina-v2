"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SystemPillarProps {
  icon: LucideIcon;
  title: string;
  accentColor: string;
  accentDim: string;
  items: string[];
  index: number;
}

export default function SystemPillar({
  icon: Icon,
  title,
  accentColor,
  accentDim,
  items,
  index,
}: SystemPillarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 p-6 rounded-2xl"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Pillar header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentDim }}
        >
          <Icon size={18} style={{ color: accentColor }} />
        </div>
        <h3
          className="text-base font-bold tracking-wide uppercase"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: accentColor,
            letterSpacing: "0.1em",
          }}
        >
          {title}
        </h3>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{ background: `linear-gradient(to right, ${accentColor}30, transparent)` }}
      />

      {/* Items */}
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--text-muted)",
            }}
          >
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accentColor, opacity: 0.6 }}
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
