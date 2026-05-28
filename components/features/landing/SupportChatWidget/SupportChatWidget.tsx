"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const QA = {
  en: [
    {
      q: "What is Mina?",
      a: "Mina is a financial pressure recovery intelligence system. She helps you understand what is happening when you receive collector calls, confusing letters, or IRS notices — and guides you on what to do next.",
    },
    {
      q: "Is Mina free?",
      a: "Yes. Mina has a free tier that gives you access to core tools — including the Stabilize feature and basic onboarding. Premium features like Document Intelligence and Live Call assistance require a paid plan.",
    },
    {
      q: "Can Mina listen to calls automatically?",
      a: "Not yet. Currently, you type what the caller says and Mina responds with exact wording and pressure guidance. Automatic call listening is a future feature currently in development.",
    },
    {
      q: "What documents can I upload?",
      a: "You can upload debt collection letters, credit reports, medical bills, IRS notices, court summons, and other financial documents. Mina analyzes them and can generate response letters citing applicable US consumer protection law.",
    },
    {
      q: "Is my information safe?",
      a: "Yes. Your data is stored securely and never shared or sold. Each user's data is completely isolated. Mina does not share your financial situation with any third party.",
    },
    {
      q: "I'm being sued. Can Mina help?",
      a: "Mina can help you understand what the lawsuit documents mean, what your rights are under the FDCPA and FCRA, and what options may be available. However, Mina is not an attorney. If you are being sued, Mina will guide you toward appropriate legal resources.",
    },
  ],
  es: [
    {
      q: "¿Qué es Mina?",
      a: "Mina es un sistema de inteligencia de recuperación de presión financiera. Te ayuda a entender lo que está pasando cuando recibes llamadas de cobradores, cartas confusas o avisos del IRS — y te guía sobre qué hacer a continuación.",
    },
    {
      q: "¿Es Mina gratuita?",
      a: "Sí. Mina tiene un nivel gratuito que te da acceso a herramientas principales — incluyendo la función de Estabilización e incorporación básica. Las funciones premium como Inteligencia Documental y asistencia de llamadas en vivo requieren un plan de pago.",
    },
    {
      q: "¿Puede Mina escuchar llamadas automáticamente?",
      a: "Todavía no. Actualmente, escribes lo que dice el llamante y Mina responde con las palabras exactas y orientación de presión. La escucha automática de llamadas es una función futura actualmente en desarrollo.",
    },
    {
      q: "¿Qué documentos puedo subir?",
      a: "Puedes subir cartas de cobro de deudas, informes de crédito, facturas médicas, avisos del IRS, citaciones judiciales y otros documentos financieros. Mina los analiza y puede generar cartas de respuesta citando la ley de protección al consumidor de EE.UU.",
    },
    {
      q: "¿Está segura mi información?",
      a: "Sí. Tus datos se almacenan de forma segura y nunca se comparten ni venden. Los datos de cada usuario están completamente aislados. Mina no comparte tu situación financiera con ningún tercero.",
    },
    {
      q: "Me están demandando. ¿Puede Mina ayudar?",
      a: "Mina puede ayudarte a entender lo que significan los documentos de la demanda, cuáles son tus derechos bajo la FDCPA y FCRA, y qué opciones pueden estar disponibles. Sin embargo, Mina no es abogada. Si te están demandando, Mina te guiará hacia recursos legales apropiados.",
    },
  ],
};

const t = {
  en: {
    eyebrow: "Support",
    title: "Common questions,",
    titleHighlight: "honest answers.",
  },
  es: {
    eyebrow: "Soporte",
    title: "Preguntas frecuentes,",
    titleHighlight: "respuestas honestas.",
  },
};

interface SupportChatWidgetProps {
  lang: "en" | "es";
}

export default function SupportChatWidget({ lang }: SupportChatWidgetProps) {
  const c = t[lang];
  const items = QA[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="py-20 lg:py-28"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(0,201,167,0.1)" }}
          >
            <MessageCircle size={18} style={{ color: "var(--teal)" }} />
          </div>
          <SectionHeader
            eyebrow={c.eyebrow}
            title={c.title}
            titleHighlight={c.titleHighlight}
          />
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-xl overflow-hidden"
              style={{
                border: openIndex === i
                  ? "1px solid rgba(0,201,167,0.22)"
                  : "1px solid var(--border)",
                background: openIndex === i
                  ? "rgba(0,201,167,0.04)"
                  : "var(--bg-card)",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span
                  className="text-sm font-semibold pr-4"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: openIndex === i ? "var(--teal)" : "var(--text-prime)",
                    transition: "color 0.2s",
                  }}
                >
                  {item.q}
                </span>
                {openIndex === i ? (
                  <ChevronUp size={16} style={{ color: "var(--teal)", flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                )}
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      className="px-5 pb-5 text-sm leading-relaxed"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "var(--text-muted)",
                      }}
                    >
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
