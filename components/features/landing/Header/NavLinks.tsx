"use client";

const t = {
  en: {
    howMinaWorks: "How Mina Works",
    liveCall: "Live Call",
    debtRecovery: "Debt Recovery",
    legalSupport: "Legal Support",
  },
  es: {
    howMinaWorks: "Cómo Funciona",
    liveCall: "Llamada en Vivo",
    debtRecovery: "Recuperación",
    legalSupport: "Apoyo Legal",
  },
};

const NAV_ITEMS = (lang: "en" | "es") => [
  { label: t[lang].howMinaWorks, href: "#how-mina-works" },
  { label: t[lang].liveCall, href: "#live-call" },
  { label: t[lang].debtRecovery, href: "#debt-recovery" },
  { label: t[lang].legalSupport, href: "#legal-support" },
];

interface NavLinksProps {
  lang: "en" | "es";
  onClose?: () => void;
  vertical?: boolean;
}

export default function NavLinks({ lang, onClose, vertical = false }: NavLinksProps) {
  const items = NAV_ITEMS(lang);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onClose?.();
  };

  return (
    <nav className={`flex ${vertical ? "flex-col gap-1" : "flex-row gap-0.5"}`}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          className={`text-sm font-medium transition-colors duration-150 rounded-md ${
            vertical
              ? "px-4 py-3 w-full"
              : "px-3 py-2"
          }`}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--text-muted)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text-prime)";
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

