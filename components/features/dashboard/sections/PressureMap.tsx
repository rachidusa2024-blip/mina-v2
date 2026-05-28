"use client";

import { motion } from "framer-motion";
import { Phone, FileText, Scale, Gavel, TrendingUp } from "lucide-react";
import type { PressureArea } from "../useDashboardData";

const ICONS = [Phone, FileText, Scale, Gavel, TrendingUp];

const STATUS_STYLE = {
  "Clear":           { color: "#22c55e", bg: "rgba(34,197,94,0.07)",   border: "rgba(34,197,94,0.16)",   dot: "rgba(34,197,94,0.9)" },
  "Needs attention": { color: "#f59e0b", bg: "rgba(245,158,11,0.07)",  border: "rgba(245,158,11,0.18)",  dot: "rgba(245,158,11,0.9)" },
  "Watch":           { color: "#f97316", bg: "rgba(249,115,22,0.07)",  border: "rgba(249,115,22,0.18)",  dot: "rgba(249,115,22,0.9)" },
  "Act now":         { color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",    dot: "rgba(239,68,68,0.9)" },
};

interface PressureMapProps {
  areas: PressureArea[];
}

export default function PressureMap({ areas }: PressureMapProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          Pressure Map
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {areas.map((area, i) => {
          const Icon = ICONS[i];
          const s = STATUS_STYLE[area.status];
          return (
            <motion.div key={area.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}>

              {/* Status — hero element */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: s.dot, boxShadow: `0 0 6px ${s.color}` }}
                />
                <span className="text-sm font-bold"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: s.color }}>
                  {area.status}
                </span>
              </div>

              {/* Area label + icon */}
              <div className="flex items-center gap-2">
                <Icon size={13} style={{ color: "rgba(136,146,164,0.45)", flexShrink: 0 }} />
                <span className="text-sm font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
                  {area.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
