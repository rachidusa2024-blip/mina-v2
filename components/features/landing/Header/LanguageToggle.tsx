"use client";

interface LanguageToggleProps {
  lang: "en" | "es";
  onToggle: (lang: "en" | "es") => void;
  compact?: boolean;
}

export default function LanguageToggle({ lang, onToggle, compact = false }: LanguageToggleProps) {
  return (
    <div
      className="flex items-center rounded-full p-0.5"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid var(--border)",
      }}
    >
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          onClick={() => onToggle(l)}
          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
            compact ? "px-2.5 py-0.5" : ""
          }`}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: lang === l ? "var(--teal)" : "transparent",
            color: lang === l ? "#090D1A" : "var(--text-muted)",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
