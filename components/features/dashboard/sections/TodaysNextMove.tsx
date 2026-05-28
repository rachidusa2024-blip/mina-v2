"use client";

import { motion } from "framer-motion";
import { ArrowRight, Target } from "lucide-react";
import Link from "next/link";

interface TodaysNextMoveProps {
  label: string;
  detail: string;
  route: string;
}

export default function TodaysNextMove({ label, detail, route }: TodaysNextMoveProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <div
        className="flex items-start gap-4 p-5 rounded-2xl"
        style={{
          background: "rgba(129,140,248,0.06)",
          border: "1px solid rgba(129,140,248,0.18)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(129,140,248,0.12)" }}
        >
          <Target size={17} style={{ color: "#818CF8" }} />
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#818CF8" }}
          >
            Today's next move
          </p>
          <p
            className="text-base font-semibold leading-snug"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
          >
            {label}
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
          >
            {detail}
          </p>
        </div>

        <Link
          href={route}
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl transition-all"
          style={{
            background: "rgba(129,140,248,0.12)",
            color: "#818CF8",
            border: "1px solid rgba(129,140,248,0.2)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(129,140,248,0.22)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(129,140,248,0.12)"; }}
        >
          <ArrowRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}
