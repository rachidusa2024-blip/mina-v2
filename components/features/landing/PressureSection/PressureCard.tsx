"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PressureCardProps {
  icon: LucideIcon;
  label: string;
  index: number;
}

export default function PressureCard({ icon: Icon, label, index }: PressureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200 cursor-default"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = "1px solid rgba(0,201,167,0.2)";
        el.style.background = "rgba(0,201,167,0.04)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = "1px solid var(--border)";
        el.style.background = "var(--bg-card)";
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200"
        style={{
          background: "rgba(0,201,167,0.08)",
        }}
      >
        <Icon size={18} style={{ color: "var(--teal)" }} />
      </div>
      <p
        className="text-sm font-medium text-center leading-snug"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "var(--text-prime)",
        }}
      >
        {label}
      </p>
    </motion.div>
  );
}
