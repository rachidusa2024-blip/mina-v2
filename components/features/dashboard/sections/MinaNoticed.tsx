"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface MinaNoticedProps {
  observation: string;
}

export default function MinaNoticed({ observation }: MinaNoticedProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <div
        className="flex gap-4 p-6 rounded-2xl"
        style={{
          background: "rgba(129,140,248,0.05)",
          border: "1px solid rgba(129,140,248,0.15)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(129,140,248,0.12)" }}
        >
          <Eye size={16} style={{ color: "#818CF8" }} />
        </div>

        <div className="flex flex-col gap-1.5">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#818CF8" }}
          >
            Mina noticed
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              color: "var(--text-prime)",
              fontStyle: "italic",
            }}
          >
            "{observation}"
          </p>
        </div>
      </div>
    </motion.section>
  );
}
