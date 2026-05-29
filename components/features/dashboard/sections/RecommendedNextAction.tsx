"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap, Lightbulb } from "lucide-react";
import Link from "next/link";
import type { PrimaryAction } from "../useDashboardData";

const impactColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };
const impactBg   = { High: "rgba(239,68,68,0.07)", Medium: "rgba(245,158,11,0.07)", Low: "rgba(34,197,94,0.07)" };

interface RecommendedNextActionProps extends PrimaryAction {
  whyRecommends: string;
}

export default function RecommendedNextAction({ label, route, timeRequired, impact, whyRecommends }: RecommendedNextActionProps) {
  const ic = impactColor[impact];
  const ib = impactBg[impact];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ background: "var(--bg-card)", border: "1px solid rgba(129,140,248,0.2)" }}>

      <p className="text-xs font-bold uppercase tracking-widest"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#818CF8" }}>
        Recommended next action
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="flex-1 text-base font-semibold leading-snug"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
          {label}
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock size={12} style={{ color: "rgba(136,146,164,0.5)" }} />
            <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}>{timeRequired}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: ib, border: `1px solid ${ic}22` }}>
            <Zap size={10} style={{ color: ic }} />
            <span className="text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: ic }}>{impact}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: "rgba(129,140,248,0.05)", border: "1px solid rgba(129,140,248,0.12)" }}>
        <Lightbulb size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#818CF8" }} />
        <p className="text-sm leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          {whyRecommends}
        </p>
      </div>

      <Link href={route}
        className="group self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{ fontFamily: "'DM Sans', sans-serif", background: "#818CF8", color: "#090D1A" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#939ef9"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#818CF8"; }}>
        Take Action <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
