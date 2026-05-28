"use client";

import { Headphones, Radio } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CapabilityCard from "./CapabilityCard";

const CARDS = {
  en: [
    {
      icon: Headphones,
      badge: "Available Now",
      badgeColor: "#00C9A7",
      title: "Live Call Assistant",
      description: "Mina is beside you during every difficult call.",
      details: [
        "You type what the caller says",
        "Mina gives you exact wording to use",
        "Pressure detection flags urgency tactics",
        "Key points saved automatically",
      ],
      cta: { label: "Start a Live Session", href: "/onboarding" },
      accentColor: "#00C9A7",
      accentDim: "rgba(0,201,167,0.08)",
      dimmed: false,
    },
    {
      icon: Radio,
      badge: "Coming Soon",
      badgeColor: "#C9A84C",
      title: "Call Through Mina",
      description: "Future: Mina listens and guides in real time.",
      details: [
        "Mina joins the call automatically",
        "Real-time pressure detection",
        "Instant response suggestions",
        "Post-call summary and next steps",
      ],
      disclaimer:
        "Automatic call listening is not yet available. Coming in a future update.",
      accentColor: "#C9A84C",
      accentDim: "rgba(201,168,76,0.08)",
      dimmed: true,
    },
  ],
  es: [
    {
      icon: Headphones,
      badge: "Disponible Ahora",
      badgeColor: "#00C9A7",
      title: "Asistente de Llamada en Vivo",
      description: "Mina está contigo durante cada llamada difícil.",
      details: [
        "Tú escribes lo que dice el llamante",
        "Mina te da las palabras exactas a usar",
        "Detección de presión y tácticas de urgencia",
        "Puntos clave guardados automáticamente",
      ],
      cta: { label: "Iniciar Sesión en Vivo", href: "/onboarding" },
      accentColor: "#00C9A7",
      accentDim: "rgba(0,201,167,0.08)",
      dimmed: false,
    },
    {
      icon: Radio,
      badge: "Próximamente",
      badgeColor: "#C9A84C",
      title: "Llamada a través de Mina",
      description: "Futuro: Mina escucha y guía en tiempo real.",
      details: [
        "Mina se une automáticamente",
        "Detección de presión en tiempo real",
        "Sugerencias instantáneas",
        "Resumen post-llamada y próximos pasos",
      ],
      disclaimer:
        "La escucha automática de llamadas aún no está disponible. Llegará en una actualización futura.",
      accentColor: "#C9A84C",
      accentDim: "rgba(201,168,76,0.08)",
      dimmed: true,
    },
  ],
};

const t = {
  en: {
    eyebrow: "Live Call Center",
    title: "Do not face difficult financial",
    titleHighlight: "calls alone.",
    subtitle:
      "When a collector calls, Mina is immediately beside you — giving you the right words, flagging pressure tactics, and keeping a record of what was said.",
  },
  es: {
    eyebrow: "Centro de Llamadas en Vivo",
    title: "No enfrentes llamadas financieras difíciles",
    titleHighlight: "solo.",
    subtitle:
      "Cuando un cobrador llama, Mina está inmediatamente a tu lado — dándote las palabras correctas, señalando tácticas de presión y llevando un registro de lo que se dijo.",
  },
};

interface LiveCallSectionProps {
  lang: "en" | "es";
}

export default function LiveCallSection({ lang }: LiveCallSectionProps) {
  const c = t[lang];
  const cards = CARDS[lang];

  return (
    <section
      id="live-call"
      className="py-20 lg:py-28"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <SectionHeader
          eyebrow={c.eyebrow}
          title={c.title}
          titleHighlight={c.titleHighlight}
          subtitle={c.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <CapabilityCard key={card.title} {...card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

