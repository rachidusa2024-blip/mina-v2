"use client";

import SectionHeader from "@/components/shared/SectionHeader";
import PressureGrid from "./PressureGrid";
import { motion } from "framer-motion";

const t = {
  en: {
    eyebrow: "What Mina handles",
    title: "Financial pressure is not only",
    titleHighlight: "about money.",
    subtitle:
      "Debt pressure can make people panic, avoid calls, misunderstand letters, and agree to things they do not fully understand. Mina helps you stay clear when everything feels urgent.",
  },
  es: {
    eyebrow: "Lo que maneja Mina",
    title: "La presión financiera no es solo",
    titleHighlight: "sobre el dinero.",
    subtitle:
      "La presión de deudas puede hacer que las personas entren en pánico, eviten llamadas, malinterpreten cartas y acuerden cosas que no entienden completamente. Mina te ayuda a mantenerte claro cuando todo se siente urgente.",
  },
};

interface PressureSectionProps {
  lang: "en" | "es";
}

export default function PressureSection({ lang }: PressureSectionProps) {
  const c = t[lang];

  return (
    <section
      id="debt-recovery"
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
        <PressureGrid lang={lang} />
      </div>
    </section>
  );
}
