"use client";

import { motion } from "framer-motion";
import {
  Activity, Files, ShieldCheck,
  Milestone, ScrollText, MountainSnow, Scale, ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mina Coach uses custom M lettermark instead of a generic icon
function MinaM({ color }: { color: string }) {
  return (
    <div className="w-4 h-4 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: `${color}25`, color, fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", lineHeight: 1 }}>
      M
    </div>
  );
}

const WORKSPACES = [
  { label: "Stabilize",       route: "/stabilize",     Icon: Activity,     color: "#818CF8", hasCustom: false },
  { label: "Documents",       route: "/documents",     Icon: Files,        color: "#00C9A7", hasCustom: false },
  { label: "Mina Coach",      route: "/chat",          Icon: null,         color: "#00C9A7", hasCustom: true  },
  { label: "Decision Shield", route: "/decisions",     Icon: ShieldCheck,  color: "#f59e0b", hasCustom: false },
  { label: "Timeline",        route: "/timeline",      Icon: Milestone,    color: "#818CF8", hasCustom: false },
  { label: "Letters",         route: "/letters",       Icon: ScrollText,   color: "#C9A84C", hasCustom: false },
  { label: "Recovery",        route: "/recovery",      Icon: MountainSnow, color: "#22c55e", hasCustom: false },
  { label: "Legal Support",   route: "/legal-support", Icon: Scale,        color: "#f97316", hasCustom: false },
];

export default function Workspaces() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          Workspaces
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WORKSPACES.map((ws, i) => (
          <motion.div key={ws.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
            <Link href={ws.route}
              className="group flex items-center justify-between gap-3 p-4 rounded-xl transition-all duration-150 block"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.border = `1px solid ${ws.color}35`;
                el.style.background = `${ws.color}07`;
                el.style.boxShadow = `0 4px 20px ${ws.color}0a`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.border = "1px solid var(--border)";
                el.style.background = "var(--bg-card)";
                el.style.boxShadow = "none";
              }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ws.color}14` }}>
                  {ws.hasCustom
                    ? <MinaM color={ws.color} />
                    : ws.Icon && <ws.Icon size={15} style={{ color: ws.color }} />
                  }
                </div>
                <span className="text-sm font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                  {ws.label}
                </span>
              </div>
              <ArrowRight size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }}
                className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
