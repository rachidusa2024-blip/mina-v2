"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
  lang: "en" | "es";
}

const t = {
  en: {
    title: "Plans are coming soon.",
    sub: "Start free today — no credit card required.",
    cta: "Start Free Now",
    close: "Close",
  },
  es: {
    title: "Los planes llegan pronto.",
    sub: "Comienza gratis hoy — sin tarjeta de crédito.",
    cta: "Comenzar Gratis",
    close: "Cerrar",
  },
};

export default function ComingSoonModal({ open, onClose, lang }: ComingSoonModalProps) {
  const c = t[lang];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(9,13,26,0.8)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative w-full max-w-sm p-8 rounded-2xl flex flex-col items-center gap-5 text-center"
              style={{
                background: "#111827",
                border: "1px solid rgba(0,201,167,0.25)",
                boxShadow: "0 0 60px rgba(0,201,167,0.08)",
                pointerEvents: "auto",
              }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(0,201,167,0.1)" }}
              >
                <Sparkles size={22} style={{ color: "var(--teal)" }} />
              </div>

              <div className="flex flex-col gap-2">
                <h3
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-prime)" }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}
                >
                  {c.sub}
                </p>
              </div>

              <Link
                href="/onboarding"
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "var(--teal)",
                  color: "#090D1A",
                }}
              >
                {c.cta}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
