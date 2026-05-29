"use client";

import { motion } from "framer-motion";
import { Activity, Files, ShieldCheck, Milestone, ScrollText, MountainSnow, Scale, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

function MinaM({ color }: { color: string }) {
  return (
    <div className="w-4 h-4 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: `${color}25`, color, fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", lineHeight: 1 }}>
      M
    </div>
  );
}

const TOOLS = [
  { label: "Slow Things Down",   detail: "Stabilize",        route: "/stabilize",     Icon: Activity,     color: "#818CF8", custom: false },
  { label: "Talk To Mina",       detail: "Mina Coach",       route: "/chat",          Icon: null,         color: "#00C9A7", custom: true  },
  { label: "Understand Documents", detail: "Document Analysis", route: "/documents",   Icon: Files,        color: "#00C9A7", custom: false },
  { label: "Know Your Options",  detail: "Legal Support",    route: "/legal-support", Icon: Scale,        color: "#f97316", custom: false },
  { label: "Response Letters",   detail: "Letters",          route: "/letters",       Icon: ScrollText,   color: "#C9A84C", custom: false },
  { label: "Decision Shield",    detail: "Decisions",        route: "/decisions",     Icon: ShieldCheck,  color: "#f59e0b", custom: false },
  { label: "Live Call Assistant", detail: "Call Support",    route: "/live-call",     Icon: Phone,        color: "#ef4444", custom: false },
  { label: "Getting Your Life Back", detail: "Recovery",     route: "/recovery",      Icon: MountainSnow, color: "#22c55e", custom: false },
];

export default function ToolsAvailableTo() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          Tools Available to You
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TOOLS.map((tool, i) => (
          <motion.div key={tool.route}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
            <Link href={tool.route}
              className="group flex flex-col gap-2.5 p-4 rounded-xl transition-all duration-150 block h-full"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.border = `1px solid ${tool.color}35`;
                el.style.background = `${tool.color}07`;
                el.style.boxShadow = `0 4px 20px ${tool.color}0a`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.border = "1px solid var(--border)";
                el.style.background = "var(--bg-card)";
                el.style.boxShadow = "none";
              }}>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tool.color}14` }}>
                  {tool.custom ? <MinaM color={tool.color} /> : tool.Icon && <tool.Icon size={15} style={{ color: tool.color }} />}
                </div>
                <ArrowRight size={12} style={{ color: "var(--text-muted)" }}
                  className="transition-transform group-hover:translate-x-0.5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                  {tool.label}
                </p>
                <p className="text-xs mt-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.4)" }}>
                  {tool.detail}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
