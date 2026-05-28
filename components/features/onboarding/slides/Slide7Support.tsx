"use client";

import SelectableChip from "../SelectableChip";

const OPTIONS = {
  en: [
    "Calm and reassuring",
    "Direct and strategic",
    "Step-by-step guidance",
    "Fast answers",
    "Emotional clarity first",
    "Strong negotiation support",
  ],
  es: [
    "Calmada y tranquilizadora",
    "Directa y estratégica",
    "Orientación paso a paso",
    "Respuestas rápidas",
    "Claridad emocional primero",
    "Apoyo sólido en negociación",
  ],
};

const t = {
  en: {
    headline: "How should Mina support you?",
    sub: "This personalizes how Mina communicates with you.",
    cta: "Continue",
  },
  es: {
    headline: "¿Cómo debería apoyarte Mina?",
    sub: "Esto personaliza cómo Mina se comunica contigo.",
    cta: "Continuar",
  },
};

interface Slide7SupportProps {
  lang: "en" | "es";
  selected: string[];
  onToggle: (item: string) => void;
  onNext: () => void;
}

export default function Slide7Support({ lang, selected, onToggle, onNext }: Slide7SupportProps) {
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

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <SelectableChip
            key={opt}
            label={opt}
            selected={selected.includes(opt)}
            onToggle={() => onToggle(opt)}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={selected.length === 0}
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all"
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
