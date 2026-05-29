"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface WhyThisMattersProps {
  title: string;
  items: string[];
}

export default function WhyThisMatters({ title, items }: WhyThisMattersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="rounded-2xl p-6 sm:p-7"
      style={{
        background: "rgba(0,201,167,0.05)",
        border: "1px solid rgba(0,201,167,0.15)",
      }}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm font-semibold"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          {title}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(0,201,167,0.15)" }}>
                <Check size={10} style={{ color: "var(--teal)" }} />
              </div>
              <p className="text-sm leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
