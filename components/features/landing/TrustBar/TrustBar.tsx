"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle, RefreshCw, Shield } from "lucide-react";

const t = {
  en: [
    { icon: Lock, label: "Your data stays private" },
    { icon: CheckCircle, label: "No credit card required" },
    { icon: RefreshCw, label: "Cancel anytime" },
    { icon: Shield, label: "FDCPA & FCRA guidance" },
  ],
  es: [
    { icon: Lock, label: "Tus datos son privados" },
    { icon: CheckCircle, label: "Sin tarjeta de crédito" },
    { icon: RefreshCw, label: "Cancela cuando quieras" },
    { icon: Shield, label: "Guía FDCPA & FCRA" },
  ],
};

interface TrustBarProps {
  lang: "en" | "es";
}

export default function TrustBar({ lang }: TrustBarProps) {
  const items = t[lang];

  return (
    <div
      className="relative"
      style={{
        background: "rgba(255,255,255,0.018)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 py-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-2"
              >
                <Icon
                  size={14}
                  style={{ color: "var(--teal)", flexShrink: 0 }}
                />
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--text-muted)",
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

