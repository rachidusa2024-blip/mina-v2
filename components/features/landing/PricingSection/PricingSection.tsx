"use client";

import { useState } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import PricingCard from "./PricingCard";
import ComingSoonModal from "./ComingSoonModal";
import Link from "next/link";

const TIERS = {
  en: [
    {
      tier: "Free",
      price: "$0",
      description: "For people who need a first step.",
      features: [
        "Onboarding & situation assessment",
        "Limited Mina Coach",
        "Stabilization tools",
        "1 document explanation per month",
      ],
      ctaLabel: "Start Free",
      isFree: true,
      accentColor: "#8892A4",
      accentDim: "rgba(136,146,164,0.1)",
      highlighted: false,
    },
    {
      tier: "Relief",
      price: "$9.99",
      period: "/mo",
      description: "For clarity and emotional support.",
      features: [
        "Full Mina Coach access",
        "I Don't Know What To Do",
        "Fear → Reality",
        "3 document explanations per month",
        "Basic letters",
        "English + Spanish",
      ],
      ctaLabel: "Choose Relief",
      isFree: false,
      accentColor: "#818CF8",
      accentDim: "rgba(129,140,248,0.1)",
      highlighted: false,
    },
    {
      tier: "Protection",
      price: "$19.99",
      period: "/mo",
      description: "Best for active pressure.",
      features: [
        "Everything in Relief",
        "Live Call Assistant",
        "Decision Shield",
        "Unlimited document explanations",
        "Letters & responses",
        "Timeline",
        "Call summaries",
      ],
      ctaLabel: "Choose Protection",
      isFree: false,
      accentColor: "#00C9A7",
      accentDim: "rgba(0,201,167,0.1)",
      highlighted: true,
    },
    {
      tier: "Recovery",
      price: "$29.99",
      period: "/mo",
      description: "For rebuilding control.",
      features: [
        "Everything in Protection",
        "Recovery System",
        "Advanced Mina Memory",
        "Progress tracking",
        "Legal-support routing",
      ],
      ctaLabel: "Choose Recovery",
      isFree: false,
      accentColor: "#C9A84C",
      accentDim: "rgba(201,168,76,0.1)",
      highlighted: false,
    },
  ],
  es: [
    {
      tier: "Gratis",
      price: "$0",
      description: "Para personas que necesitan un primer paso.",
      features: [
        "Incorporación y evaluación de situación",
        "Mina Coach limitado",
        "Herramientas de estabilización",
        "1 explicación de documento por mes",
      ],
      ctaLabel: "Comenzar Gratis",
      isFree: true,
      accentColor: "#8892A4",
      accentDim: "rgba(136,146,164,0.1)",
      highlighted: false,
    },
    {
      tier: "Alivio",
      price: "$9.99",
      period: "/mes",
      description: "Para claridad y apoyo emocional.",
      features: [
        "Acceso completo a Mina Coach",
        "No Sé Qué Hacer",
        "Miedo → Realidad",
        "3 explicaciones de documentos por mes",
        "Cartas básicas",
        "Inglés + Español",
      ],
      ctaLabel: "Elegir Alivio",
      isFree: false,
      accentColor: "#818CF8",
      accentDim: "rgba(129,140,248,0.1)",
      highlighted: false,
    },
    {
      tier: "Protección",
      price: "$19.99",
      period: "/mes",
      description: "El mejor para presión activa.",
      features: [
        "Todo en Alivio",
        "Asistente de Llamada en Vivo",
        "Escudo de Decisiones",
        "Explicaciones de documentos ilimitadas",
        "Cartas y respuestas",
        "Línea de tiempo",
        "Resúmenes de llamadas",
      ],
      ctaLabel: "Elegir Protección",
      isFree: false,
      accentColor: "#00C9A7",
      accentDim: "rgba(0,201,167,0.1)",
      highlighted: true,
    },
    {
      tier: "Recuperación",
      price: "$29.99",
      period: "/mes",
      description: "Para reconstruir el control.",
      features: [
        "Todo en Protección",
        "Sistema de Recuperación",
        "Memoria Avanzada de Mina",
        "Seguimiento de progreso",
        "Orientación de apoyo legal",
      ],
      ctaLabel: "Elegir Recuperación",
      isFree: false,
      accentColor: "#C9A84C",
      accentDim: "rgba(201,168,76,0.1)",
      highlighted: false,
    },
  ],
};

const t = {
  en: {
    eyebrow: "Pricing",
    title: "Start free.",
    titleHighlight: "Grow when ready.",
    subtitle:
      "No credit card required to start. Upgrade only when Mina has already helped you.",
  },
  es: {
    eyebrow: "Precios",
    title: "Comienza gratis.",
    titleHighlight: "Crece cuando estés listo.",
    subtitle:
      "No se requiere tarjeta de crédito para comenzar. Actualiza solo cuando Mina ya te haya ayudado.",
  },
};

interface PricingSectionProps {
  lang: "en" | "es";
}

export default function PricingSection({ lang }: PricingSectionProps) {
  const c = t[lang];
  const tiers = TIERS[lang];
  const [modalOpen, setModalOpen] = useState(false);

  const handleCta = (isFree: boolean) => {
    if (isFree) return; // Free tier links to /onboarding directly
    setModalOpen(true);
  };

  return (
    <section
      id="pricing"
      className="py-20 lg:py-28"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-base) 0%, rgba(10,13,22,1) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <SectionHeader
          eyebrow={c.eyebrow}
          title={c.title}
          titleHighlight={c.titleHighlight}
          subtitle={c.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {tiers.map((tier, i) =>
            tier.isFree ? (
              <Link key={tier.tier} href="/onboarding" className="contents">
                <PricingCard
                  {...tier}
                  index={i}
                  onCta={() => {}}
                />
              </Link>
            ) : (
              <PricingCard
                key={tier.tier}
                {...tier}
                index={i}
                onCta={() => handleCta(tier.isFree)}
              />
            )
          )}
        </div>
      </div>

      <ComingSoonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        lang={lang}
      />
    </section>
  );
}
