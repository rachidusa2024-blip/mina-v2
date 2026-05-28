"use client";

import SelectableChip from "../SelectableChip";

const OPTIONS = {
  en: [
    "I avoid everything",
    "I answer too quickly",
    "I panic and agree",
    "I shut down emotionally",
    "I overthink everything",
    "I try to solve everything at once",
    "I ignore calls and messages",
    "I become anxious after conversations",
  ],
  es: [
    "Evito todo",
    "Respondo demasiado rápido",
    "Entro en pánico y acepto",
    "Me apago emocionalmente",
    "Pienso demasiado todo",
    "Intento resolver todo a la vez",
    "Ignoro llamadas y mensajes",
    "Me pongo ansioso después de conversaciones",
  ],
};

const t = {
  en: {
    headline: "When pressure increases, what usually happens?",
    sub: "Select all that apply.",
    cta: "Continue",
    skip: "Skip this",
  },
  es: {
    headline: "Cuando aumenta la presión, ¿qué suele pasar?",
    sub: "Selecciona todo lo que aplique.",
    cta: "Continuar",
    skip: "Omitir",
  },
};

interface Slide6BehaviorProps {
  lang: "en" | "es";
  selected: string[];
  onToggle: (item: string) => void;
  onNext: () => void;
}

export default function Slide6Behavior({ lang, selected, onToggle, onNext }: Slide6BehaviorProps) {
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

      <div className="flex flex-col gap-2">
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
        <button
          onClick={onNext}
          className="w-full py-2.5 text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(136,146,164,0.5)" }}
        >
          {c.skip}
        </button>
      </div>
    </div>
  );
}
