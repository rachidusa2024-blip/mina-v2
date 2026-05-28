"use client";

import { motion } from "framer-motion";
import { HandHelping, Scale, AlertCircle, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const CARDS = {
  en: [
    {
      icon: HandHelping,
      accentColor: "#818CF8",
      accentDim: "rgba(129,140,248,0.09)",
      title: "If cost is a concern",
      description: "Free and low-cost legal help exists. Mina can help you find it.",
      resources: [
        { name: "Legal Aid Society", detail: "Free legal help for qualifying individuals" },
        { name: "CFPB", detail: "Consumer Financial Protection Bureau — free resources" },
        { name: "NFCC", detail: "National Foundation for Credit Counseling" },
        { name: "Consumer law clinics", detail: "Law school clinics that take FDCPA cases" },
      ],
    },
    {
      icon: Scale,
      accentColor: "#C9A84C",
      accentDim: "rgba(201,168,76,0.09)",
      title: "When you need an attorney",
      description: "Some consumer protection cases cost you nothing out of pocket.",
      resources: [
        { name: "NACA", detail: "National Association of Consumer Advocates — find an attorney" },
        { name: "FDCPA cases", detail: "Attorneys often work on contingency — you pay nothing" },
        { name: "Lawsuit defense", detail: "Act before a default judgment is entered" },
        { name: "Free consultations", detail: "Many consumer attorneys offer first consult free" },
      ],
    },
  ],
  es: [
    {
      icon: HandHelping,
      accentColor: "#818CF8",
      accentDim: "rgba(129,140,248,0.09)",
      title: "Si el costo es una preocupación",
      description: "Existe ayuda legal gratuita y de bajo costo. Mina puede ayudarte a encontrarla.",
      resources: [
        { name: "Legal Aid Society", detail: "Ayuda legal gratuita para personas calificadas" },
        { name: "CFPB", detail: "Oficina de Protección Financiera del Consumidor" },
        { name: "NFCC", detail: "Fundación Nacional de Asesoramiento de Crédito" },
        { name: "Clínicas jurídicas", detail: "Clínicas de facultades de derecho para casos FDCPA" },
      ],
    },
    {
      icon: Scale,
      accentColor: "#C9A84C",
      accentDim: "rgba(201,168,76,0.09)",
      title: "Cuando necesitas un abogado",
      description: "Algunos casos de protección al consumidor no te cuestan nada de tu bolsillo.",
      resources: [
        { name: "NACA", detail: "Asociación Nacional de Defensores del Consumidor" },
        { name: "Casos FDCPA", detail: "Los abogados suelen trabajar en contingencia" },
        { name: "Defensa por demandas", detail: "Actúa antes de que se emita un fallo en rebeldía" },
        { name: "Consultas gratuitas", detail: "Muchos abogados de consumidor ofrecen primera consulta gratis" },
      ],
    },
  ],
};

const t = {
  en: {
    eyebrow: "Legal Support",
    title: "Know your options.",
    titleHighlight: "Real resources exist.",
    subtitle:
      "Mina is not an attorney and cannot provide legal representation. But Mina can help you understand what legal resources are available and when you should use them.",
    disclaimer:
      "Mina does not replace attorneys and does not provide legal representation. Mina will never use fear to pressure you into unnecessary legal action.",
  },
  es: {
    eyebrow: "Apoyo Legal",
    title: "Conoce tus opciones.",
    titleHighlight: "Existen recursos reales.",
    subtitle:
      "Mina no es abogada y no puede brindar representación legal. Pero Mina puede ayudarte a entender qué recursos legales están disponibles y cuándo usarlos.",
    disclaimer:
      "Mina no reemplaza a los abogados y no brinda representación legal. Mina nunca usará el miedo para presionarte a tomar acciones legales innecesarias.",
  },
};

interface LegalSupportSectionProps {
  lang: "en" | "es";
}

export default function LegalSupportSection({ lang }: LegalSupportSectionProps) {
  const c = t[lang];
  const cards = CARDS[lang];

  return (
    <section
      id="legal-support"
      className="py-20 lg:py-28"
      style={{
        background: "linear-gradient(180deg, var(--bg-base) 0%, rgba(12,15,26,1) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <SectionHeader
          eyebrow={c.eyebrow}
          title={c.title}
          titleHighlight={c.titleHighlight}
          subtitle={c.subtitle}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="flex flex-col gap-5 p-7 rounded-2xl"
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${card.accentColor}25`,
                }}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: card.accentDim }}
                  >
                    <Icon size={20} style={{ color: card.accentColor }} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "var(--text-prime)",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-sm mt-1"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "var(--text-muted)",
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(to right, ${card.accentColor}25, transparent)`,
                  }}
                />

                {/* Resources */}
                <ul className="flex flex-col gap-3">
                  {card.resources.map((r) => (
                    <li key={r.name} className="flex items-start gap-2.5">
                      <ExternalLink
                        size={13}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: card.accentColor, opacity: 0.7 }}
                      />
                      <div>
                        <span
                          className="text-sm font-semibold"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: "var(--text-prime)",
                          }}
                        >
                          {r.name}
                        </span>
                        <span
                          className="text-sm"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: "var(--text-muted)",
                          }}
                        >
                          {" "}— {r.detail}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-start gap-3 px-5 py-4 rounded-xl"
          style={{
            background: "rgba(129,140,248,0.05)",
            border: "1px solid rgba(129,140,248,0.12)",
          }}
        >
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" style={{ color: "#818CF8" }} />
          <p
            className="text-xs leading-relaxed"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(136,146,164,0.8)",
            }}
          >
            {c.disclaimer}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

