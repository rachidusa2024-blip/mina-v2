"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import type { NextBestAction as NBA } from "../useDashboardData";

const impactColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };
const impactBg = { High: "rgba(239,68,68,0.08)", Medium: "rgba(245,158,11,0.08)", Low: "rgba(34,197,94,0.08)" };

export default function NextBestAction({ action, estimatedTime, impact, reason, route }: NBA) {
  const color = impactColor[impact];
  const bg = impactBg[impact];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative overflow-hidden rounded-2xl p-6 sm:p-7"
      style={{
        background: "linear-gradient(135deg, #0D1220 0%, rgba(129,140,248,0.05) 100%)",
        border: "1px solid rgba(129,140,248,0.22)",
        boxShadow: "0 0 50px rgba(129,140,248,0.05)",
      }}
    >
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 65%)", transform: "translate(25%,-25%)" }} />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#818CF8" }}>
            Your next best action
          </span>
        </div>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "var(--text-prime)", lineHeight: 1.4, fontWeight: 600 }}>
          {action}
        </p>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Clock size={12} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
              {estimatedTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: bg, border: `1px solid ${color}25` }}>
            <Zap size={12} style={{ color }} />
            <span className="text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color }}>
              {impact} impact
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <BookOpen size={14} className="mt-0.5 flex-shrink-0" style={{ color: "rgba(136,146,164,0.5)" }} />
          <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
            {reason}
          </p>
        </div>

        <Link href={route}
          className="group self-start flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all"
          style={{ fontFamily: "'DM Sans', sans-serif", background: "#818CF8", color: "#090D1A", boxShadow: "0 0 20px rgba(129,140,248,0.2)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#939ef9"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#818CF8"; }}>
          Take Action
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}
