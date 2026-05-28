"use client";

import { motion } from "framer-motion";
import { Phone, FileText, Scale, Gavel, TrendingUp } from "lucide-react";
import type { PressureArea } from "../useDashboardData";

const ICONS = [Phone, FileText, Scale, Gavel, TrendingUp];

const STATUS_LABELS = {
  "Clear": { dot: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  "Needs attention": { dot: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  "Watch": { dot: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)" },
  "Act now": { dot: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
};

interface PressureMapProps {
  areas: PressureArea[];
}

export default function PressureMap({ areas }: PressureMapProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span
          className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
        >
          Pressure Map
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {areas.map((area, i) => {
          const Icon = ICONS[i];
          const style = STATUS_LABELS[area.status];

          return (
            <motion.div
              key={area.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="flex flex-col gap-3 p-4 rounded-2xl sm:flex-col flex-row items-center sm:items-start"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
              }}
            >
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-3 w-full">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${style.dot}18` }}
                >
                  <Icon size={16} style={{ color: style.dot }} />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
                  >
                    {area.label}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: style.dot }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: style.dot }}
                    >
                      {area.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
