"use client";

import Link from "next/link";
import { LogOut, Bell } from "lucide-react";
import { motion } from "framer-motion";
import type { CurrentPhase } from "./useDashboardData";

const PHASE_FOCUS: Record<CurrentPhase, string> = {
  Stabilize: "Slowing things down",
  Protect: "Protecting your position",
  Act: "Taking deliberate action",
  Recover: "Rebuilding confidence",
};

interface DashboardHeaderProps {
  firstName?: string;
  currentPhase?: CurrentPhase;
}

export default function DashboardHeader({ firstName = "there", currentPhase = "Stabilize" }: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30"
      style={{ background: "rgba(9,13,26,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--teal)", color: "#090D1A" }}>S</div>
          <span className="text-sm font-semibold hidden sm:block"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>Sum Goals</span>
        </Link>

        {/* Mina presence — center */}
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2.5 px-4 py-1.5 rounded-full"
          style={{ background: "rgba(0,201,167,0.07)", border: "1px solid rgba(0,201,167,0.15)" }}>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--teal)" }} />
            <span className="text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--teal)" }}>
              Mina
            </span>
          </div>
          <span className="text-xs hidden sm:block" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.6)" }}>·</span>
          <span className="text-xs hidden sm:block" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
            {PHASE_FOCUS[currentPhase]}
          </span>
        </motion.div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm hidden sm:block" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
            Hi, {firstName}
          </span>
          <button className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }} aria-label="Notifications">
            <Bell size={16} />
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)", border: "1px solid var(--border)" }}
            onClick={() => {}}>
            <LogOut size={13} />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>

      </div>
    </header>
  );
}
