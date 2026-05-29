"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { VisitUpdate } from "../useDashboardData";

interface SinceLastVisitProps {
  items: VisitUpdate[];
}

export default function SinceLastVisit({ items }: SinceLastVisitProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.14)" }}>
      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-widest"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
          Since your last visit
        </p>
        <div className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.25 + i * 0.08 }}
              className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(0,201,167,0.15)" }}>
                <Check size={10} style={{ color: "var(--teal)" }} />
              </div>
              <p className="text-sm leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
