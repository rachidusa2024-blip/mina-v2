"use client";

import {
  Phone, CreditCard, Stethoscope, FileWarning,
  Gavel, Landmark, Scale, Layers, HelpCircle,
} from "lucide-react";
import SelectableCard from "../SelectableCard";

const OPTIONS = {
  en: [
    { key: "Debt collectors", icon: Phone },
    { key: "Missed payments", icon: CreditCard },
    { key: "Credit cards", icon: CreditCard },
    { key: "Medical debt", icon: Stethoscope },
    { key: "IRS / taxes", icon: FileWarning },
    { key: "Personal loans", icon: Landmark },
    { key: "Lawsuit or legal notices", icon: Scale },
    { key: "Multiple debts", icon: Layers },
    { key: "I'm overwhelmed and not sure", icon: HelpCircle },
  ],
  es: [
    { key: "Cobradores de deudas", icon: Phone },
    { key: "Pagos perdidos", icon: CreditCard },
    { key: "Tarjetas de crédito", icon: CreditCard },
    { key: "Deuda médica", icon: Stethoscope },
    { key: "IRS / impuestos", icon: FileWarning },
    { key: "Préstamos personales", icon: Landmark },
    { key: "Demandas o avisos legales", icon: Scale },
    { key: "Múltiples deudas", icon: Layers },
    { key: "Estoy abrumado y no estoy seguro", icon: HelpCircle },
  ],
};

const t = {
  en: {
    headline: "What's putting the most pressure on you right now?",
    sub: "Select all that apply.",
    cta: "Continue",
    other: "Something else",
  },
  es: {
    headline: "¿Qué te está generando más presión en este momento?",
    sub: "Selecciona todo lo que aplique.",
    cta: "Continuar",
    other: "Algo más",
  },
};

interface Slide2PressureProps {
  lang: "en" | "es";
  selected: string[];
  onToggle: (item: string) => void;
  onNext: () => void;
}

export default function Slide2Pressure({ lang, selected, onToggle, onNext }: Slide2PressureProps) {
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
    </div>
  );
}
