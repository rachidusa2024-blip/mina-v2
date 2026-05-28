"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import NavLinks from "./NavLinks";
import LanguageToggle from "./LanguageToggle";
import MobileMenu from "./MobileMenu";

const t = {
  en: { signIn: "Sign In", startFree: "Start Free" },
  es: { signIn: "Iniciar Sesión", startFree: "Comenzar Gratis" },
};

interface HeaderProps {
  lang: "en" | "es";
  onToggleLang: (l: "en" | "es") => void;
}

export default function Header({ lang, onToggleLang }: HeaderProps) {
  const copy = t[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 transition-all duration-300"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: scrolled
            ? "rgba(9,13,26,0.88)"
            : "rgba(9,13,26,0.60)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <button
              onClick={scrollTop}
              className="flex items-center gap-2 select-none"
              aria-label="Sum Goals — scroll to top"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--teal)", color: "#090D1A" }}
              >
                S
              </div>
              <span
                className="text-sm font-semibold hidden sm:block"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-prime)",
                  letterSpacing: "0.01em",
                }}
              >
                Sum Goals
              </span>
            </button>

            {/* Desktop center nav */}
            <div className="hidden lg:flex">
              <NavLinks lang={lang} />
            </div>

            {/* Desktop right */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle lang={lang} onToggle={onToggleLang} />

              <Link
                href="/signin"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-muted)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-prime)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
              >
                {copy.signIn}
              </Link>

              <Link
                href="/onboarding"
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all duration-150"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "var(--teal)",
                  color: "#090D1A",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#00e0bc";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--teal)";
                }}
              >
                {copy.startFree}
              </Link>
            </div>

            {/* Mobile right */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageToggle lang={lang} onToggle={onToggleLang} compact />
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-md"
                style={{ color: "var(--text-muted)" }}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>

          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        lang={lang}
        onToggleLang={onToggleLang}
      />
    </>
  );
}
