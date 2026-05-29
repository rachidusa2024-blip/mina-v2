"use client";

import { motion } from "framer-motion";
import { Activity, Files, ShieldCheck, Milestone, ScrollText, MountainSnow, Scale, ArrowRight } from "lucide-react";
import Link from "next/link";

function MinaM({ color }: { color: string }) {
  return (
    <div className="w-4 h-4 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: `${color}25`, color, fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", lineHeight: 1 }}>
      M
    </div>
  );
}

const WORKSPACES = [
  { label: "Slow things down",   sub: "Stabilize",       route: "/stabilize",     Icon: Activity,     color: "#818CF8", custom: false },
  { label: "What they sent you", sub: "Documents",        route: "/documents",     Icon: Files,        color: "#00C9A7", custom: false },
  { label: "Talk to Mina",       sub: "Mina Coach",       route: "/chat",          Icon: null,         color: "#00C9A7", custom: true  },
  { label: "Before you decide",  sub: "Decision Shield",  route: "/decisions",     Icon: ShieldCheck,  color: "#f59e0b", custom: false },
  { label: "What happened so far", sub: "Timeline",       route: "/timeline",      Icon: Milestone,    color: "#818CF8", custom: false },
  { label: "Your responses",     sub: "Letters",          route: "/letters",       Icon: ScrollText,   color: "#C9A84C", custom: false },
  { label: "Getting your life back", sub: "Recovery",     route: "/recovery",      Icon: MountainSnow, color: "#22c55e", custom: false },
  { label: "Know your options",  sub: "Legal Support",    route: "/legal-support", Icon: Scale,        color: "#f97316", custom: false },
];

export default function Workspaces() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          Where do you want to go
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WORKSPACES.map((ws, i) => (
          <motion.div key={ws.route}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
            <Link href={ws.route}
              className="group flex flex-col gap-2 p-4 rounded-xl transition-all duration-150 block"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.border = `1px solid ${ws.color}35`; el.style.background = `${ws.color}07`; el.style.boxShadow = `0 4px 20px ${ws.color}0a`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.border = "1px solid var(--border)"; el.style.background = "var(--bg-card)"; el.style.boxShadow = "none"; }}>
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${ws.color}14` }}>
                  {ws.custom ? <MinaM color={ws.color} /> : ws.Icon && <ws.Icon size={14} style={{ color: ws.color }} />}
                </div>
                <ArrowRight size={12} style={{ color: "var(--text-muted)" }} className="transition-transform group-hover:translate-x-0.5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                  {ws.label}
                </p>
                <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.45)" }}>
                  {ws.sub}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
