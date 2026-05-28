"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const t = {
  en: {
    start: "Start Free",
    demo: "See Mina in Action",
    trust: "Built for debt collectors, missed payments, medical bills, IRS notices, and financial pressure.",
  },
  es: {
    start: "Comenzar Gratis",
    demo: "Ver Mina en Acción",
    trust: "Diseñado para cobradores, pagos perdidos, facturas médicas, avisos del IRS y presión financiera.",
  },
};

interface HeroCTAsProps {
  lang: "en" | "es";
}

export default function HeroCTAs({ lang }: HeroCTAsProps) {
  const c = t[lang];

  const scrollToLiveCall = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector("#live-call");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="flex flex-col gap-4"
    >
      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/onboarding"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--teal)",
            color: "#090D1A",
            boxShadow: "0 0 28px rgba(0,201,167,0.25)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#00ddb8";
            el.style.boxShadow = "0 0 36px rgba(0,201,167,0.38)";
            el.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "var(--teal)";
            el.style.boxShadow = "0 0 28px rgba(0,201,167,0.25)";
            el.style.transform = "translateY(0)";
          }}
        >
          {c.start}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>

        <a
          href="#live-call"
          onClick={scrollToLiveCall}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--text-prime)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(255,255,255,0.08)";
            el.style.borderColor = "rgba(255,255,255,0.16)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(255,255,255,0.05)";
            el.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          <Play size={13} fill="currentColor" />
          {c.demo}
        </a>
      </div>

      {/* Trust line */}
      <p
        className="text-xs leading-relaxed max-w-sm"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(136,146,164,0.7)",
        }}
      >
        {c.trust}
      </p>
    </motion.div>
  );
}

