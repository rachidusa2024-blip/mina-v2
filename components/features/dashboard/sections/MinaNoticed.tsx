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
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
      <div
        className="relative overflow-hidden flex gap-5 p-6 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #0F1220 0%, rgba(129,140,248,0.06) 100%)",
          border: "1px solid rgba(129,140,248,0.18)",
          boxShadow: "0 0 40px rgba(129,140,248,0.04)",
        }}>
        <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 70%)", transform: "translate(20%,-20%)" }} />

        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(129,140,248,0.14)" }}>
          <Eye size={16} style={{ color: "#818CF8" }} />
        </div>

        <div className="flex flex-col gap-2 relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#818CF8" }}>
            Mina noticed
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "var(--text-prime)",
            lineHeight: 1.65,
            fontStyle: "italic",
          }}>
            "{observation}"
          </p>
        </div>
      </div>
    </motion.section>
  );
}
