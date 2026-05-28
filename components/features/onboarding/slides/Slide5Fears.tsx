"use client";

import {
  Gavel, TrendingDown, DollarSign, AlertTriangle,
  MessageSquare, FileX, Infinity, Users, HelpCircle,
} from "lucide-react";
import SelectableCard from "../SelectableCard";

const OPTIONS = {
  en: [
    { key: "Being sued", icon: Gavel },
    { key: "Wage garnishment", icon: DollarSign },
    { key: "Ruining my credit", icon: TrendingDown },
    { key: "Losing control financially", icon: AlertTriangle },
    { key: "Saying the wrong thing", icon: MessageSquare },
    { key: "Making a bad agreement", icon: FileX },
    { key: "Never getting out of debt", icon: Infinity },
    { key: "My family being affected", icon: Users },
    { key: "I'm not sure", icon: HelpCircle },
  ],
  es: [
    { key: "Ser demandado", icon: Gavel },
    { key: "Embargo de salario", icon: DollarSign },
    { key: "Arruinar mi crédito", icon: TrendingDown },
    { key: "Perder el control financiero", icon: AlertTriangle },
    { key: "Decir lo incorrecto", icon: MessageSquare },
    { key: "Hacer un mal acuerdo", icon: FileX },
    { key: "Nunca salir de deudas", icon: Infinity },
    { key: "Que mi familia se vea afectada", icon: Users },
    { key: "No estoy seguro", icon: HelpCircle },
  ],
};

const t = {
  en: {
    headline: "What worries you most right now?",
    sub: "Select all that apply.",
    cta: "Continue",
    skip: "Skip this",
  },
  es: {
    headline: "¿Qué te preocupa más en este momento?",
    sub: "Selecciona todo lo que aplique.",
    cta: "Continuar",
    skip: "Omitir",
  },
};

interface Slide5FearsProps {
  lang: "en" | "es";
  selected: string[];
  onToggle: (item: string) => void;
  onNext: () => void;
}

export default function Slide5Fears({ lang, selected, onToggle, onNext }: Slide5FearsProps) {
  const c = t[lang];
  const options = OPTIONS[lang];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2
          className="leading-tight tracking-tight"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            color: "var(--text-prime)",
          }}
        >
          {c.headline}
        </h2>
        <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
          {c.sub}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <SelectableCard
            key={opt.key}
            icon={opt.icon}
            label={opt.key}
            selected={selected.includes(opt.key)}
            onToggle={() => onToggle(opt.key)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: selected.length > 0 ? "var(--teal)" : "rgba(255,255,255,0.06)",
            color: selected.length > 0 ? "#090D1A" : "var(--text-muted)",
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          {c.cta}
        </button>
        <button
          onClick={onNext}
          className="w-full py-2.5 text-sm transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}
        >
          {c.skip}
        </button>
      </div>
    </div>
  );
}
