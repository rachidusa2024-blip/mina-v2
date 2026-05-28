"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavLinks from "./NavLinks";
import LanguageToggle from "./LanguageToggle";
import Link from "next/link";

const t = {
  en: { signIn: "Sign In", startFree: "Start Free" },
  es: { signIn: "Iniciar Sesión", startFree: "Comenzar Gratis" },
};

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  lang: "en" | "es";
  onToggleLang: (l: "en" | "es") => void;
}

export default function MobileMenu({ open, onClose, lang, onToggleLang }: MobileMenuProps) {
  const copy = t[lang];

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(9,13,26,0.7)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 flex flex-col"
            style={{
              background: "#0D1221",
              borderLeft: "1px solid var(--border)",
            }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-prime)" }}
              >
                Menu
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-prime)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
              <NavLinks lang={lang} onClose={onClose} vertical />
            </div>

            {/* Bottom */}
            <div
              className="px-6 py-6 flex flex-col gap-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <LanguageToggle lang={lang} onToggle={onToggleLang} />

              <Link
                href="/signin"
                onClick={onClose}
                className="w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-prime)",
                  border: "1px solid var(--border)",
                }}
              >
                {copy.signIn}
              </Link>

              <Link
                href="/onboarding"
                onClick={onClose}
                className="w-full text-center py-2.5 rounded-lg text-sm font-bold transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "var(--teal)",
                  color: "#090D1A",
                }}
              >
                {copy.startFree}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
