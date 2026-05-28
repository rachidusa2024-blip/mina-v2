"use client";

import { Heart, Shield, TrendingUp } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import SystemPillar from "./SystemPillar";

const PILLARS = {
  en: [
    {
      icon: Heart,
      title: "Stabilize",
      accentColor: "#818CF8",
      accentDim: "rgba(129,140,248,0.1)",
      items: [
        "I don't know what to do",
        "Fear → Reality",
        "Stay With Me",
      ],
    },
    {
      icon: Shield,
      title: "Protect",
      accentColor: "#00C9A7",
      accentDim: "rgba(0,201,167,0.1)",
      items: [
        "Live Call Assistant",
        "Document Intelligence",
        "Decision Shield",
      ],
    },
    {
      icon: TrendingUp,
      title: "Recover",
      accentColor: "#C9A84C",
      accentDim: "rgba(201,168,76,0.1)",
      items: [
        "Timeline",
        "Recovery Journey",
        "Stability rebuilding",
      ],
    },
  ],
  es: [
    {
      icon: Heart,
      title: "Estabilizar",
      accentColor: "#818CF8",
      accentDim: "rgba(129,140,248,0.1)",
      items: [
        "No sé qué hacer",
        "Miedo → Realidad",
        "Estoy contigo",
      ],
    },
    {
      icon: Shield,
      title: "Proteger",
      accentColor: "#00C9A7",
      accentDim: "rgba(0,201,167,0.1)",
      items: [
        "Asistente de llamadas",
        "Inteligencia documental",
        "Escudo de decisiones",
      ],
    },
    {
      icon: TrendingUp,
      title: "Recuperar",
      accentColor: "#C9A84C",
      accentDim: "rgba(201,168,76,0.1)",
      items: [
        "Línea de tiempo",
        "Viaje de recuperación",
        "Reconstrucción de estabilidad",
      ],
    },
  ],
};

const t = {
  en: {
    eyebrow: "The Mina System",
    title: "Mina helps you move from",
    titleHighlight: "panic to control.",
    subtitle:
      "Three interconnected systems that work together before, during, and after financial pressure — not just in the moment of a call.",
  },
  es: {
    eyebrow: "El Sistema Mina",
    title: "Mina te ayuda a pasar del",
    titleHighlight: "pánico al control.",
    subtitle:
      "Tres sistemas interconectados que trabajan juntos antes, durante y después de la presión financiera — no solo en el momento de una llamada.",
  },
};

interface MinaSystemSectionProps {
  lang: "en" | "es";
}

export default function MinaSystemSection({ lang }: MinaSystemSectionProps) {
  const c = t[lang];
  const pillars = PILLARS[lang];

  return (
    <section
      id="how-mina-works"
      className="py-20 lg:py-28"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-base) 0%, rgba(15,22,35,1) 50%, var(--bg-base) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <SectionHeader
          eyebrow={c.eyebrow}
          title={c.title}
          titleHighlight={c.titleHighlight}
          subtitle={c.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((pillar, i) => (
            <SystemPillar
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title}
              accentColor={pillar.accentColor}
              accentDim={pillar.accentDim}
              items={pillar.items}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

