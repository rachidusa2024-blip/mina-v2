"use client";

import SelectableChip from "../SelectableChip";

const OPTIONS = {
  en: [
    "I'm afraid to answer calls",
    "I don't know what to say",
    "I feel overwhelmed",
    "I avoid looking at letters",
    "I'm scared of making things worse",
    "I feel stuck",
    "I keep delaying everything",
    "I panic under pressure",
    "I feel ashamed",
    "I can't think clearly",
  ],
  es: [
    "Tengo miedo de contestar llamadas",
    "No sé qué decir",
    "Me siento abrumado",
    "Evito mirar las cartas",
    "Tengo miedo de empeorar las cosas",
    "Me siento atascado",
    "Sigo postergando todo",
    "Entro en pánico bajo presión",
    "Me siento avergonzado",
    "No puedo pensar con claridad",
  ],
};

const t = {
  en: {
    headline: "What feels hardest right now?",
    sub: "Choose up to 3.",
    cta: "Continue",
    skip: "Skip this",
  },
  es: {
    headline: "¿Qué se siente más difícil ahora mismo?",
    sub: "Elige hasta 3.",
    cta: "Continuar",
    skip: "Omitir",
  },
};

interface Slide3HardestProps {
  lang: "en" | "es";
  selected: string[];
  onToggle: (item: string) => void;
  onNext: () => void;
}

const MAX = 3;

export default function Slide3Hardest({ lang, selected, onToggle, onNext }: Slide3HardestProps) {
  const c = t[lang];
  const options = OPTIONS[lang];
  const atMax = selected.length >= MAX;

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
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>
            {c.sub}
          </p>
          <p
            className="text-xs font-semibold"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: atMax ? "var(--teal)" : "rgba(136,146,164,0.5)",
            }}
          >
            {selected.length}/{MAX}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <SelectableChip
            key={opt}
            label={opt}
            selected={selected.includes(opt)}
            onToggle={() => onToggle(opt)}
            disabled={atMax}
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
