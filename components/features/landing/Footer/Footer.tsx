"use client";

import Link from "next/link";

const t = {
  en: {
    tagline: "Financial Pressure Recovery Intelligence",
    links: [
      { label: "Support", href: "/support" },
      { label: "Contact", href: "/support" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
    disclaimer:
      "Mina provides educational guidance and decision support. Mina is not a law firm, financial advisor, credit repair company, or emergency service.",
    copyright: (year: number) =>
      `© ${year} Sum Goals. All rights reserved.`,
  },
  es: {
    tagline: "Inteligencia de Recuperación de Presión Financiera",
    links: [
      { label: "Soporte", href: "/support" },
      { label: "Contacto", href: "/support" },
      { label: "Privacidad", href: "/privacy" },
      { label: "Términos", href: "/terms" },
      { label: "Aviso Legal", href: "/disclaimer" },
    ],
    disclaimer:
      "Mina proporciona orientación educativa y apoyo en la toma de decisiones. Mina no es un bufete de abogados, asesor financiero, empresa de reparación de crédito ni servicio de emergencia.",
    copyright: (year: number) =>
      `© ${year} Sum Goals. Todos los derechos reservados.`,
  },
};

interface FooterProps {
  lang: "en" | "es";
}

export default function Footer({ lang }: FooterProps) {
  const c = t[lang];
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-12"
      style={{
        background: "#060810",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--teal)", color: "#090D1A" }}
              >
                S
              </div>
              <span
                className="text-sm font-semibold"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-prime)",
                }}
              >
                Sum Goals
              </span>
            </div>
            <p
              className="text-xs"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "var(--text-muted)",
              }}
            >
              {c.tagline}
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {c.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs transition-colors duration-150"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--text-muted)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-prime)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: "var(--border)" }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p
            className="text-xs leading-relaxed max-w-2xl"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(136,146,164,0.55)",
            }}
          >
            {c.disclaimer}
          </p>
          <p
            className="text-xs whitespace-nowrap flex-shrink-0"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(136,146,164,0.35)",
            }}
          >
            {c.copyright(year)}
          </p>
        </div>

      </div>
    </footer>
  );
}
