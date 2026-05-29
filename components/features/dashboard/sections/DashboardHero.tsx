"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import type { PrimaryAction, PressureState, CurrentPhase } from "../useDashboardData";

interface DashboardHeroProps {
  heroLines: string[];
  heroClosing: string;
  primaryAction: PrimaryAction;
  pressureState: PressureState;
  pressureStateColor: string;
  currentPhase: CurrentPhase;
}

const impactColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

export default function DashboardHero({
  heroLines, heroClosing, primaryAction,
  pressureState, pressureStateColor, currentPhase,
}: DashboardHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative overflow-hidden rounded-2xl min-h-[420px] sm:min-h-0 flex flex-col justify-between"
      style={{
        background: "linear-gradient(150deg, #0C111E 0%, #111827 60%, rgba(0,201,167,0.05) 100%)",
        border: "1px solid rgba(0,201,167,0.2)",
        boxShadow: "0 0 100px rgba(0,201,167,0.06), 0 30px 80px rgba(0,0,0,0.5)",
        padding: "clamp(28px, 5vw, 48px)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 60%)", transform: "translate(40%,-40%)" }} />

      <div className="relative z-10 flex flex-col gap-8">

        {/* Mina identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(0,201,167,0.15)", border: "1px solid rgba(0,201,167,0.25)" }}>
            <Sparkles size={15} style={{ color: "var(--teal)" }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
              Mina's Read
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", background: `${pressureStateColor}15`, color: pressureStateColor, border: `1px solid ${pressureStateColor}30` }}>
                {pressureState}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(0,201,167,0.1)", color: "var(--teal)", border: "1px solid rgba(0,201,167,0.2)" }}>
                {currentPhase}
              </span>
            </div>
          </div>
        </div>

        {/* Coach narrative */}
        <div className="flex flex-col gap-4">
          {heroLines.map((line, i) => (
            <motion.p key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
                color: i === 0 ? "var(--text-prime)" : "rgba(240,244,255,0.75)",
                lineHeight: 1.6,
              }}>
              {line}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
              color: "var(--teal)",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}>
            {heroClosing}
          </motion.p>
        </div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-col gap-3"
        >
          <Link href={primaryAction.route}
            className="group self-start flex items-center gap-3 px-7 py-4 rounded-xl text-base font-bold transition-all"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "var(--teal)",
              color: "#090D1A",
              boxShadow: "0 0 32px rgba(0,201,167,0.28)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "#00ddb8";
              el.style.transform = "translateY(-1px)";
              el.style.boxShadow = "0 0 44px rgba(0,201,167,0.38)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--teal)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 0 32px rgba(0,201,167,0.28)";
            }}>
            {primaryAction.label}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: "rgba(136,146,164,0.5)" }} />
              <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}>
                {primaryAction.timeRequired}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: impactColor[primaryAction.impact] }} />
              <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}>
                {primaryAction.impact} impact
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
