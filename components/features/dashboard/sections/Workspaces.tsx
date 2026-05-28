"use client";

import { motion } from "framer-motion";
import {
  Heart, FileText, MessageSquare, Shield,
  Clock, Mail, TrendingUp, Scale, ArrowRight,
} from "lucide-react";
import Link from "next/link";

const WORKSPACES = [
  { label: "Stabilize", route: "/stabilize", icon: Heart, color: "#818CF8" },
  { label: "Documents", route: "/documents", icon: FileText, color: "#00C9A7" },
  { label: "Mina Coach", route: "/chat", icon: MessageSquare, color: "#00C9A7" },
  { label: "Decision Shield", route: "/decisions", icon: Shield, color: "#f59e0b" },
  { label: "Timeline", route: "/timeline", icon: Clock, color: "#818CF8" },
  { label: "Letters", route: "/letters", icon: Mail, color: "#C9A84C" },
  { label: "Recovery", route: "/recovery", icon: TrendingUp, color: "#22c55e" },
  { label: "Legal Support", route: "/legal-support", icon: Scale, color: "#f97316" },
];

export default function Workspaces() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span
          className="text-xs font-semibold tracking-widest uppercase px-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
        >
          Workspaces
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WORKSPACES.map((ws, i) => {
          const Icon = ws.icon;
          return (
            <motion.div
              key={ws.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <Link
                href={ws.route}
                className="group flex items-center justify-between gap-3 p-4 rounded-xl transition-all duration-150 block"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = `1px solid ${ws.color}30`;
                  (e.currentTarget as HTMLElement).style.background = `${ws.color}06`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid var(--border)";
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ws.color}12` }}
                  >
                    <Icon size={15} style={{ color: ws.color }} />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
                  >
                    {ws.label}
                  </span>
                </div>
                <ArrowRight
                  size={13}
                  style={{ color: "var(--text-muted)", flexShrink: 0 }}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
